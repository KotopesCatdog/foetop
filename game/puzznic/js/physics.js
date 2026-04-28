// Физика движущихся блоков
class MovingBlockManager {
    constructor(game) {
        this.game = game;
        this.movingBlocks = [];
        this.lastUpdate = 0;
        this.moveInterval = 500; // мс между движениями
    }
    
    update(currentTime) {
        if (!this.game || this.game.isProcessing) return;
        
        if (currentTime - this.lastUpdate >= this.moveInterval) {
            this.lastUpdate = currentTime;
            this.moveAllMovingBlocks();
        }
    }
    
    moveAllMovingBlocks() {
        const newGrid = this.game.grid.map(row => [...row]);
        
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.cols; x++) {
                const cell = this.game.grid[y][x];
                
                if (cell === '~') {
                    // Горизонтальный движущийся блок
                    let newX = x + 1;
                    if (newX >= this.game.cols || this.game.grid[y][newX] !== ' ') {
                        newX = x - 1;
                        if (newX < 0 || this.game.grid[y][newX] !== ' ') {
                            continue;
                        }
                    }
                    newGrid[y][x] = ' ';
                    newGrid[y][newX] = '~';
                }
                
                if (cell === '|') {
                    // Вертикальный движущийся блок
                    let newY = y + 1;
                    if (newY >= this.game.rows || this.game.grid[newY][x] !== ' ') {
                        newY = y - 1;
                        if (newY < 0 || this.game.grid[newY][x] !== ' ') {
                            continue;
                        }
                    }
                    newGrid[y][x] = ' ';
                    newGrid[newY][x] = '|';
                }
            }
        }
        
        this.game.grid = newGrid;
        
        // Проверяем совпадения после движения
        this.game.checkAndClearMatches(true);
    }
}