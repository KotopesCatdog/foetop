// input.js — управление
function initInput(game) {
    window.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Space для dragging (как в оригинале)
        if (e.key === ' ') {
            e.preventDefault();
            game.setDragging(true);
        }
        
        // Ctrl для toggle dragging
        if (e.key === 'Control') {
            e.preventDefault();
            game.setCtrlPressed(true);
        }
        
        // Движение
        switch (e.key) {
            case 'ArrowLeft': game.moveCursor(-1, 0); break;
            case 'ArrowRight': game.moveCursor(1, 0); break;
            case 'ArrowUp': game.moveCursor(0, -1); break;
            case 'ArrowDown': game.moveCursor(0, 1); break;
        }
        
        // Перезапуск
        // Перезапуск уровня
if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
    e.preventDefault();
    game.resetLevel();
}
    });
    
    window.addEventListener('keyup', e => {
        if (e.key === ' ') {
            game.setDragging(false);
        }
    });
    
    window.addEventListener('contextmenu', e => e.preventDefault());
}