// rules.js — 8-ball game rules, AI, input, HUD, main loop
// Requires physics.js to be loaded first (uses window.Pool)

(() => {
    // ── Import from physics.js ──────────────────────────────────────────
    const Pool        = window.Pool;
    const state       = Pool.state;
    const F           = Pool.F;
    const BALL_R      = Pool.BALL_R;
    const MAX_POWER   = Pool.MAX_POWER;
    const CHARGE_RATE = Pool.CHARGE_RATE;
    const POCKETS     = Pool.POCKETS;
    const FX2         = Pool.FX2;
    const FY2         = Pool.FY2;
    const BALL_COLORS = Pool.BALL_COLORS;
    const Ball        = Pool.Ball;
    const isSolid     = Pool.isSolid;
    const isStripe    = Pool.isStripe;
    const isEightBall = Pool.isEightBall;
    const setMessage  = Pool.setMessage;
    const resetGame   = Pool.resetGame;
    const draw        = Pool.draw;
    const update      = Pool.update;
    const updateIntro = Pool.updateIntro;
    const canvas      = Pool.canvas;
    const W           = Pool.W;
    const H           = Pool.H;
    const initAudio   = Pool.initAudio;
    const resumeAudio = Pool.resumeAudio;
    const soundCharge = Pool.soundCharge;
    const soundWin    = Pool.soundWin;
    const soundFoul   = Pool.soundFoul;
    const soundShot   = Pool.soundShot;
    const soundArrival = Pool.soundArrival;
    const drawBallAt  = Pool.drawBallAt;

    // -----------------------------------------------------------------------
    // Tournament state
    // -----------------------------------------------------------------------
    const tournament = { playerStars: 0, aiStars: 0, MAX: 3 };

    function awardStar(playerWon) {
        if (playerWon) {
            if (tournament.aiStars > 0) tournament.aiStars--;
            else tournament.playerStars++;
        } else {
            if (tournament.playerStars > 0) tournament.playerStars--;
            else tournament.aiStars++;
        }
        updateStarsDisplay();
    }

    function updateStarsDisplay() {
        const ps = document.getElementById('playerStars');
        const as = document.getElementById('aiStars');
        if (ps) ps.innerHTML = '⭐'.repeat(tournament.playerStars) || '';
        if (as) as.innerHTML = '⭐'.repeat(tournament.aiStars) || '';
    }

    function checkTournamentWin() {
        if (tournament.playerStars >= tournament.MAX) return 'player';
        if (tournament.aiStars >= tournament.MAX) return 'ai';
        return null;
    }

    // -----------------------------------------------------------------------
    // 8-Ball shot resolution
    // -----------------------------------------------------------------------
    function getPlayerGroup(who) {
        return who === 'player' ? state.playerGroup : state.aiGroup;
    }

    function getAllGroupBallsPotted(who, excludeBalls) {
        const group = getPlayerGroup(who);
        if (!group) return false;
        // excludeBalls = balls potted THIS shot (already marked potted in physics)
        // Pass them to pretend they are still on table — checks PRE-SHOT state
        const excluded = excludeBalls ? new Set(excludeBalls) : new Set();
        const groupBallsOnTable = state.balls.filter(b => {
            if (isEightBall(b.number)) return false;
            const stillOnTable = !b.potted || excluded.has(b);
            if (!stillOnTable) return false;
            if (group === 'solids') return isSolid(b.number);
            return isStripe(b.number);
        });
        return groupBallsOnTable.length === 0;
    }

    function canShootEightBall(who, excludeBalls) {
        return getAllGroupBallsPotted(who, excludeBalls);
    }

    function onShotEnd() {
        const isAI = state.turn === 'ai';
        const who = state.turn;
        const opponent = isAI ? 'player' : 'ai';
        const potted = state.pottedThisShot;
        const cuePotted = state.cuePotted;
        const firstHit = state.firstHitBall;
        let foul = false;
        let loseGame = false;
        let winGame = false;
        let msg = '';
        let eightPotted = potted.some(b => isEightBall(b.number));

        // --- Break shot special rules ---
        if (state.isBreakShot) {
            state.isBreakShot = false;

            if (cuePotted) {
                foul = true;
                msg = (isAI ? 'Снеговик' : 'Игрок') + ': фол на разбитии (биток в лузу). ';
            }

            if (eightPotted) {
                // 8-ball potted on break: re-rack (special rule)
                msg = 'Шар 8 забит на разбитии! Переигровка. ';
                resetGame(true);
                updateHUD();
                setMessage(msg);
                return;
            }

            // Assign groups if any non-8 ball was potted
            if (!foul && potted.length > 0) {
                const solidsPotted = potted.filter(b => isSolid(b.number));
                const stripesPotted = potted.filter(b => isStripe(b.number));

                if (solidsPotted.length > 0 || stripesPotted.length > 0) {
                    if (solidsPotted.length > stripesPotted.length) {
                        assignGroups(who, 'solids');
                    } else if (stripesPotted.length > solidsPotted.length) {
                        assignGroups(who, 'stripes');
                    } else {
                        // Equal: assign solids to breaker
                        assignGroups(who, 'solids');
                    }
                }

                // Record potted balls
                for (const b of potted) {
                    recordPottedBall(who, b.number);
                }

                if (!foul) {
                    msg = (isAI ? 'Снеговик' : 'Игрок') + ' забил на разбитии. ';
                    // Breaker continues
                    startTurn(who, msg);
                    return;
                }
            }

            if (foul) {
                respotCueBall();
                switchTurnWithBallInHand(opponent, msg);
                return;
            }

            // No balls potted on break — switch turn
            msg = (isAI ? 'Снеговик' : 'Игрок') + ': ни одного шара на разбитии. ';
            switchTurn(opponent, msg);
            return;
        }

        // --- Normal shot rules ---
        const myGroup = getPlayerGroup(who);

        // Check fouls
        if (cuePotted) {
            foul = true;
            msg += (isAI ? 'Снеговик' : 'Игрок') + ': биток в лузу! Фол. ';
        }

        if (!state.anyBallHit) {
            foul = true;
            msg += (isAI ? 'Снеговик' : 'Игрок') + ': не задет ни один шар! Фол. ';
        } else if (firstHit && myGroup) {
            // Must hit own group first (unless shooting at 8)
            // Pass potted-this-shot so foul check sees PRE-SHOT table state
            const shootingEight = canShootEightBall(who, potted);
            if (shootingEight) {
                if (!isEightBall(firstHit.number)) {
                    foul = true;
                    msg += (isAI ? 'Снеговик' : 'Игрок') + ': нужно бить по шару 8! Фол. ';
                }
            } else {
                if (!isBallInMyGroup(who, firstHit.number)) {
                    foul = true;
                    msg += (isAI ? 'Снеговик' : 'Игрок') + ': первое касание не своего шара! Фол. ';
                }
            }
        }

        // Rail rule: after contact, at least one ball must touch a rail or be potted
        if (state.anyBallHit && !state.railHitAfterContact && potted.length === 0 && !cuePotted) {
            foul = true;
            msg += 'Ни один шар не коснулся борта после контакта! Фол. ';
        }

        // Check 8-ball potted
        if (eightPotted) {
            if (!canShootEightBall(who)) {
                // 8-ball potted too early — lose
                loseGame = true;
                msg = (isAI ? 'Снеговик' : 'Игрок') + ' забил шар 8 раньше времени! ';
            } else if (cuePotted) {
                // 8-ball + cue potted — lose
                loseGame = true;
                msg = (isAI ? 'Снеговик' : 'Игрок') + ' забил шар 8, но биток тоже в лузе! ';
            } else if (!state.anyBallHit) {
                // No contact at all — lose
                loseGame = true;
                msg += (isAI ? 'Снеговик' : 'Игрок') + ' забил шар 8 с фолом (нет контакта)! ';
            } else {
                // Legal 8-ball pot — win!
                winGame = true;
                msg = (isAI ? 'Снеговик' : 'Игрок') + ' забил шар 8! ';
            }
        }

        if (loseGame) {
            if (isAI) {
                state.playerWins++;
                endGame(true, msg + 'Игрок выиграл!');
            } else {
                state.aiWins++;
                endGame(false, msg + 'Снеговик выиграл!');
            }
            return;
        }

        if (winGame) {
            if (isAI) {
                state.aiWins++;
                endGame(false, msg + 'Снеговик выиграл!');
            } else {
                state.playerWins++;
                endGame(true, msg + 'Игрок выиграл!');
            }
            return;
        }

        // Record potted balls
        let ownBallPotted = false;
        for (const b of potted) {
            if (isEightBall(b.number)) continue;
            recordPottedBall(who, b.number);
            if (myGroup && isBallInMyGroup(who, b.number)) ownBallPotted = true;
        }

        // Assign groups if not yet assigned and a ball was potted
        if (!state.playerGroup && potted.length > 0) {
            const solidsPotted = potted.filter(b => isSolid(b.number));
            const stripesPotted = potted.filter(b => isStripe(b.number));
            if (solidsPotted.length > 0 && stripesPotted.length === 0) {
                assignGroups(who, 'solids');
                ownBallPotted = true;
            } else if (stripesPotted.length > 0 && solidsPotted.length === 0) {
                assignGroups(who, 'stripes');
                ownBallPotted = true;
            } else if (solidsPotted.length > 0 && stripesPotted.length > 0) {
                // Mixed: assign based on which has more
                if (solidsPotted.length >= stripesPotted.length) {
                    assignGroups(who, 'solids');
                } else {
                    assignGroups(who, 'stripes');
                }
                ownBallPotted = true;
            }
        }

        if (foul) {
            if (cuePotted) respotCueBall();
            switchTurnWithBallInHand(opponent, msg);
            return;
        }

        if (potted.length > 0 && ownBallPotted) {
            msg += (isAI ? 'Снеговик' : 'Игрок') + ' забил. ';
            if (canShootEightBall(who)) msg += 'Можно бить шар 8! ';
            startTurn(who, msg);
        } else if (potted.length > 0 && !ownBallPotted) {
            msg += (isAI ? 'Снеговик' : 'Игрок') + ` забил шар соперника. Переход хода. `;
            // Opponent's balls were potted — still counts, but turn switches
            switchTurn(opponent, msg);
        } else {
            msg += (isAI ? 'Снеговик' : 'Игрок') + ': промах. ';
            switchTurn(opponent, msg);
        }
    }

    function isBallInMyGroup(who, num) {
        const group = getPlayerGroup(who);
        if (!group) return true; // groups not yet assigned, any ball is fine
        if (group === 'solids') return isSolid(num);
        return isStripe(num);
    }

    function assignGroups(who, group) {
        if (who === 'player') {
            state.playerGroup = group;
            state.aiGroup = group === 'solids' ? 'stripes' : 'solids';
        } else {
            state.aiGroup = group;
            state.playerGroup = group === 'solids' ? 'stripes' : 'solids';
        }
    }

    function recordPottedBall(who, num) {
        if (isEightBall(num)) return;
        if (who === 'player') {
            if (!state.playerPotted.includes(num)) state.playerPotted.push(num);
        } else {
            if (!state.aiPotted.includes(num)) state.aiPotted.push(num);
        }
    }

    function respotCueBall() {
        const cue = state.balls.find(b => b.isCue);
        if (cue) {
            cue.potted = false;
            cue.x = F.x + F.w * 0.25;
            cue.y = F.y + F.h * 0.5;
            cue.vx = 0; cue.vy = 0;
        }
    }

    function switchTurn(to, msg) {
        state.turn = to;
        if (to === 'ai') {
            state.aiState = 'thinking';
            state.aiTimer = 60;
            msg += 'Ход Снеговика.';
        } else {
            state.aiState = 'idle';
            msg += 'Ход Игрока.';
        }
        state.ballInHand = false;
        state.placingCue = false;
        setMessage(msg);
    }

    function switchTurnWithBallInHand(to, msg) {
        state.turn = to;
        state.ballInHand = true;
        if (to === 'ai') {
            // AI places cue ball automatically
            state.aiState = 'thinking';
            state.aiTimer = 40;
            state.ballInHand = false; // AI handles it internally
            aiPlaceCueBall();
            msg += 'Ход Снеговика (свободный шар).';
        } else {
            state.placingCue = true;
            state.aiState = 'idle';
            msg += 'Ход Игрока. Кликните на стол для установки битка.';
        }
        setMessage(msg);
    }

    function startTurn(who, msg) {
        state.turn = who;
        if (who === 'ai') {
            state.aiState = 'thinking';
            state.aiTimer = 50;
            msg += 'Ход Снеговика.';
        } else {
            state.aiState = 'idle';
            msg += 'Ход Игрока.';
        }
        state.ballInHand = false;
        state.placingCue = false;
        setMessage(msg);
    }

    function endGame(playerWon, msg) {
        state.gameOver = true;
        state.lastWinner = playerWon ? 'player' : 'ai';
        setMessage(msg);
        awardStar(playerWon);
        const tournWinner = checkTournamentWin();

        if (tournWinner) {
            // Tournament over — show modal with button
            soundWin();
            const modal = document.getElementById('winModal');
            const textEl = document.getElementById('winText');
            const title = modal?.querySelector('h2');
            if (tournWinner === 'player') {
                if (title) title.textContent = 'ПОБЕДА В ТУРНИРЕ!';
                if (textEl) textEl.textContent = 'Игрок выиграл турнир! 🏆';
            } else {
                if (title) title.textContent = 'ТУРНИР ПРОИГРАН';
                if (textEl) textEl.textContent = 'Снеговик выиграл турнир! ⛄';
            }
            if (modal) modal.classList.add('active');
            tournament.playerStars = 0;
            tournament.aiStars = 0;
            updateStarsDisplay();
        } else {
            // Regular game over — show message briefly, then auto-start
            if (playerWon) soundWin(); else soundFoul();
            setMessage((playerWon ? '🏆 ' : '💀 ') + msg + ' Следующая партия...');
            setTimeout(() => {
                state.nextTurn = state.lastWinner || 'player';
                resetGame(true);
                updateHUD();
            }, 2000);
        }
    }

    // -----------------------------------------------------------------------
    // AI
    // -----------------------------------------------------------------------
    function aiPlaceCueBall() {
        // Place cue ball at a good position
        const cue = state.balls.find(b => b.isCue);
        if (!cue) return;
        cue.potted = false;

        // Try center-left area, find a spot not overlapping other balls
        let bestX = F.x + F.w * 0.25;
        let bestY = F.y + F.h * 0.5;

        for (let attempt = 0; attempt < 50; attempt++) {
            const tx = F.x + BALL_R + Math.random() * (F.w - 2 * BALL_R);
            const ty = F.y + BALL_R + Math.random() * (F.h - 2 * BALL_R);
            let valid = true;
            for (const b of state.balls) {
                if (b.isCue || b.potted) continue;
                if (Math.hypot(tx - b.x, ty - b.y) < BALL_R * 2.5) { valid = false; break; }
            }
            if (valid) { bestX = tx; bestY = ty; break; }
        }

        cue.x = bestX; cue.y = bestY;
        cue.vx = 0; cue.vy = 0;
    }

    function pathClear(x1, y1, x2, y2, excludeA, excludeB) {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len === 0) return true;
        const nx = dx / len, ny = dy / len;
        for (const b of state.balls) {
            if (b.potted || b === excludeA || b === excludeB) continue;
            const tx = b.x - x1, ty = b.y - y1;
            const proj = tx * nx + ty * ny;
            if (proj < -BALL_R || proj > len + BALL_R) continue;
            const clampedProj = Math.max(0, Math.min(len, proj));
            const closestX = x1 + nx * clampedProj;
            const closestY = y1 + ny * clampedProj;
            if (Math.hypot(b.x - closestX, b.y - closestY) < BALL_R * 2 - 1) return false;
        }
        return true;
    }

    function aiFindBestShot() {
        const cue = state.balls.find(b => b.isCue && !b.potted);
        if (!cue) return null;

        const myGroup = state.aiGroup;
        const canShoot8 = canShootEightBall('ai');

        // Determine which balls AI should target
        function isTargetBall(b) {
            if (b.isCue || b.potted) return false;
            if (canShoot8) return isEightBall(b.number);
            if (!myGroup) return !isEightBall(b.number); // groups not assigned yet
            if (myGroup === 'solids') return isSolid(b.number);
            return isStripe(b.number);
        }

        let best = null, bestScore = -Infinity;

        for (const ball of state.balls) {
            if (!isTargetBall(ball)) continue;

            for (const pocket of POCKETS) {
                const bpDx = pocket.x - ball.x, bpDy = pocket.y - ball.y;
                const bpLen = Math.hypot(bpDx, bpDy);
                if (bpLen < 1) continue;
                const bpNx = bpDx / bpLen, bpNy = bpDy / bpLen;

                const ghostX = ball.x - bpNx * BALL_R * 2;
                const ghostY = ball.y - bpNy * BALL_R * 2;

                if (ghostX < F.x + BALL_R || ghostX > FX2 - BALL_R) continue;
                if (ghostY < F.y + BALL_R || ghostY > FY2 - BALL_R) continue;

                if (!pathClear(cue.x, cue.y, ghostX, ghostY, cue, ball)) continue;
                if (!pathClear(ball.x, ball.y, pocket.x, pocket.y, cue, ball)) continue;

                let sc = 0;

                // Prefer shorter ball-to-pocket
                sc -= bpLen * 0.04;

                // Prefer shorter cue-to-ghost
                const cueDist = Math.hypot(ghostX - cue.x, ghostY - cue.y);
                sc -= cueDist * 0.025;

                // Prefer head-on shots
                const aimDx = ghostX - cue.x, aimDy = ghostY - cue.y;
                const aimLen = Math.hypot(aimDx, aimDy);
                if (aimLen > 0) {
                    const nX = ball.x - ghostX, nY = ball.y - ghostY;
                    const nLen = Math.hypot(nX, nY);
                    if (nLen > 0) {
                        const dot = (aimDx / aimLen) * (nX / nLen) + (aimDy / aimLen) * (nY / nLen);
                        sc += dot * 25;
                    }
                }

                // Bonus for 8-ball when ready
                if (isEightBall(ball.number) && canShoot8) sc += 30;

                if (sc > bestScore) {
                    bestScore = sc;
                    const power = Math.min(MAX_POWER, Math.max(4, (cueDist + bpLen) * 0.05));
                    best = { aimX: ghostX, aimY: ghostY, power, ball, pocket };
                }
            }
        }

        // Fallback: hit nearest legal ball
        if (!best) {
            let nearestDist = Infinity, nearest = null;
            for (const b of state.balls) {
                if (b.isCue || b.potted || isEightBall(b.number)) continue;
                if (myGroup === 'solids' && !isSolid(b.number)) continue;
                if (myGroup === 'stripes' && !isStripe(b.number)) continue;
                const d = Math.hypot(b.x - cue.x, b.y - cue.y);
                if (d < nearestDist) { nearestDist = d; nearest = b; }
            }
            if (!nearest) {
                // No legal balls, try any non-eight ball
                for (const b of state.balls) {
                    if (b.isCue || b.potted || isEightBall(b.number)) continue;
                    const d = Math.hypot(b.x - cue.x, b.y - cue.y);
                    if (d < nearestDist) { nearestDist = d; nearest = b; }
                }
            }
            if (nearest) {
                const power = Math.min(MAX_POWER, Math.max(6, nearestDist * 0.06));
                best = { aimX: nearest.x, aimY: nearest.y, power, ball: nearest, pocket: null };
            }
        }

        return best;
    }

    function updateAI() {
        if (state.turn !== 'ai' || state.moving || state.phase !== 'play') return;
        if (state.gameOver) return;

        if (state.aiState === 'thinking') {
            state.aiTimer--;
            if (state.aiTimer <= 0) {
                const shot = aiFindBestShot();
                if (!shot) {
                    state.turn = 'player';
                    state.aiState = 'idle';
                    setMessage('Снеговик не нашёл удара. Ход Игрока.');
                    return;
                }
                state.aiShot = shot;
                state.aiState = 'aiming';
                state.aiAimProgress = 0;
                const cue = state.balls.find(b => b.isCue && !b.potted);
                if (cue) state.aim = { x: cue.x, y: cue.y };
            }
        } else if (state.aiState === 'aiming') {
            state.aiAimProgress = Math.min(1, state.aiAimProgress + 0.03);
            const shot = state.aiShot;
            const cue = state.balls.find(b => b.isCue && !b.potted);
            if (!cue) return;
            const t = state.aiAimProgress < 0.5
                ? 2 * state.aiAimProgress * state.aiAimProgress
                : 1 - Math.pow(-2 * state.aiAimProgress + 2, 2) / 2;
            state.aim = {
                x: cue.x + (shot.aimX - cue.x) * t,
                y: cue.y + (shot.aimY - cue.y) * t,
            };
            state.power = shot.power * t;
            if (state.aiAimProgress >= 1) {
                state.aiState = 'shooting';
                state.aiTimer = 8;
            }
        } else if (state.aiState === 'shooting') {
            state.aiTimer--;
            if (state.aiTimer <= 0) {
                state.aiState = 'idle';
                const shot = state.aiShot;
                state.aim = { x: shot.aimX, y: shot.aimY };
                state.power = shot.power;
                shoot();
            }
        }
    }

    // -----------------------------------------------------------------------
    // Shooting
    // -----------------------------------------------------------------------
    function shoot() {
        if (state.moving || state.phase !== 'play') return;
        const cue = state.balls.find(b => b.isCue);
        if (!cue || cue.potted) return;
        const dx = state.aim.x - cue.x, dy = state.aim.y - cue.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;
        const p = state.power;
        if (p < 0.5) return;
        cue.vx = (dx / dist) * p;
        cue.vy = (dy / dist) * p;
        state.power = 0;
        state.moving = true;

        // Reset shot tracking
        state.pottedThisShot = [];
        state.cuePotted = false;
        state.firstHitBall = null;
        state.railHitAfterContact = false;
        state.anyBallHit = false;
        Pool.resetBallsTouchedRail();

        soundShot(p);
    }

    function handleInput() {
        if (state.charging && state.phase === 'play' && !state.moving && !state.gameOver && !state.placingCue) {
            state.power += CHARGE_RATE;
            if (state.power >= MAX_POWER) state.power = state.power % MAX_POWER;
        }
    }

    // -----------------------------------------------------------------------
    // HUD
    // -----------------------------------------------------------------------
    function updateHUD() {
        const powerFillEl = document.getElementById('powerFill');
        if (powerFillEl) powerFillEl.style.width = (state.power / MAX_POWER * 100) + '%';

        const turnEl = document.getElementById('turnIndicator');
        if (turnEl) {
            if (state.turn === 'player') {
                turnEl.textContent = 'ХОД ИГРОКА';
                turnEl.className = 'turn-player';
            } else {
                turnEl.textContent = 'ХОД Снеговика';
                turnEl.className = 'turn-ai';
            }
        }

        const bihEl = document.getElementById('ballInHandIndicator');
        if (bihEl) bihEl.style.display = state.placingCue ? '' : 'none';

        // Player group
        const pgEl = document.getElementById('playerGroup');
        if (pgEl) {
            if (state.playerGroup === 'solids') pgEl.textContent = '● Сплошные (1-7)';
            else if (state.playerGroup === 'stripes') pgEl.textContent = '◐ Полосатые (9-15)';
            else pgEl.textContent = '—';
        }

        const agEl = document.getElementById('aiGroup');
        if (agEl) {
            if (state.aiGroup === 'solids') agEl.textContent = '● Сплошные (1-7)';
            else if (state.aiGroup === 'stripes') agEl.textContent = '◐ Полосатые (9-15)';
            else agEl.textContent = '—';
        }

        // Potted balls display
        updatePottedDisplay('playerPotted', state.playerPotted);
        updatePottedDisplay('aiPotted', state.aiPotted);

        // Active turn highlight
        const playerBlock = document.getElementById('playerBlock');
        const aiBlock = document.getElementById('aiBlock');
        if (playerBlock) playerBlock.classList.toggle('active-turn', state.turn === 'player');
        if (aiBlock) aiBlock.classList.toggle('active-turn', state.turn === 'ai');
    }

    function updatePottedDisplay(elId, potted) {
        const el = document.getElementById(elId);
        if (!el) return;
        const slots = el.querySelectorAll('.mini-ball-slot');
        const sorted = [...potted].sort((a, b) => a - b);
        slots.forEach((slot, i) => {
            const num = sorted[i];
            if (num !== undefined) {
                slot.className = 'mini-ball-slot filled' + (isStripe(num) ? ' stripe' : '');
                slot.style.backgroundColor = BALL_COLORS[num];
                if (isStripe(num)) {
                    slot.style.setProperty('--ball-color', BALL_COLORS[num]);
                    slot.style.backgroundColor = '';
                }
                slot.textContent = num;
            } else {
                slot.className = 'mini-ball-slot';
                slot.style.backgroundColor = '';
                slot.style.removeProperty('--ball-color');
                slot.textContent = '';
            }
        });
    }

    // -----------------------------------------------------------------------
    // Input
    // -----------------------------------------------------------------------
    function canvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (W / rect.width),
            y: (e.clientY - rect.top)  * (H / rect.height),
        };
    }
    function clampToFelt(p) {
        return {
            x: Math.max(F.x + BALL_R, Math.min(FX2 - BALL_R, p.x)),
            y: Math.max(F.y + BALL_R, Math.min(FY2 - BALL_R, p.y)),
        };
    }

    canvas.addEventListener('mousemove', (e) => {
        if (state.turn === 'ai' && !state.placingCue) return;
        state.aim = clampToFelt(canvasCoords(e));
    });

    canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        initAudio(); resumeAudio();

        if (state.placingCue && state.turn === 'player') {
            // Place cue ball
            const pos = clampToFelt(canvasCoords(e));
            const cue = state.balls.find(b => b.isCue);
            if (!cue) return;

            // Check not overlapping any ball
            let valid = true;
            for (const b of state.balls) {
                if (b.isCue || b.potted) continue;
                if (Math.hypot(pos.x - b.x, pos.y - b.y) < BALL_R * 2.2) { valid = false; break; }
            }
            if (!valid) {
                setMessage('Нельзя ставить биток вплотную к шару! Выберите другое место.');
                return;
            }

            cue.potted = false;
            cue.x = pos.x; cue.y = pos.y;
            cue.vx = 0; cue.vy = 0;
            state.placingCue = false;
            state.ballInHand = false;
            setMessage('Биток установлен. Ход Игрока.');
            return;
        }

        if (state.turn === 'ai') return;
        if (state.moving || state.phase !== 'play' || state.gameOver) return;
        state.aim = clampToFelt(canvasCoords(e));
        state.charging = true;
        soundCharge();
    });

    const onRelease = () => {
        if (state.charging) { state.charging = false; shoot(); }
    };
    canvas.addEventListener('mouseup', onRelease);
    window.addEventListener('mouseup', onRelease);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            initAudio(); resumeAudio();
            closeAllModals();
            resetGame(true);
            updateHUD();
        });
    }

    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            state.muted = !state.muted;
            muteBtn.textContent = state.muted ? '🔇' : '🔊';
            initAudio(); resumeAudio();
        });
    }

    // -----------------------------------------------------------------------
    // Modals
    // -----------------------------------------------------------------------
    function closeAllModals() {
        document.getElementById('gameOverModal')?.classList.remove('active');
        document.getElementById('winModal')?.classList.remove('active');
    }

    // Tournament win modal — button starts fresh tournament
    const btnNewGameWin = document.getElementById('btnNewGameAfterWin');
    if (btnNewGameWin) {
        btnNewGameWin.addEventListener('click', () => {
            closeAllModals();
            state.nextTurn = state.lastWinner || 'player';
            resetGame(true);
            updateHUD();
        });
    }

    // -----------------------------------------------------------------------
    // Main loop
    // -----------------------------------------------------------------------
    function loop() {
        handleInput();
        updateAI();
        if (state.phase === 'play' && state.moving) update();
        if (state.phase === 'intro') updateIntro();
        draw();
        updateHUD();
        requestAnimationFrame(loop);
    }


    // ── Wire callbacks into Pool ────────────────────────────────────────
    // Rules modal
    document.getElementById('rulesBtn')?.addEventListener('click', () => {
        document.getElementById('rulesModal')?.classList.add('active');
    });
    document.getElementById('btnCloseRules')?.addEventListener('click', () => {
        document.getElementById('rulesModal')?.classList.remove('active');
    });
    document.getElementById('rulesModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
    });

    Pool.shoot     = shoot;
    Pool.onShotEnd = onShotEnd;
    Pool.updateHUD = updateHUD;

    resetGame(true);
    updateHUD();
    loop();
})();