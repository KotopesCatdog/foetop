let audioCtx = null;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playBeep(frequency, duration, volume = 0.3) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    oscillator.type = "sine";
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration);
    oscillator.stop(now + duration);
}

function playBlockMatch() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(523.25, 0.1, 0.2);
}

function playBlockMove() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(440, 0.05, 0.1);
}

function playGrabBlock() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(660, 0.08, 0.15);
}

function playLevelComplete() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    
    for (let i = 0; i < frequencies.length; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = frequencies[i];
        gain.gain.value = 0.15;
        osc.type = "sine";
        osc.start(now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + i * 0.12 + 0.15);
        osc.stop(now + i * 0.12 + 0.15);
    }
}

function playBlockFall() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playBeep(330, 0.06, 0.12);
}

function playBlockWarning() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.value = 880; // высокий звук
    gain.gain.value = 0.15;
    osc.type = "sine";
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
    osc.stop(now + 0.15);
}

window.playBlockWarning = playBlockWarning;

window.playBlockMatch = playBlockMatch;
window.playBlockMove = playBlockMove;
window.playGrabBlock = playGrabBlock;
window.playLevelComplete = playLevelComplete;
window.playBlockFall = playBlockFall;