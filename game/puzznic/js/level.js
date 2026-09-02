// Загрузка уровней (расширенная версия)
function parseLevelFromText(levelText) {
    const lines = levelText.split('\n');
    const grid = [];
    const validChars = new Set(['-', '~', '|', 'E', 'G', 'B', 'P', 'X', 'C', 'D', 'T']);
    
    for (let line of lines) {
        line = line.replace(/\r$/, '');
        
        if (line.trim() === '' && grid.length === 0) continue;
        
        const row = [];
        let i = 0;
        const len = line.length;
        
        while (i < len) {
            const ch = line[i];
            
            if (ch === ' ') {
                let spaceCount = 1;
                while (i + spaceCount < len && line[i + spaceCount] === ' ') {
                    spaceCount++;
                }
                
                const emptyBlocksCount = Math.floor(spaceCount / 2);
                for (let e = 0; e < emptyBlocksCount; e++) {
                    row.push(' ');
                }
                
                i += spaceCount;
            } 
            else if (validChars.has(ch)) {
                row.push(ch);
                i++;
            }
            else {
                i++;
            }
        }
        
        if (row.length > 0) {
            grid.push(row);
        }
    }
    
    if (grid.length === 0) return null;
    
    const cols = Math.max(...grid.map(row => row.length));
    for (let row of grid) {
        while (row.length < cols) {
            row.push(' ');
        }
    }
    
    return {
        cols: cols,
        rows: grid.length,
        grid: grid
    };
}

function addLevelFromText(levelId, levelText) {
    const parsed = parseLevelFromText(levelText);
    if (parsed) {
        LEVELS[levelId] = {
            id: levelId,
            cols: parsed.cols,
            rows: parsed.rows,
            grid: parsed.grid
        };
        return true;
    }
    return false;
}