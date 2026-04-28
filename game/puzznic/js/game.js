// ================================================================
//  Puzznic JS — ПОЛНАЯ ВЕРСИЯ (гравитация, платформы, темы, сохранения)
// ================================================================

const TILE = 52;
const SPEED = 1;
const GRAVITY = 8;

// ========== НАБОРЫ ТЕМ ==========
const THEMES = {
    animals: {
        name: "🐾 Животные",
        emojis: { '-':'🧱','~':'↔️','|':'↕️','E':'⛄','G':'🦊','B':'🐈','P':'🐶','X':'🐧','C':'🐰','D':'🐸','T':'🐞' },
        colors: { '~':'#ff9800','|':'#ff5722','E':'#1b5e20','G':'#8bc34a','B':'#2196f3','P':'#9c27b0','X':'#ffc107','C':'#00bcd4','D':'#e91e63','T':'#795548' }
    },
    fruits: {
        name: "🍎 Фрукты",
          emojis: {
            '-': '🧱', '~': '↔️', '|': '↕️',
            'E': '🥒', 'G': '🍐', 'B': '🍊',
            'P': '🍋', 'X': '🥝', 'C': '🍉',
            'D': '🍇', 'T': '🍒'
        },
        colors: {
            '~': '#ff9800', '|': '#ff5722',
            'E': '#e53935', 'G': '#8bc34a', 'B': '#ff9800',
            'P': '#ffee58', 'X': '#fdd835', 'C': '#4caf50',
            'D': '#9c27b0', 'T': '#e91e63'
        }
    },
    
    
       space: {
        name: "🔢 Цифры",
        emojis: {
            '-': '🧱', '~': '↔️', '|': '↕️',
            'E': '1️⃣', 'G': '2️⃣', 'B': '3️⃣',
            'P': '4️⃣', 'X': '5️⃣', 'C': '6️⃣',
            'D': '7️⃣', 'T': '8️⃣'
        },
         colors: { '~':'#ff9800','|':'#ff5722','E':'#00a6ed','G':'#00a6ed','B':'#00a6ed','P':'#00a6ed','X':'#00a6ed','C':'#00a6ed','D':'#00a6ed','T':'#00a6ed' }
    },
    food: {
        name: "🍕 Еда",
        emojis: { '-':'🧱','~':'↔️','|':'↕️','E':'🍕','G':'🍔','B':'🌮','P':'🥗','X':'🍣','C':'🍜','D':'🍦','T':'☕' },
        colors: { '~':'#ff9800','|':'#ff5722','E':'#ff7043','G':'#ffb74d','B':'#aed581','P':'#66bb6a','X':'#ff8a65','C':'#ffd54f','D':'#ce93d8','T':'#d7ccc8' }
    },
    sports: {
        name: "⚽ Спорт",
        emojis: { '-':'🧱','~':'↔️','|':'↕️','E':'⚽','G':'🏀','B':'🏈','P':'⚾','X':'🎾','C':'🏐','D':'🏓','T':'🥊' },
        colors: { '~':'#ff9800','|':'#ff5722','E':'#ffffff','G':'#ff8a65','B':'#795548','P':'#fdd835','X':'#4caf50','C':'#ff7043','D':'#26c6da','T':'#ef5350' }
    },
    classic: {
        name: "🙂 Смайлики",
        emojis: {
            '-': '🧱', '~': '↔️', '|': '↕️',
            'E': '😀', 'G': '🤣', 'B': '🥰',
            'P': '😑', 'X': '😮', 'C': '😱',
            'D': '😡', 'T': '🙃'
        },
        colors: {
            '~': '#ff9800', '|': '#ff5722',
            'E': '#e53935', 'G': '#ff9800', 'B': '#fdd835',
            'P': '#4caf50', 'X': '#2196f3', 'C': '#9c27b0',
            'D': '#e0e0e0', 'T': '#424242'
        }
    }
};

let currentThemeId = 'animals';
let EMOJIS = {};
let COLORS = {};
let _nextId = 1;

// Функция загрузки темы
function loadThemeById(themeId) {
    if (THEMES[themeId]) {
        currentThemeId = themeId;
        EMOJIS = THEMES[themeId].emojis;
        COLORS = THEMES[themeId].colors;
        return true;
    }
    return false;
}

// Загружаем тему по умолчанию
loadThemeById('animals');

class Tile {
    constructor(c, col, row) {
        this.id = _nextId++;
        this.c = c;
        this.x = col * TILE;
        this.y = row * TILE;
        this.vx = 0;
        this.vy = 0;
        this.riding = false;
        this.looping = false;
        this.fadeStep = 0;
        this.draggingDirection = null;
    }

    isPlayable() {
        return this.c !== ' ' && this.c !== '-';
    }

    isNormal() {
        return this.isPlayable() && this.c !== '~' && this.c !== '|';
    }

    isWall() {
        return this.c === '-';
    }

    isPlatform() {
        return this.c === '~' || this.c === '|';
    }
}

function collides(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < TILE && Math.abs(y1 - y2) < TILE;
}

class PuzznicGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.map = [];
        this.blanks = [];
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.player = { col: 0, row: 0 };
        this.dragging = false;
        this.draggingStep = 0;
        this.fadingOut = false;
        
        this.score = 0;
        this.levelId = '1-1';
        
        this.warningPlayed = false;
        this.lastWarningTime = 0;
        this.warningInterval = null;
        
        this.platformMoveCounter = 0;
        this.platformMoveDelay = 40;
        
        this.init();
    }
    
    init() {
        this.updateLevelSelect();
        this.loadLevel('1-1');
        this.updateUI();
        this.gameLoop();
    }
    
    // ========== УПРАВЛЕНИЕ ТЕМАМИ ==========
    switchTheme() {
        const themeIds = Object.keys(THEMES);
        const currentIndex = themeIds.indexOf(currentThemeId);
        const nextIndex = (currentIndex + 1) % themeIds.length;
        const newThemeId = themeIds[nextIndex];
        
        loadThemeById(newThemeId);
        
        this.updateBlockCounters();
        this.render();
        this.showThemeMessage(` Тема: ${THEMES[newThemeId].name}`);
    }
    
    showThemeMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.position = 'fixed';
        msg.style.bottom = '20px';
        msg.style.left = '50%';
        msg.style.transform = 'translateX(-50%)';
        msg.style.backgroundColor = '#000000cc';
        msg.style.color = '#ffd700';
        msg.style.padding = '8px 20px';
        msg.style.borderRadius = '20px';
        msg.style.fontFamily = 'monospace';
        msg.style.fontSize = '16px';
        msg.style.zIndex = '1000';
        msg.style.pointerEvents = 'none';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }
    
    // ========== СОХРАНЕНИЕ ПРОГРЕССА ==========
    saveProgress() {
        const unlockedLevels = this.getUnlockedLevels();
        localStorage.setItem('puzznic_progress', JSON.stringify(unlockedLevels));
    }
    
    getUnlockedLevels() {
        const saved = localStorage.getItem('puzznic_progress');
        if (saved) {
            return JSON.parse(saved);
        }
        return ['1-1'];
    }
    
    isLevelUnlocked(levelId) {
        const unlocked = this.getUnlockedLevels();
        return unlocked.includes(levelId);
    }
    
        unlockNextLevel() {
        const unlocked = this.getUnlockedLevels();
        const allLevels = getAllLevelIds();
        
        // Сортируем уровни
        allLevels.sort((a, b) => {
            const [aGroup, aNum] = a.split('-').map(Number);
            const [bGroup, bNum] = b.split('-').map(Number);
            return aGroup !== bGroup ? aGroup - bGroup : aNum - bNum;
        });
        
        // Находим текущий индекс
        const currentIndex = allLevels.indexOf(this.levelId);
        
        if (currentIndex !== -1 && currentIndex + 1 < allLevels.length) {
            const nextLevel = allLevels[currentIndex + 1];
            if (!unlocked.includes(nextLevel)) {
                unlocked.push(nextLevel);
                localStorage.setItem('puzznic_progress', JSON.stringify(unlocked));
                this.updateLevelSelect();
                this.showThemeMessage(`🔓 Новый уровень открыт: ${nextLevel}!`);
            }
        }
    }
    
    resetProgress() {
        localStorage.setItem('puzznic_progress', JSON.stringify(['1-1']));
        this.updateLevelSelect();
        this.loadLevel('1-1');
        this.score = 0;
        this.updateUI();
        this.showThemeMessage('🔄 Прогресс сброшен!');
    }
    
    // ========== ЗАГРУЗКА УРОВНЕЙ ==========
    loadLevel(levelId) {
        if (!this.isLevelUnlocked(levelId)) {
            this.showThemeMessage(`🔒 Уровень ${levelId} ещё не открыт!`);
            return;
        }
        
        const data = getLevelData(levelId);
        if (!data) return;
        
        _nextId = 1;
        this.levelId = levelId;
        this.width = data.cols;
        this.height = data.rows;
        this.map = [];
        this.blanks = [];
        this.fadingOut = false;
        this.dragging = false;
        this.draggingStep = 0;
        
        const grid = data.grid;
        
        for (let row = 0; row < this.height; row++) {
            const line = grid[row];
            
            const walls = [];
            for (let col = 0; col < this.width; col++) {
                if (line[col] === '-') walls.push(col);
            }
            if (walls.length >= 2) {
                for (let col = walls[0] + 1; col < walls[walls.length - 1]; col++) {
                    this.blanks.push({ x: col * TILE, y: row * TILE });
                }
            }
            
            for (let col = 0; col < this.width; col++) {
                const c = line[col];
                if (c === ' ') continue;
                const tile = new Tile(c, col, row);
                
                if (c === '|') {
                    tile.vy = -SPEED;
                    tile.looping = true;
                }
                if (c === '~') {
                    tile.vx = SPEED;
                    tile.looping = true;
                }
                
                this.map.push(tile);
            }
        }
        
        this.player.col = Math.floor(this.width / 2) - 1;
        this.player.row = Math.floor(this.height / 2);
        
        this.offsetX = Math.max(0, (this.canvas.width - this.width * TILE) / 2);
        this.offsetY = Math.max(0, (this.canvas.height - this.height * TILE) / 2);
        
        const sel = document.getElementById('levelSelect');
        if (sel) sel.value = levelId;
        
        this.updateBlockCounters();
        this.updateUI();
    }
    
    updateLevelSelect() {
        const sel = document.getElementById('levelSelect');
        if (!sel) return;
        
        sel.innerHTML = '';
        
        const allIds = getAllLevelIds();
        const unlocked = this.getUnlockedLevels();
        
        allIds.sort((a, b) => {
            const [aGroup, aNum] = a.split('-').map(Number);
            const [bGroup, bNum] = b.split('-').map(Number);
            return aGroup !== bGroup ? aGroup - bGroup : aNum - bNum;
        });
        
        for (const id of allIds) {
            const isUnlocked = unlocked.includes(id);
            const opt = document.createElement('option');
            opt.value = id;
            
            if (isUnlocked) {
                opt.textContent = id;
            } else {
                opt.textContent = `${id} 🔒`;
                opt.disabled = true;
                opt.style.color = '#666';
            }
            
            sel.appendChild(opt);
        }
        
        if (sel.value !== this.levelId) {
            sel.value = this.levelId;
        }
    }
    
    loadLevelFromSelect() {
        const newLevel = document.getElementById('levelSelect').value;
        if (this.isLevelUnlocked(newLevel)) {
            this.score = 0;
            this.loadLevel(newLevel);
            this.updateUI();
        }
    }
    
    // ========== ОСНОВНАЯ ЛОГИКА ==========
    getTileAt(px, py) {
        for (const t of this.map) {
            if (collides(t.x, t.y, px, py)) return t;
        }
        return null;
    }
    
    getTileAtGrid(col, row) {
        return this.getTileAt(col * TILE, row * TILE);
    }
    
    canMove(tile, dx, dy) {
        const newX = tile.x + dx;
        const newY = tile.y + dy;
        const other = this.getTileAt(newX, newY);
        
        if (!other) return true;
        if (other.isWall()) return false;
        if (other.isPlatform()) return false;
        if (other.isNormal()) return false;
        
        return true;
    }
    
    updatePlatforms() {
        this.platformMoveCounter++;
        if (this.platformMoveCounter < this.platformMoveDelay) return;
        this.platformMoveCounter = 0;

        for (const tile of this.map) {
            if (!tile.looping) continue;

            const currentCol = Math.round(tile.x / TILE);
            const currentRow = Math.round(tile.y / TILE);

            const dx = tile.c === '~' ? Math.sign(tile.vx) : 0;
            const dy = tile.c === '|' ? Math.sign(tile.vy) : 0;
            if (dx === 0 && dy === 0) continue;

            const newCol = currentCol + dx;
            const newRow = currentRow + dy;

            const reverseDir = () => {
                if (dx) tile.vx = -tile.vx;
                if (dy) tile.vy = -tile.vy;
            };

            if (newCol < 0 || newCol >= this.width ||
                newRow < 0 || newRow >= this.height) {
                reverseDir();
                continue;
            }

            const riders = [];
            const directRider = this.getTileAtGrid(currentCol, currentRow - 1);
            if (directRider && directRider.isNormal() && directRider.fadeStep === 0) {
                riders.push(directRider);
            }
            let added = true;
            while (added) {
                added = false;
                for (const rider of [...riders]) {
                    const rCol = Math.round(rider.x / TILE);
                    const rRow = Math.round(rider.y / TILE);
                    const above = this.getTileAtGrid(rCol, rRow - 1);
                    if (above && above.isNormal() && above.fadeStep === 0 &&
                        !riders.some(r => r.id === above.id)) {
                        riders.push(above);
                        added = true;
                    }
                }
            }
            
            // Вертикальная платформа '|' — жёсткая связка:
            // платформа и вся башня наездников двигаются одним целым.
            // Если любой из них упирается в препятствие — разворот.
            // Горизонтальная платформа '~' — свободные наездники:
            // платформа едет всегда, если её путь свободен;
            // каждый блок-наездник едет независимо, если его целевая клетка
            // свободна и его опора снизу тоже едет. Заблокированный блок
            // остаётся на месте и дальше падает благодаря гравитации.
            if (dy !== 0) {
                // Жёсткая связка: платформа + все наездники двигаются вместе
                const groupIds = new Set([tile.id, ...riders.map(r => r.id)]);

                const isCellClear = (col, row) => {
                    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return false;
                    const occ = this.getTileAtGrid(col, row);
                    if (!occ) return true;
                    if (groupIds.has(occ.id)) return true;
                    if (occ.isWall()) return false;
                    if (occ.isPlatform()) return false;
                    if (occ.isNormal() && occ.fadeStep === 0) return false;
                    return true;
                };

                // Проверяем целевые клетки всей связки
                let canMove = isCellClear(newCol, newRow);
                if (canMove) {
                    for (const block of riders) {
                        const bCol = Math.round(block.x / TILE);
                        const bRow = Math.round(block.y / TILE);
                        if (!isCellClear(bCol + dx, bRow + dy)) {
                            canMove = false;
                            break;
                        }
                    }
                }

                if (!canMove) {
                    reverseDir();
                    continue;
                }

                tile.x = newCol * TILE;
                tile.y = newRow * TILE;
                for (const block of riders) {
                    block.x += dx * TILE;
                    block.y += dy * TILE;
                }
            } else {
                // Горизонтальное движение — каждый наездник сам по себе
                const movingIds = new Set([tile.id]);
                const isTargetFreeFor = (col, row) => {
                    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return false;
                    const occ = this.getTileAtGrid(col, row);
                    if (!occ) return true;
                    if (movingIds.has(occ.id)) return true;
                    if (occ.isWall()) return false;
                    if (occ.isPlatform()) return false;
                    if (occ.isNormal() && occ.fadeStep === 0) return false;
                    return true;
                };

                // Итерация: наездник едет, если его опора снизу уже едет
                // и целевая клетка свободна (или тоже освобождается).
                let changed = true;
                while (changed) {
                    changed = false;
                    for (const block of riders) {
                        if (movingIds.has(block.id)) continue;
                        const bCol = Math.round(block.x / TILE);
                        const bRow = Math.round(block.y / TILE);
                        const base = this.getTileAtGrid(bCol, bRow + 1);
                        if (!base || !movingIds.has(base.id)) continue;
                        if (!isTargetFreeFor(bCol + dx, bRow + dy)) continue;
                        movingIds.add(block.id);
                        changed = true;
                    }
                }

                // Платформа двигается, если её собственный путь свободен
                if (!isTargetFreeFor(newCol, newRow)) {
                    reverseDir();
                    continue;
                }

                tile.x = newCol * TILE;
                tile.y = newRow * TILE;
                for (const block of riders) {
                    if (movingIds.has(block.id)) {
                        block.x += dx * TILE;
                        block.y += dy * TILE;
                    }
                }
            }
        }
    }
    
    applyGravity() {
        let moved = true;
        let maxIterations = 30;
        
        while (moved && maxIterations-- > 0) {
            moved = false;
            
            const sorted = [...this.map]
                .filter(t => t.isNormal() && t.fadeStep === 0)
                .sort((a, b) => b.y - a.y);
            
            for (const tile of sorted) {
                const currentCol = Math.round(tile.x / TILE);
                const currentRow = Math.round(tile.y / TILE);
                
                if (currentRow + 1 >= this.height) continue;
                
                const below = this.getTileAt(tile.x, tile.y + TILE);
                
                if (below && below.isPlatform()) continue;
                if (below && below.isWall()) continue;
                if (below && below.isNormal() && below.fadeStep === 0) continue;
                
                const targetX = currentCol * TILE;
                const targetY = (currentRow + 1) * TILE;
                
                const occupier = this.getTileAt(targetX, targetY);
                if (!occupier || !occupier.isNormal()) {
                    tile.x = targetX;
                    tile.y = targetY;
                    moved = true;
                    if (typeof playBlockFall === 'function') playBlockFall();
                }
            }
        }
    }
    
    findAndClearMatches() {
        const toClear = new Set();
        
        for (const tile of this.map) {
            if (!tile.isNormal()) continue;
            if (tile.fadeStep > 0) continue;
            
            const neighbors = [
                this.getTileAt(tile.x + TILE, tile.y),
                this.getTileAt(tile.x - TILE, tile.y),
                this.getTileAt(tile.x, tile.y + TILE),
                this.getTileAt(tile.x, tile.y - TILE)
            ];
            
            for (const neighbor of neighbors) {
                if (neighbor && neighbor.c === tile.c && neighbor.id !== tile.id && neighbor.fadeStep === 0) {
                    toClear.add(tile.id);
                    toClear.add(neighbor.id);
                }
            }
        }
        
        if (toClear.size > 0) {
            for (const tile of this.map) {
                if (toClear.has(tile.id) && tile.fadeStep === 0) {
                    tile.fadeStep = 1;
                    if (typeof playBlockMatch === 'function') playBlockMatch();
                    this.score += 10;
                }
            }
            this.updateUI();
            this.updateBlockCounters();
            return true;
        }
        return false;
    }
    
    updateFading() {
        let hadFade = false;
        
        for (const tile of this.map) {
            if (tile.fadeStep > 0) {
                tile.fadeStep++;
                hadFade = true;
                if (tile.fadeStep >= 15) {
                    tile.fadeStep = 0;
                    tile.c = ' ';
                }
            }
        }
        
        this.map = this.map.filter(t => t.c !== ' ');
        
        if (hadFade) {
            this.updateBlockCounters();
            this.checkVictory();
        }
        
        return hadFade;
    }
    
    tryDragBlock(fromCol, fromRow, direction) {
        const tile = this.getTileAtGrid(fromCol, fromRow);
        if (!tile || !tile.isNormal()) return false;
        if (tile.looping) return false;
        
        let newCol = fromCol;
        
        switch (direction) {
            case 'Left': newCol--; break;
            case 'Right': newCol++; break;
            default: return false;
        }
        
        if (newCol < 0 || newCol >= this.width) return false;
        
        const targetCell = this.getTileAtGrid(newCol, fromRow);
        if (targetCell && targetCell.isWall()) return false;
        if (targetCell && targetCell.isNormal()) return false;
        if (targetCell && targetCell.isPlatform()) return false;
        
        tile.x = newCol * TILE;
        
        if (typeof playBlockMove === 'function') playBlockMove();
        
        setTimeout(() => {
            this.findAndClearMatches();
        }, 50);
        
        return true;
    }
    
    // ========== ДВИЖЕНИЕ ИГРОКА ==========
    movePlayer(dir) {
        let newCol = this.player.col;
        let newRow = this.player.row;
        
        switch (dir) {
            case 'Left': newCol = Math.max(0, newCol - 1); break;
            case 'Right': newCol = Math.min(this.width - 1, newCol + 1); break;
            case 'Up': newRow = Math.max(0, newRow - 1); break;
            case 'Down': newRow = Math.min(this.height - 1, newRow + 1); break;
        }
        
        if (this.dragging && (dir === 'Left' || dir === 'Right')) {
            if (this.tryDragBlock(this.player.col, this.player.row, dir)) {
                // Блок перемещён
            }
        }
        
        this.player.col = newCol;
        this.player.row = newRow;
    }
    
    setDragging(on) {
        this.dragging = on;
    }
    
    setCtrlPressed(pressed) {
        if (pressed) this.setDragging(!this.dragging);
    }
    
    moveCursor(dx, dy) {
        if (dx === -1) this.movePlayer('Left');
        else if (dx === 1) this.movePlayer('Right');
        else if (dy === -1) this.movePlayer('Up');
        else if (dy === 1) this.movePlayer('Down');
    }
    
    // ========== ИГРОВОЙ ЦИКЛ ==========
    gameLoop() {
        this.updatePlatforms();
        this.applyGravity();
        this.findAndClearMatches();
        this.updateFading();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // ========== ОТРИСОВКА ==========
    render() {
        const ctx = this.ctx;
        const ox = this.offsetX;
        const oy = this.offsetY;
       ctx.fillStyle = '#0a0a1a';
       ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
   
    
        
        for (const b of this.blanks) {
            ctx.fillStyle = '#0f0f23';
            ctx.fillRect(ox + b.x, oy + b.y, TILE, TILE);
            ctx.strokeStyle = '#4a4a7a';
            ctx.strokeRect(ox + b.x, oy + b.y, TILE, TILE);
        }
        
        for (const t of this.map) {
            const px = ox + t.x;
            const py = oy + t.y;
            
            if (t.fadeStep > 0) {
                ctx.globalAlpha = 1 - (t.fadeStep / 15);
            } else {
                ctx.globalAlpha = 1.0;
            }
            
            if (t.isWall()) {
                ctx.font = `${TILE * 0.9}px "Segoe UI Emoji"`;
                ctx.fillStyle = '#c47a3a';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🧱', px + TILE/2, py + TILE/2);
            } else if (t.isPlatform()) {
                ctx.fillStyle = COLORS[t.c] || '#333';
                ctx.fillRect(px, py, TILE, TILE);
                ctx.font = `${TILE * 0.6}px "Segoe UI Emoji"`;
                ctx.fillStyle = '#fff';
                ctx.fillText(EMOJIS[t.c] || '?', px + TILE/2, py + TILE/2);
            
            } else if (t.isNormal()) {
    const padding = 2;  // зазор в пикселях
    ctx.fillStyle = COLORS[t.c] || '#333';
    ctx.fillRect(px + padding, py + padding, TILE - padding * 2, TILE - padding * 2);
    ctx.font = `${TILE * 0.7}px "Segoe UI Emoji"`;
    ctx.fillStyle = '#fff';
    ctx.fillText(EMOJIS[t.c] || '?', px + TILE/2, py + TILE/2);
}
        }
        
        ctx.globalAlpha = 1.0;
        this.drawCursor(ox, oy);
    }
    
    drawCursor(ox, oy) {
        const ctx = this.ctx;
        const px = ox + this.player.col * TILE;
        const py = oy + this.player.row * TILE;
        const pad = this.dragging ? 4 : 2;
        const size = TILE - pad * 2;
        
        ctx.save();
        ctx.strokeStyle = this.dragging ? '#ff6b6b' : '#ffd700';
        ctx.lineWidth = this.dragging ? 4 : 3;
        ctx.strokeRect(px + pad, py + pad, size, size);
        
        const cs = TILE;
        const cornerSize = 8;
        const corners = [
            [[px+cornerSize,py+pad],[px+pad,py+pad],[px+pad,py+cornerSize]],
            [[px+cs-cornerSize,py+pad],[px+cs-pad,py+pad],[px+cs-pad,py+cornerSize]],
            [[px+cornerSize,py+cs-pad],[px+pad,py+cs-pad],[px+pad,py+cs-cornerSize]],
            [[px+cs-cornerSize,py+cs-pad],[px+cs-pad,py+cs-pad],[px+cs-pad,py+cs-cornerSize]],
        ];
        
        for (const points of corners) {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            ctx.lineTo(points[1][0], points[1][1]);
            ctx.lineTo(points[2][0], points[2][1]);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // ========== UI ==========
        checkVictory() {
        const remaining = this.map.filter(t => t.isNormal() && t.fadeStep === 0).length;
        if (remaining === 0) {
            if (typeof playLevelComplete === 'function') playLevelComplete();
            this.unlockNextLevel();
            this.showVictoryModal();  // не вызываем nextLevel здесь
        }
    }
    
    updateUI() {
        const sv = document.getElementById('scoreValue');
        const lv = document.getElementById('levelValue');
        if (sv) sv.textContent = this.score;
        if (lv) lv.textContent = this.levelId;
    }
    
    updateBlockCounters() {
        const panel = document.getElementById('countersPanel');
        if (!panel) return;
        
        const counts = {};
        
        for (const t of this.map) {
            if (t.isNormal() && t.fadeStep === 0) {
                counts[t.c] = (counts[t.c] || 0) + 1;
            }
        }
        
        let html = '';
        let hasBlinking = false;
        
        for (const [c, n] of Object.entries(counts)) {
            if (EMOJIS[c]) {
                const blinkClass = n === 1 ? 'blink' : '';
                if (n === 1) hasBlinking = true;
                html += `<div class="counter-item">
                            <span class="counter-emoji ${blinkClass}">${EMOJIS[c]}</span>
                            <span class="counter-count">${n}</span>
                        </div>`;
            }
        }
        
        if (!html) html = '<div class="counter-item" style="color:#4caf50">✨✨✨</div>';
        panel.innerHTML = html;
        
        if (hasBlinking && !this.warningInterval) {
            this.warningInterval = setInterval(() => {
                if (typeof playBlockWarning === 'function') playBlockWarning();
            }, 600);
        } else if (!hasBlinking && this.warningInterval) {
            clearInterval(this.warningInterval);
            this.warningInterval = null;
        }
    }
    
    resetLevel() {
        const savedScore = this.score;
        this.loadLevel(this.levelId);
        this.score = savedScore;
        this.updateUI();
    }
    
        nextLevel() {
        const allLevels = getAllLevelIds();
        const unlocked = this.getUnlockedLevels();
        
        // Сортируем уровни
        allLevels.sort((a, b) => {
            const [aGroup, aNum] = a.split('-').map(Number);
            const [bGroup, bNum] = b.split('-').map(Number);
            return aGroup !== bGroup ? aGroup - bGroup : aNum - bNum;
        });
        
        // Находим текущий индекс
        const currentIndex = allLevels.indexOf(this.levelId);
        
        // Ищем следующий открытый уровень
        let nextLevel = null;
        for (let i = currentIndex + 1; i < allLevels.length; i++) {
            if (unlocked.includes(allLevels[i])) {
                nextLevel = allLevels[i];
                break;
            }
        }
        
        if (nextLevel) {
            this.score = 0;
            this.loadLevel(nextLevel);
            this.updateUI();
        } else {
            // Все доступные уровни пройдены
            this.showGameCompleteModal();
        }
    }
    
      showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        if (!modal) return;
        
        document.getElementById('modalMessage').textContent = `Уровень ${this.levelId} пройден!`;
        document.getElementById('modalStats').textContent = `⭐ Очки: ${this.score} ⭐`;
        modal.style.display = 'flex';
        
        const btn = document.getElementById('nextLevelBtn');
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        
        const go = () => {
            modal.style.display = 'none';
            this.nextLevel();  // Теперь nextLevel ищет следующий открытый уровень
        };
        
        clone.addEventListener('click', go);
        
        const handler = (e) => {
            if (modal.style.display !== 'flex') return;
            if (['Control', 'Enter', ' ', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                go();
                window.removeEventListener('keydown', handler);
            }
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                window.removeEventListener('keydown', handler);
            }
        };
        window.addEventListener('keydown', handler);
    }
    
    showGameCompleteModal() {
        const modal = document.getElementById('victoryModal');
        if (!modal) return;
        
        document.getElementById('modalMessage').textContent = 'ПОЗДРАВЛЯЕМ!';
        document.getElementById('modalStats').textContent = `Все уровни пройдены! 🎉 Очки: ${this.score}`;
        modal.style.display = 'flex';
        
        const btn = document.getElementById('nextLevelBtn');
        btn.textContent = 'ЗАНОВО';
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        
        clone.addEventListener('click', () => {
            modal.style.display = 'none';
            this.score = 0;
            this.loadLevel('1-1');
            this.updateUI();
        });
    }
}

let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new PuzznicGame();
    if (typeof initInput === 'function') {
        initInput(game);
    }
});