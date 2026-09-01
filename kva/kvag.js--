// ============================================
// kvag.js — основная логика редактора
// Данные зданий: kvag_data.js
// ============================================


// Глобальные переменные
const grid = document.getElementById('grid');
const tabContentContainer = document.getElementById('tab-content-container');
const tooltip = document.getElementById('tooltip');
const totalCells = 28 * 28;
const areas = [
  { colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 16, color: '#ccc' },
  { colStart: 5, colEnd: 8, rowStart: 1, rowEnd: 4, color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 1, rowEnd: 4, color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 21, rowEnd: 28, color: '#ccc' }
];

let deleteMode = false;
let whiteCellsCount = 192;
let initialCellStates = new Array(totalCells).fill('');
let townHallBonuses = {
  od: 0,
  coin_acceleration: 0,
  hammer_acceleration: 0,
  coin_initial: 0,
  hammer_initial: 0,
  kd_capacity: 200000
};

let selectedBuilding = null;
let selectedLiElement = null;
let ghostFigure = null;
let clearedCellsHistory = [];
let clickTimer = null;

// ============================================
// ОБРАБОТЧИК ДВОЙНОГО КЛИКА
// ============================================
function handleFigureClick(figure, e) {
    // Принудительно останавливаем распространение события в режиме удаления
    if (deleteMode) {
        e.stopPropagation();  // Останавливаем всплытие
        return;  // Выходим, не обрабатывая клик
    }
    
    if (figure.dataset.name === 'Ратуша') {
        tooltip.textContent = 'Ратуша';
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 15}px`;
        tooltip.style.top = `${e.clientY + 15}px`;
        return;
    }
    
    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        showBuildingInfo(figure);
    } else {
        clickTimer = setTimeout(() => {
            clickTimer = null;
        }, 300);
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ СЕТКИ
// ============================================
function initGrid() {
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    cell.style.backgroundColor = '#fff';
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        cell.style.backgroundColor = area.color;
        isGray = true;
      }
    });
    
    if (!isGray && !(
      (row >= 9 && row <= 20 && col >= 9 && col <= 20) ||
      (row >= 21 && row <= 24 && col >= 9 && col <= 20) ||
      (row >= 5 && row <= 8 && col >= 9 && col <= 24) ||
      (row >= 9 && row <= 16 && col >= 21 && col <= 24)
    ) || (row >= 17 && row <= 24 && col >= 9 && col <= 20)) {
      cell.textContent = 'X';
      initialCellStates[i] = 'X';
    }
    
    if (row >= 21 && row <= 28 && col >= 1 && col <= 8 && !isGray) {
      cell.textContent = 'X';
      initialCellStates[i] = 'X';
    }
    
    grid.appendChild(cell);
  }
}

// ============================================
// СОЗДАНИЕ РАТУШИ
// ============================================
function createTownHall() {
  const townHall = document.createElement('div');
  townHall.classList.add('figure', 'townhall');
  townHall.style.width = `${7 * 30}px`;
  townHall.style.height = `${6 * 30}px`;
  townHall.style.left = `${(18 - 1) * 30}px`;
  townHall.style.top = `${(5 - 1) * 30}px`;
  townHall.dataset.name = 'Ратуша';
  townHall.style.color = 'black';
  
  const text = document.createElement('div');
  const maxChars = Math.floor((6 * 30) / 8);
  text.textContent = 'Ратуша'.substring(0, maxChars);
  townHall.appendChild(text);
  
  townHall.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFigureClick(townHall, e);
  });
  
  townHall.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  grid.appendChild(townHall);
  addDragHandlers(townHall);
  return townHall;
}

// ============================================
// СОЗДАНИЕ МЕНЮ С ЗДАНИЯМИ
// ============================================
function createMenu() {
  const categories = [...new Set(buildingData.map(b => b.category))];
  
  categories.forEach((category, index) => {
    const tabContent = document.createElement('div');
    tabContent.id = `tab${index + 1}`;
    tabContent.classList.add('tab-content');
    if (index === 0) tabContent.classList.add('active');
    
    const ul = document.createElement('ul');
    ul.classList.add('building-list');
    
    buildingData.filter(b => b.category === category).forEach(building => {
      const li = document.createElement('li');
      const symbol = building.symbol || '';
      const symbol_color = building.symbol_color || '';
      
      li.innerHTML = `<span class="symbol ${symbol_color}">${symbol}</span><span class="name-size">${building.name}</span>`;
      
      li.onclick = (e) => {
        e.stopPropagation();
        
        if (selectedBuilding === building) {
          selectedBuilding = null;
          if (selectedLiElement) {
            selectedLiElement.classList.remove('active');
            selectedLiElement = null;
          }
          if (ghostFigure) {
            ghostFigure.remove();
            ghostFigure = null;
          }
          grid.removeEventListener('mousemove', handleGhostMove);
        } else {
          if (selectedLiElement) {
            selectedLiElement.classList.remove('active');
          }
          if (ghostFigure) {
            ghostFigure.remove();
            ghostFigure = null;
          }
          grid.removeEventListener('mousemove', handleGhostMove);
          
          selectedBuilding = building;
          selectedLiElement = li;
          li.classList.add('active');
          createGhostFigure();
          grid.addEventListener('mousemove', handleGhostMove);
        }
      };
      
      if (building.name !== 'Расш') {
        const submenu = document.createElement('div');
        submenu.classList.add('submenu');
        let bonusesHtml = '';
        for (let key in building.bonuses) {
          const translatedKey = bonusTranslations[key] || key;
          bonusesHtml += `<div>${translatedKey}: ${building.bonuses[key]}</div>`;
        }
        submenu.innerHTML = bonusesHtml;
        li.appendChild(submenu);
      }
      
      ul.appendChild(li);
    });
    
    if (category === "Расширения") {
      const li = document.createElement('li');
      li.innerHTML = `<span class="symbol"></span><span class="name-size">Все расш.</span>`;
      li.onclick = clearAllXCells;
      ul.appendChild(li);
    }
    
    tabContent.appendChild(ul);
    tabContentContainer.appendChild(tabContent);
  });
}

// ============================================
// ПРИЗРАЧНАЯ ФИГУРА
// ============================================
function createGhostFigure() {
  if (!selectedBuilding || ghostFigure) return;
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  ghostFigure = document.createElement('div');
  ghostFigure.classList.add('ghost-figure');
  
  let baseColor = '';
  switch(selectedBuilding.category) {
    case "Жилые": baseColor = 'yellow'; break;
    case "Молотки": baseColor = 'brown'; break;
    case "Товар": baseColor = 'plum'; break;
    case "Общест.": baseColor = 'pink'; break;
    case "Декор": baseColor = 'lightblue'; break;
    case "Воен.": baseColor = 'blue'; break;
    case "Расширения": baseColor = 'white'; break;
    default: baseColor = 'yellow';
  }
  
  const symbolColor = selectedBuilding.symbol_color || 'yellow';
  let ghostColor = '';
  if (symbolColor === 'yellow') {
    ghostColor = baseColor + '-light';
  } else if (symbolColor === 'green') {
    ghostColor = baseColor + '-medium';
  } else if (symbolColor === 'red') {
    ghostColor = baseColor + '-dark';
  } else {
    ghostColor = baseColor + '-light';
  }
  
  ghostFigure.classList.add(ghostColor);
  ghostFigure.style.width = `${widthCells * 30}px`;
  ghostFigure.style.height = `${heightCells * 30}px`;
  ghostFigure.style.opacity = '0.5';
  
  const text = document.createElement('div');
  const maxChars = Math.floor((widthCells * 30) / 8);
  const displayName = selectedBuilding.display_name || selectedBuilding.name;
  text.textContent = displayName.substring(0, maxChars);
  ghostFigure.appendChild(text);
  
  grid.appendChild(ghostFigure);
}

function handleGhostMove(e) {
  if (!ghostFigure || !selectedBuilding) return;
  
  const rect = grid.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const col = Math.floor(x / 30);
  const row = Math.floor(y / 30);
  
  if (col < 0 || col >= 28 || row < 0 || row >= 28) {
    ghostFigure.style.display = 'none';
    return;
  }
  
  ghostFigure.style.display = 'flex';
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  if (col + widthCells > 28 || row + heightCells > 28) {
    ghostFigure.style.opacity = '0.2';
    return;
  } else {
    ghostFigure.style.opacity = '0.5';
  }
  
  ghostFigure.style.left = `${col * 30}px`;
  ghostFigure.style.top = `${row * 30}px`;
}

// ============================================
// СОЗДАНИЕ ФИГУРЫ С ЯВНЫМ CSS-КЛАССОМ (для импорта)
// ============================================
function createFigureWithClass(name, widthPx, heightPx, left, top, forcedClass) {
  // Если forcedClass не задан — делегируем обычному createFigure
  if (!forcedClass) {
    return createFigure(name, widthPx, heightPx, left, top, true);
  }

  const figure = document.createElement('div');
  figure.classList.add('figure', forcedClass);
  figure.style.width  = `${widthPx}px`;
  figure.style.height = `${heightPx}px`;
  figure.style.left   = `${left}px`;
  figure.style.top    = `${top}px`;
  figure.dataset.name = name;

  // Тёмный текст для светлых фигур
  if (['townhall', 'yellow-light', 'white-light', 'white-medium', 'white-dark'].includes(forcedClass)) {
    figure.style.color = 'black';
  }

  const text = document.createElement('div');
  const maxChars = Math.floor(widthPx / 8);
  // Пытаемся найти display_name в buildingData
  const bData = buildingData.find(b => b.name === name);
  text.textContent = (bData ? bData.display_name : name).substring(0, maxChars);
  figure.appendChild(text);

  figure.addEventListener('click', (e) => { e.stopPropagation(); handleFigureClick(figure, e); });
  figure.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  grid.appendChild(figure);
  addDragHandlers(figure);
  calculateBonuses();
  return figure;
}

// ============================================
// СОЗДАНИЕ ФИГУРЫ
// ============================================
function createFigure(name, widthPx, heightPx, left, top, isLoad = false) {
  if (name === 'Расш') {
    const figure = document.createElement('div');
    figure.classList.add('figure', 'white-light');
    figure.style.width = `${widthPx}px`;
    figure.style.height = `${heightPx}px`;
    figure.style.left = `${left}px`;
    figure.style.top = `${top}px`;
    figure.dataset.name = 'Расш';
    figure.style.color = 'black';
    
    const text = document.createElement('div');
    const maxChars = Math.floor((widthPx / 30) * 30 / 8);
    text.textContent = 'Расш'.substring(0, maxChars);
    figure.appendChild(text);
    
    figure.addEventListener('click', (e) => {
      e.stopPropagation();
      handleFigureClick(figure, e);
    });
    
    figure.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
    
    grid.appendChild(figure);
    addDragHandlers(figure);
    calculateBonuses();
    return figure;
  }
  
  const selectedBuildingData = buildingData.find(building => building.name === name);
  if (!selectedBuildingData) {
    // Неизвестное здание (из импорта) — рисуем серым с сырым именем
    const figure = document.createElement('div');
    figure.classList.add('figure', 'road');
    figure.style.width = `${widthPx}px`;
    figure.style.height = `${heightPx}px`;
    figure.style.left = `${left !== undefined ? left : 30}px`;
    figure.style.top = `${top !== undefined ? top : 30}px`;
    figure.dataset.name = name;
    const text = document.createElement('div');
    const maxChars = Math.floor(widthPx / 8);
    text.textContent = name.substring(0, maxChars);
    figure.appendChild(text);
    figure.addEventListener('click', (e) => { e.stopPropagation(); handleFigureClick(figure, e); });
    figure.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
    grid.appendChild(figure);
    addDragHandlers(figure);
    calculateBonuses();
    return figure;
  }
  
  const [heightCells, widthCells] = selectedBuildingData.size.split('x').map(Number);
  const finalName = selectedBuildingData.name;
  const finalWidthPx = widthPx || widthCells * 30;
  const finalHeightPx = heightPx || heightCells * 30;
  const finalLeft = left !== undefined ? left : 30;
  const finalTop = top !== undefined ? top : 30;
  
  let baseColor = '';
  let categoryPrefix = '';
  switch(selectedBuildingData.category) {
    case "Жилые": baseColor = 'yellow'; categoryPrefix = 'yellow'; break;
    case "Молотки": baseColor = 'brown'; categoryPrefix = 'brown'; break;
    case "Товар": baseColor = 'plum'; categoryPrefix = 'plum'; break;
    case "Общест.": baseColor = 'blue'; categoryPrefix = 'pink'; break;
    case "Декор": baseColor = 'lightblue'; categoryPrefix = 'lightblue'; break;
    case "Воен.": baseColor = 'red'; categoryPrefix = 'blue'; break;
    case "Расширения": baseColor = 'white'; categoryPrefix = 'white'; break;
    default: baseColor = selectedBuildingData.color || 'yellow'; categoryPrefix = 'yellow';
  }
  
  const symbolColor = selectedBuildingData.symbol_color || 'yellow';
  let colorClass = '';
  if (symbolColor === 'yellow') {
    colorClass = categoryPrefix + '-light';
  } else if (symbolColor === 'green') {
    colorClass = categoryPrefix + '-medium';
  } else if (symbolColor === 'red') {
    colorClass = categoryPrefix + '-dark';
  } else {
    colorClass = categoryPrefix + '-light';
  }
  
  const figure = document.createElement('div');
  figure.classList.add('figure', colorClass);
  figure.style.width = `${finalWidthPx}px`;
  figure.style.height = `${finalHeightPx}px`;
  figure.style.left = `${finalLeft}px`;
  figure.style.top = `${finalTop}px`;
  figure.dataset.name = finalName;
  
  const text = document.createElement('div');
  const maxChars = Math.floor((finalWidthPx / 30) * 30 / 8);
  const displayName = selectedBuildingData.display_name || finalName;
  text.textContent = displayName.substring(0, maxChars);
  figure.appendChild(text);
  
  figure.addEventListener('click', (e) => {
    e.stopPropagation();
    handleFigureClick(figure, e);
  });
  
  figure.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  if (['Ратуша', 'Многоэтажный дом', 'Каркасный дом', 'Дом с гонтовой кр.', 'Особняк', 'Дом из песчаника', 'Городской особняк', 'Усадьба', 'Многоквартирный дом', 'Манор'].includes(finalName)) {
    figure.style.color = 'black';
  }
  
  grid.appendChild(figure);
  addDragHandlers(figure);
  
  if (!isLoad && finalName === 'Расш') {
    const isOverGray = isInGrayArea(finalLeft, finalTop, widthCells, heightCells);
    if (!isOverGray) {
      clearXUnderFigure(figure);
      figure.remove();
      whiteCellsCount = countWhiteCells();
      for (let y = finalTop / 30; y < finalTop / 30 + heightCells; y++) {
        for (let x = finalLeft / 30; x < finalLeft / 30 + widthCells; x++) {
          const cellIndex = y * 28 + x;
          if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
            initialCellStates[cellIndex] = '';
          }
        }
      }
    }
  }
  
  calculateBonuses();
  return figure;
}

// ============================================
// ПЕРЕТАСКИВАНИЕ ФИГУР
// ============================================
function addDragHandlers(figure) {
  let isDragging = false;
  let offsetX, offsetY;
  
  function handleStart(clientX, clientY) {
    isDragging = true;
    offsetX = clientX - figure.offsetLeft;
    offsetY = clientY - figure.offsetTop;
    figure.style.cursor = 'grabbing';
    figure.style.zIndex = '20';
  }
  
  function handleMove(clientX, clientY) {
    if (!isDragging) return;
    const newX = clientX - offsetX;
    const newY = clientY - offsetY;
    figure.style.left = `${newX}px`;
    figure.style.top = `${newY}px`;
    checkOverlap();
  }
  
  function handleEnd() {
    if (!isDragging) return;
    
    const gridRect = grid.getBoundingClientRect();
    const figureRect = figure.getBoundingClientRect();
    const isOutsideGrid = (
      figureRect.right < gridRect.left ||
      figureRect.left > gridRect.right ||
      figureRect.bottom < gridRect.top ||
      figureRect.top > gridRect.bottom
    );
    
    if (isOutsideGrid && figure.dataset.name !== 'Ратуша') {
      if (figure.dataset.blinkInterval) {
        clearInterval(figure.dataset.blinkInterval);
      }
      figure.remove();
      calculateBonuses();
      isDragging = false;
      return;
    }
    
    const snappedX = Math.round(figure.offsetLeft / 30) * 30;
    const snappedY = Math.round(figure.offsetTop / 30) * 30;
    figure.style.left = `${snappedX}px`;
    figure.style.top = `${snappedY}px`;
    figure.style.zIndex = '10';
    checkOverlap();
    
    if (figure.dataset.name === 'Расш') {
      const left = parseInt(figure.style.left) / 30;
      const top = parseInt(figure.style.top) / 30;
      const width = parseInt(figure.style.width) / 30;
      const height = parseInt(figure.style.height) / 30;
      const isOverGray = isInGrayArea(left * 30, top * 30, width, height);
      if (!isOverGray) {
        clearXUnderFigure(figure);
        figure.remove();
        whiteCellsCount = countWhiteCells();
        for (let y = top; y < top + height; y++) {
          for (let x = left; x < left + width; x++) {
            const cellIndex = y * 28 + x;
            if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
              initialCellStates[cellIndex] = '';
            }
          }
        }
      }
    }
    
    calculateBonuses();
    isDragging = false;
    figure.style.cursor = 'grab';
  }
  
  function checkOverlap() {
    const figures = document.querySelectorAll('.figure');
    figures.forEach(fig => {
      const rect1 = fig.getBoundingClientRect();
      const left = parseInt(fig.style.left);
      const top = parseInt(fig.style.top);
      const width = parseInt(fig.style.width) / 30;
      const height = parseInt(fig.style.height) / 30;
      let blinkInterval = fig.dataset.blinkInterval;
      let hasOverlap = false;
      let hasXOverlap = false;
      let isInGray = isInGrayArea(left, top, width, height);
      
      figures.forEach(otherFig => {
        if (otherFig !== fig) {
          const rect2 = otherFig.getBoundingClientRect();
          const innerRect1 = {
            left: rect1.left + 1,
            right: rect1.right - 1,
            top: rect1.top + 1,
            bottom: rect1.bottom - 1
          };
          const innerRect2 = {
            left: rect2.left + 1,
            right: rect2.right - 1,
            top: rect2.top + 1,
            bottom: rect2.bottom - 1
          };
          if (!(innerRect1.right <= innerRect2.left || innerRect1.left >= innerRect2.right ||
                innerRect1.bottom <= innerRect2.top || innerRect1.top >= innerRect2.bottom)) {
            const overlapX = Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left);
            const overlapY = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);
            const overlapCells = Math.ceil(overlapX / 30) * Math.ceil(overlapY / 30);
            if (overlapCells >= 1 && !isInGrayArea(left, top, width, height) &&
                !isInGrayArea(parseInt(otherFig.style.left), parseInt(otherFig.style.top),
                parseInt(otherFig.style.width) / 30, parseInt(otherFig.style.height) / 30)) {
              hasOverlap = true;
            }
          }
        }
      });
      
      for (let y = top / 30; y < top / 30 + height; y++) {
        for (let x = left / 30; x < left / 30 + width; x++) {
          const cellIndex = y * 28 + x;
          if (cellIndex >= 0 && cellIndex < totalCells) {
            const cell = grid.children[cellIndex];
            if (cell && cell.textContent === 'X' && !isInGrayArea(left, top, width, height)
                && fig.dataset.name !== 'Препятствие') {
              hasXOverlap = true;
              break;
            }
          }
        }
        if (hasXOverlap) break;
      }
      
      if (hasOverlap || hasXOverlap || isInGray) {
        if (!blinkInterval) {
          let isVisible = true;
          blinkInterval = setInterval(() => {
            fig.style.opacity = isVisible ? '0.3' : '1';
            isVisible = !isVisible;
          }, 500);
          fig.dataset.blinkInterval = blinkInterval;
        }
      } else if (blinkInterval) {
        clearInterval(blinkInterval);
        fig.style.opacity = '1';
        delete fig.dataset.blinkInterval;
      }
    });
  }
  
  figure.addEventListener('mousedown', (e) => {
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  document.addEventListener('mouseup', handleEnd);
  
  figure.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchend', handleEnd);
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================
function isInGrayArea(x, y, width, height) {
  const colStart = Math.max(1, Math.floor(x / 30) + 1);
  const rowStart = Math.max(1, Math.floor(y / 30) + 1);
  const colEnd = Math.min(28, colStart + width - 1);
  const rowEnd = Math.min(28, rowStart + height - 1);
  
  for (let area of areas) {
    if (colEnd >= area.colStart && colStart <= area.colEnd && rowEnd >= area.rowStart && rowStart <= area.rowEnd) {
      return true;
    }
  }
  return false;
}

function countWhiteCells() {
  let count = 0;
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    
    if (!isGray && cell && cell.textContent !== 'X') {
      count++;
    }
  }
  return count;
}

function clearXUnderFigure(figure) {
  if (figure.dataset.name !== 'Расш') return;
  
  const left = parseInt(figure.style.left) / 30;
  const top = parseInt(figure.style.top) / 30;
  const width = parseInt(figure.style.width) / 30;
  const height = parseInt(figure.style.height) / 30;
  
  const clearedCells = [];
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      const cellIndex = y * 28 + x;
      if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
        const cell = grid.children[cellIndex];
        if (cell && cell.textContent === 'X') {
          clearedCells.push({index: cellIndex, x: x, y: y});
        }
      }
    }
  }
  
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      const cellIndex = y * 28 + x;
      if (cellIndex >= 0 && cellIndex < totalCells && !isInGrayArea(x * 30, y * 30, 1, 1)) {
        const cell = grid.children[cellIndex];
        if (cell) cell.textContent = '';
      }
    }
  }
  
  if (clearedCells.length > 0) {
    clearedCellsHistory.push({
      left: left,
      top: top,
      width: width,
      height: height,
      cells: clearedCells
    });
  }
  
  calculateBonuses();
}

function clearAllXCells() {
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    if (!isGray && cell && !cell.classList.contains('road') && !cell.classList.contains('boundary')) {
      cell.textContent = '';
      initialCellStates[i] = '';
    }
  }
  whiteCellsCount = countWhiteCells();
  calculateBonuses();
}

function restoreExpansionZones() {
  let restoredCount = 0;
  
  clearedCellsHistory.forEach(item => {
    item.cells.forEach(cellInfo => {
      const cell = grid.children[cellInfo.index];
      if (cell && cell.textContent === '') {
        cell.textContent = 'X';
        initialCellStates[cellInfo.index] = 'X';
        restoredCount++;
      }
    });
  });
  
  document.querySelectorAll('.figure[data-name="Расш"]').forEach(fig => {
    if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
    fig.remove();
  });
  
  clearedCellsHistory = [];
  calculateBonuses();
  return restoredCount;
}

// ============================================
// РАСЧЁТ БОНУСОВ
// ============================================
function calculateGlobalStatsWithValues(housingPopulation, totalHappiness, coinAcceleration, hammerAcceleration) {
  let happinessPercent = 0;
  let happinessCoef;
  
  if (housingPopulation > 0) {
    happinessPercent = (totalHappiness / housingPopulation) * 100;
    
    if (happinessPercent < 21) {
      happinessCoef = 0.2;
    } else if (happinessPercent < 61) {
      happinessCoef = 0.6;
    } else if (happinessPercent < 81) {
      happinessCoef = 0.8;
    } else if (happinessPercent < 121) {
      happinessCoef = 1.0;
    } else if (happinessPercent < 141) {
      happinessCoef = 1.1;
    } else if (happinessPercent < 200) {
      happinessCoef = 1.2;
    } else {
      happinessCoef = 1.5;
    }
  } else {
    happinessPercent = 100;
    happinessCoef = 1.0;
  }
  
  return {
    housingPopulation,
    totalHappiness,
    happinessPercent,
    happinessCoef,
    coin_acceleration: coinAcceleration,
    hammer_acceleration: hammerAcceleration
  };
}

function calculateBonuses() {
  const stats = {
    population: 0,
    housingPopulation: 0,
    coins: 0,
    hammers: 0,
    chrono: 0,
    happiness: 0,
    od: 0,
    blue: 0,
    red: 0,
    coin_acceleration: Number(townHallBonuses.coin_acceleration) || 0,
    hammer_acceleration: Number(townHallBonuses.hammer_acceleration) || 0,
    coin_cost: 0,
    hammer_cost: 0,
    chrono_cost: 0,
    kd_capacity: Number(townHallBonuses.kd_capacity) || 200000
  };
  
  stats.coin_cost += Number(townHallBonuses.coin_initial) || 0;
  stats.hammer_cost += Number(townHallBonuses.hammer_initial) || 0;
  stats.od += Number(townHallBonuses.od) || 0;
  
  document.querySelectorAll('.figure').forEach(figure => {
    const left = parseInt(figure.style.left);
    const top = parseInt(figure.style.top);
    const width = parseInt(figure.style.width) / 30;
    const height = parseInt(figure.style.height) / 30;
    
    if (isInGrayArea(left, top, width, height)) return;
    
    const building = buildingData.find(b => b.name === figure.dataset.name);
    if (!building) return;
    if (building.name === 'Ратуша') return;
    
    if (building.category === "Жилые") {
      const pop = Number(building.bonuses.population) || 0;
      stats.housingPopulation += pop;
      stats.population += pop;
    }
    
    if (building.bonuses.population_cost) {
      stats.population -= Number(building.bonuses.population_cost);
    }
    
    stats.happiness += (Number(building.bonuses.happiness_production) || 0);
    stats.happiness -= (Number(building.bonuses.happiness_cost) || 0);
    
    stats.coin_acceleration += Number(building.bonuses.coin_acceleration) || 0;
    stats.hammer_acceleration += Number(building.bonuses.hammer_acceleration) || 0;
    
    stats.kd_capacity += Number(building.bonuses.od_production) || 0;
    stats.od += Number(building.bonuses.od_chas) || 0;
    
    stats.blue += Number(building.bonuses.blue_stats) || 0;
    stats.red += Number(building.bonuses.red_stats) || 0;
    
    stats.coin_cost -= Number(building.bonuses.coin_cost) || 0;
    stats.hammer_cost -= Number(building.bonuses.hammer_cost) || 0;
    stats.chrono_cost -= Number(building.bonuses.chrono_cost) || 0;
  });
  
  const globalStats = calculateGlobalStatsWithValues(
    stats.housingPopulation,
    stats.happiness,
    stats.coin_acceleration,
    stats.hammer_acceleration
  );
  
  document.querySelectorAll('.figure').forEach(figure => {
    const left = parseInt(figure.style.left);
    const top = parseInt(figure.style.top);
    const width = parseInt(figure.style.width) / 30;
    const height = parseInt(figure.style.height) / 30;
    
    if (isInGrayArea(left, top, width, height)) return;
    
    const building = buildingData.find(b => b.name === figure.dataset.name);
    if (!building) return;
    if (building.name === 'Ратуша') return;
    
    for (let key in building.bonuses) {
      const baseValue = building.bonuses[key];
      
      if (key === 'coin_production') {
        const value = baseValue * (globalStats.happinessCoef + globalStats.coin_acceleration / 100);
        stats.coins += value;
      } else if (key === 'hammer_production') {
        const value = baseValue * (globalStats.happinessCoef + globalStats.hammer_acceleration / 100);
        stats.hammers += value;
      } else if (key === 'chrono_production') {
        const value = baseValue * globalStats.happinessCoef;
        stats.chrono += value;
      }
    }
  });
  
  const townHallFigure = document.querySelector('.figure[data-name="Ратуша"]');
  if (townHallFigure) {
    const thLeft = parseInt(townHallFigure.style.left);
    const thTop = parseInt(townHallFigure.style.top);
    const thWidth = parseInt(townHallFigure.style.width) / 30;
    const thHeight = parseInt(townHallFigure.style.height) / 30;
    
    if (!isInGrayArea(thLeft, thTop, thWidth, thHeight)) {
      const townhallData = buildingData.find(b => b.name === 'Ратуша');
      if (townhallData) {
        stats.coins += Number(townhallData.bonuses.coin_production) || 0;
        stats.hammers += Number(townhallData.bonuses.hammer_production) || 0;
        stats.chrono += Number(townhallData.bonuses.chrono_production) || 0;
      }
    }
  }
  
  displayStats(stats, globalStats);
}

function displayStats(stats, globalStats) {
  const statElements = {
    population: document.getElementById('stat-population'),
    coins: document.getElementById('stat-coins'),
    hammers: document.getElementById('stat-hammers'),
    chrono: document.getElementById('stat-chrono'),
    happiness: document.getElementById('stat-happiness'),
    od: document.getElementById('stat-od'),
    blue: document.getElementById('stat-blue'),
    red: document.getElementById('stat-red'),
    coin_acceleration: document.getElementById('stat-coin-acceleration'),
    hammer_acceleration: document.getElementById('stat-hammer-acceleration'),
    happiness_coef: document.getElementById('stat-happiness-coef'),
    coin_cost: document.getElementById('stat-coin-cost'),
    hammer_cost: document.getElementById('stat-hammer-cost'),
    chrono_cost: document.getElementById('stat-chrono-cost'),
    kd_capacity: document.getElementById('stat-kd-capacity')
  };
  
  for (let [key, element] of Object.entries(statElements)) {
    if (!element) continue;
    
    if (key === 'population') {
      const total = Math.round(stats.population).toLocaleString('ru-RU');
      const housing = Math.round(stats.housingPopulation).toLocaleString('ru-RU');
      element.textContent = `${housing}/${total}`;
    } else if (key === 'happiness') {
      const happinessValue = Math.round(stats.happiness).toLocaleString('ru-RU');
      element.textContent = `${happinessValue} (${Math.round(globalStats.happinessPercent)}%)`;
    } else if (key === 'happiness_coef') {
      element.textContent = Math.round(globalStats.happinessCoef * 100).toLocaleString('ru-RU');
    } else {
      const value = Math.round(stats[key]).toLocaleString('ru-RU');
      element.textContent = value;
    }
  }
}

// ============================================
// ИНФОРМАЦИЯ О ЗДАНИИ
// ============================================
function showBuildingInfo(figure) {
  const buildingName = figure.dataset.name;
  const building = buildingData.find(b => b.name === buildingName);
  if (!building) return;
  
  let housingPop = 0, totalHappiness = 0, coinAcc = 0, hammerAcc = 0;
  document.querySelectorAll('.figure').forEach(f => {
    const left = parseInt(f.style.left);
    const top = parseInt(f.style.top);
    const width = parseInt(f.style.width) / 30;
    const height = parseInt(f.style.height) / 30;
    if (isInGrayArea(left, top, width, height)) return;
    const b = buildingData.find(bd => bd.name === f.dataset.name);
    if (b && b.name !== 'Ратуша') {
      if (b.category === "Жилые") housingPop += Number(b.bonuses.population) || 0;
      totalHappiness += (Number(b.bonuses.happiness_production) || 0) - (Number(b.bonuses.happiness_cost) || 0);
      coinAcc += Number(b.bonuses.coin_acceleration) || 0;
      hammerAcc += Number(b.bonuses.hammer_acceleration) || 0;
    }
  });
  const realGlobalStats = calculateGlobalStatsWithValues(housingPop, totalHappiness, coinAcc, hammerAcc);
  
  let content = `<h3 style="margin:0 0 15px 0; text-align:center;">${buildingName}</h3>`;
  content += `<table class="building-info-table">`;
  
  for (let key in building.bonuses) {
    const baseValue = building.bonuses[key];
    const translatedKey = bonusTranslations[key] || key;
    let finalValue = baseValue;
    let showCalculation = false;
    let calculationText = '';
    
    if (key === 'coin_production') {
      finalValue = baseValue * (realGlobalStats.happinessCoef + realGlobalStats.coin_acceleration / 100);
      showCalculation = true;
      calculationText = `${baseValue} × (${realGlobalStats.happinessCoef.toFixed(2)} + ${realGlobalStats.coin_acceleration}%)`;
    } else if (key === 'hammer_production') {
      finalValue = baseValue * (realGlobalStats.happinessCoef + realGlobalStats.hammer_acceleration / 100);
      showCalculation = true;
      calculationText = `${baseValue} × (${realGlobalStats.happinessCoef.toFixed(2)} + ${realGlobalStats.hammer_acceleration}%)`;
    } else if (key === 'chrono_production') {
      finalValue = baseValue * realGlobalStats.happinessCoef;
      showCalculation = true;
      calculationText = `${baseValue} × ${realGlobalStats.happinessCoef.toFixed(2)}`;
    }
    
    let displayValue = '';
    if (typeof finalValue === 'number') {
      displayValue = finalValue % 1 !== 0 ? finalValue.toFixed(1) : finalValue.toLocaleString('ru-RU');
    } else {
      displayValue = finalValue;
    }
    
    content += `<tr><th>${translatedKey}</th><td class="${showCalculation ? 'highlight' : ''}">${displayValue}`;
    if (showCalculation && baseValue !== finalValue) {
      content += `<br><span class="base-value">(${calculationText})</span>`;
    }
    content += `</td></tr>`;
  }
  
  content += `</table>`;
  content += `<div style="margin-top:15px; padding-top:10px; border-top:1px solid #ccc;">`;
  content += `<strong>Глобальные бонусы:</strong><br>`;
  content += `Коэффициент счастья: ${realGlobalStats.happinessCoef.toFixed(2)} (${Math.round(realGlobalStats.happinessPercent)}%)<br>`;
  content += `Суммарное ускорение монет: +${realGlobalStats.coin_acceleration}%<br>`;
  content += `Суммарное ускорение молотков: +${realGlobalStats.hammer_acceleration}%`;
  content += `</div>`;
  
  const infoContent = document.getElementById('buildingInfoContent');
  if (infoContent) infoContent.innerHTML = content;
  
  const modal = document.getElementById('buildingInfoModal');
  if (modal) {
    modal.style.display = 'block';
    modal.style.left = `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
    makeDraggable(modal);
  }
}

function closeBuildingInfoModal() {
  const modal = document.getElementById('buildingInfoModal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// ПРИМЕНЕНИЕ ОТКРЫТЫХ РАСШИРЕНИЙ ИЗ ИГРЫ
// ============================================
function applyExpansions(expansionsText) {
  if (!expansionsText || !expansionsText.trim()) return;

  const lines = expansionsText.trim().split('\n');
  console.log(`[applyExpansions] блоков: ${lines.length}, первый: ${lines[0]}`);

  lines.forEach(line => {
    const parts = line.split('\t');
    if (parts.length < 2) return;
    const srcX = parseInt(parts[0]); // left в em → X
    const srcY = parseInt(parts[1]); // top  в em → Y

    if (isNaN(srcX) || isNaN(srcY)) return;

    // Тот же пересчёт что у зданий: colKvag = 27 - srcY - width + 1, rowKvag = srcX
    // map-bg размером 4x4
    const colKvag = 27 - srcY - 4 + 1; // 0-based колонка левого верхнего угла
    const rowKvag = srcX;               // 0-based строка

    console.log(`[applyExpansions] srcX=${srcX} srcY=${srcY} → col=${colKvag} row=${rowKvag}`);

    for (let dr = 0; dr < 4; dr++) {
      for (let dc = 0; dc < 4; dc++) {
        const r = rowKvag + dr; // 0-based
        const c = colKvag + dc; // 0-based
        if (r < 0 || r >= 28 || c < 0 || c >= 28) continue;
        // grid.children индексируется от 0, row/col в initGrid от 1
        // индекс = r * 28 + c  (0-based r и c)
        const idx = r * 28 + c;
        const cell = grid.children[idx];
        if (cell && cell.textContent === 'X') {
          cell.textContent = '';
          initialCellStates[idx] = '';
        }
      }
    }
  });
}

// ============================================
// ИМПОРТ ДАННЫХ ИЗ ОБЗОРА ГОРОДА
// ============================================

// Маппинг CSS-класса квантового города → CSS-класс фигуры в планировщике
const qiClassToFigureClass = {
  'main_building': 'townhall',
  'residential':   'yellow-light',
  'production':    'plum-light',
  'culture':       'pink-light',
  'goods':         'pink-dark',
  'military':      'blue-light',
  'decoration':    'lightblue-light',
  'impediment':    'road'
};

function placeFiguresFromInput() {
  const input = document.getElementById('city-data-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    alert('Вставьте данные из Обзора города.');
    return;
  }

  // Удаляем все здания включая Ратушу (при импорте она придёт в данных)
  document.querySelectorAll('.figure').forEach(fig => {
    if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
    fig.remove();
  });

  const lines = text.split('\n').filter(l => l.trim() !== '');
  let placed = 0;
  let skipped = 0;

  lines.forEach(line => {
    const parts = line.split('\t');
    if (parts.length < 4) return;

    // Формат TSV из qi_content.js: heightCells, widthCells, srcX, srcY, name, qiClass
    const heightCells = parseInt(parts[0]);
    const widthCells  = parseInt(parts[1]);
    const srcX        = parseInt(parts[2]); // строка (row в kvag)
    const srcY        = parseInt(parts[3]); // столбец от правого края
    const foeNameRaw  = (parts[4] || '').trim();
    const qiClass     = (parts[5] || '').trim(); // CSS-класс из квантового города

    if (isNaN(widthCells) || isNaN(heightCells) || isNaN(srcX) || isNaN(srcY)) return;

    // Пересчёт координат:
    // Начало координат — правый верхний угол, Y идёт влево.
    // col_kvag = 27 - srcY - widthCells + 1
    // row_kvag = srcX
    const colKvag = 27 - srcY - widthCells + 1;
    const rowKvag = srcX;

    // Проверяем что фигура влезает в поле 28×28
    if (colKvag < 0 || rowKvag < 0 || colKvag + widthCells > 28 || rowKvag + heightCells > 28) {
      skipped++;
      return;
    }

    const leftPx   = colKvag * 30;
    const topPx    = rowKvag * 30;
    const widthPx  = widthCells * 30;
    const heightPx = heightCells * 30;

    // Определяем CSS-класс фигуры по qiClass, затем по buildingData, затем fallback
    const figureClass = qiClassToFigureClass[qiClass] || null;

    // Ищем здание в buildingData
    let building = buildingData.find(b =>
      b.name === foeNameRaw || b.display_name === foeNameRaw
    );
    if (!building) {
      const nameLower = foeNameRaw.toLowerCase();
      building = buildingData.find(b =>
        b.name.toLowerCase().includes(nameLower) ||
        nameLower.includes(b.display_name.toLowerCase())
      );
    }

    const buildingName = building ? building.name : foeNameRaw;

    // Создаём фигуру с принудительным классом из квантового города
    createFigureWithClass(buildingName, widthPx, heightPx, leftPx, topPx, figureClass);
    placed++;
  });

  calculateBonuses();

  const bldModal = document.getElementById('bldCountModal');
  if (bldModal && bldModal.style.display !== 'none') updateBldCount();

  if (skipped > 0) {
    console.info(`Старт: размещено ${placed}, пропущено (за пределами поля) ${skipped}`);
  }
}

// ============================================
// РАБОТА С ФАЙЛАМИ
// ============================================
function getSaveData() {
  const figuresData = [];
  
  document.querySelectorAll('.figure').forEach(figure => {
    figuresData.push({
      name: figure.dataset.name || "",
      width: parseInt(figure.style.width),
      height: parseInt(figure.style.height),
      left: parseInt(figure.style.left),
      top: parseInt(figure.style.top)
    });
  });
  
  const cellsData = [];
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    cellsData.push({
      textContent: cell.textContent || '',
      isRoad: cell.classList.contains('road')
    });
  }
  
  return {
    figures: figuresData,
    cells: cellsData,
    initialCellStates: initialCellStates,
    townHallBonuses: townHallBonuses,
    timestamp: Date.now(),
    version: "1.0",
    app: "kvant"
  };
}

function saveToFile() {
  const saveData = getSaveData();
  const jsonString = JSON.stringify(saveData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kvaplan-g.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.json';
  input.onchange = loadFromFile;
  input.click();
}

function loadFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      document.querySelectorAll('.figure:not([data-name="Ратуша"])').forEach(fig => {
        if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
        fig.remove();
      });
      
      initialCellStates = data.initialCellStates || new Array(totalCells).fill('');
      for (let i = 0; i < totalCells; i++) {
        const cell = grid.children[i];
        cell.textContent = data.cells?.[i]?.textContent || '';
        if (data.cells?.[i]?.isRoad) {
          cell.classList.add('road');
          cell.classList.remove('boundary');
        } else {
          cell.classList.remove('road');
        }
      }
      
      townHallBonuses = data.townHallBonuses || {
        od: 0, coin_acceleration: 0, hammer_acceleration: 0,
        coin_initial: 0, hammer_initial: 0, kd_capacity: 200000
      };
      
      const odInput = document.getElementById('townHall-od');
      if (odInput) odInput.value = townHallBonuses.od;
      const coinAccInput = document.getElementById('townHall-coin-acceleration');
      if (coinAccInput) coinAccInput.value = townHallBonuses.coin_acceleration;
      const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
      if (hammerAccInput) hammerAccInput.value = townHallBonuses.hammer_acceleration;
      const coinInitInput = document.getElementById('townHall-coin-initial');
      if (coinInitInput) coinInitInput.value = townHallBonuses.coin_initial;
      const hammerInitInput = document.getElementById('townHall-hammer-initial');
      if (hammerInitInput) hammerInitInput.value = townHallBonuses.hammer_initial;
      
      const savedTownHall = data.figures?.find(fig => fig.name === "Ратуша");
      if (savedTownHall) {
        const townHallFigure = document.querySelector('.figure[data-name="Ратуша"]');
        if (townHallFigure) {
          let left = Number(savedTownHall.left);
          let top = Number(savedTownHall.top);
          if (!isNaN(left) && !isNaN(top)) {
            left = Math.round(left / 30) * 30;
            top = Math.round(top / 30) * 30;
            townHallFigure.style.left = left + 'px';
            townHallFigure.style.top = top + 'px';
          }
        }
      }
      
      if (Array.isArray(data.figures)) {
        data.figures.forEach(fig => {
          if (fig.name !== 'Ратуша') {
            createFigure(fig.name, fig.width, fig.height, fig.left, fig.top, true);
          }
        });
      }
      
      whiteCellsCount = countWhiteCells();
      document.querySelectorAll('.figure').forEach(figure => {
        addDragHandlers(figure);
      });
      calculateBonuses();
      clearedCellsHistory = [];
      
      const bldModal = document.getElementById('bldCountModal');
      if (bldModal && bldModal.style.display !== 'none') {
        updateBldCount();
      }
    } catch (err) {
      console.error("Ошибка при загрузке из файла:", err);
    }
  };
  reader.readAsText(file);
}

// ============================================
// МОДАЛЬНЫЕ ОКНА
// ============================================
function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;
  const header = element.querySelector('.modal-header');
  if (!header) return;
  
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function openTownHallModal() {
  const modal = document.getElementById('townHallModal');
  if (!modal) return;
  const bonusesButton = document.getElementById('bonusesBtn');
  if (!bonusesButton) return;
  
  modal.style.resize = 'both';
  modal.style.overflow = 'auto';
  modal.style.minWidth = '300px';
  modal.style.minHeight = '200px';
  
  modal.style.display = 'block';
  const rect = bonusesButton.getBoundingClientRect();
  let modalLeft = rect.right + 15;
  let modalTop  = rect.top;
  const modalWidth  = 300;
  const modalHeight = modal.offsetHeight || 200;
  if (modalLeft + modalWidth  > window.innerWidth)  modalLeft = window.innerWidth  - modalWidth  - 10;
  if (modalTop  + modalHeight > window.innerHeight) modalTop  = window.innerHeight - modalHeight - 10;
  if (modalLeft < 0) modalLeft = 10;
  if (modalTop  < 0) modalTop  = 10;
  modal.style.left = `${modalLeft}px`;
  modal.style.top  = `${modalTop}px`;
  
  makeDraggable(modal);

  // Обновляем селект и заполняем поля из активного профиля
  rebuildCityProfileSelect();
  applyProfileToInputs(townHallBonuses);
}

function closeTownHallModal() {
  const modal = document.getElementById('townHallModal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// ПРОФИЛИ ГОРОДОВ (бонусы основного города)
// ============================================
const CITY_PROFILES_KEY = 'kvagCityProfiles';
const CITY_ACTIVE_KEY   = 'kvagActiveCityProfile';

function loadCityProfiles() {
  try {
    return JSON.parse(localStorage.getItem(CITY_PROFILES_KEY) || '{}');
  } catch(e) { return {}; }
}

function saveCityProfiles(profiles) {
  try { localStorage.setItem(CITY_PROFILES_KEY, JSON.stringify(profiles)); } catch(e) {}
}

function getActiveProfileName() {
  return localStorage.getItem(CITY_ACTIVE_KEY) || '';
}

function setActiveProfileName(name) {
  try { localStorage.setItem(CITY_ACTIVE_KEY, name); } catch(e) {}
}

function rebuildCityProfileSelect() {
  const select = document.getElementById('cityProfileSelect');
  if (!select) return;
  const profiles = loadCityProfiles();
  const active   = getActiveProfileName();
  const names    = Object.keys(profiles);
  select.innerHTML = '';
  if (names.length === 0) {
    select.innerHTML = '<option value="">— нет городов —</option>';
    return;
  }
  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === active) opt.selected = true;
    select.appendChild(opt);
  });
}

function applyProfileToInputs(profile) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('townHall-od',                 profile.od                  ?? 0);
  set('townHall-coin-acceleration',  profile.coin_acceleration   ?? 0);
  set('townHall-hammer-acceleration',profile.hammer_acceleration ?? 0);
  set('townHall-coin-initial',       profile.coin_initial        ?? 0);
  set('townHall-hammer-initial',     profile.hammer_initial      ?? 0);
  set('townHall-kd-capacity',        profile.kd_capacity         ?? 200000);
}

function readBonusesFromInputs() {
  const get = (id, def) => Number(document.getElementById(id)?.value) || def;
  return {
    od:                  get('townHall-od', 0),
    coin_acceleration:   get('townHall-coin-acceleration', 0),
    hammer_acceleration: get('townHall-hammer-acceleration', 0),
    coin_initial:        get('townHall-coin-initial', 0),
    hammer_initial:      get('townHall-hammer-initial', 0),
    kd_capacity:         get('townHall-kd-capacity', 200000)
  };
}

function onCityProfileSelectChange() {
  const select = document.getElementById('cityProfileSelect');
  if (!select) return;
  const name = select.value;
  if (!name) return;
  const profiles = loadCityProfiles();
  if (profiles[name]) {
    applyProfileToInputs(profiles[name]);
    setActiveProfileName(name);
  }
}

function addCityProfile() {
  const name = prompt('Название города:');
  if (!name || !name.trim()) return;
  const trimmed = name.trim();
  const profiles = loadCityProfiles();
  profiles[trimmed] = readBonusesFromInputs();
  saveCityProfiles(profiles);
  setActiveProfileName(trimmed);
  rebuildCityProfileSelect();
}

function renameCityProfile() {
  const select = document.getElementById('cityProfileSelect');
  const oldName = select?.value;
  if (!oldName) return;
  const newName = prompt('Новое название:', oldName);
  if (!newName || !newName.trim() || newName.trim() === oldName) return;
  const trimmed = newName.trim();
  const profiles = loadCityProfiles();
  profiles[trimmed] = profiles[oldName];
  delete profiles[oldName];
  saveCityProfiles(profiles);
  setActiveProfileName(trimmed);
  rebuildCityProfileSelect();
}

function deleteCityProfile() {
  const select = document.getElementById('cityProfileSelect');
  const name = select?.value;
  if (!name) return;
  if (!confirm(`Удалить город «${name}»?`)) return;
  const profiles = loadCityProfiles();
  delete profiles[name];
  saveCityProfiles(profiles);
  // Переключаемся на первый оставшийся
  const remaining = Object.keys(profiles);
  const newActive = remaining[0] || '';
  setActiveProfileName(newActive);
  rebuildCityProfileSelect();
  if (newActive && profiles[newActive]) {
    applyProfileToInputs(profiles[newActive]);
    townHallBonuses = { ...profiles[newActive] };
    calculateBonuses();
  }
}

function saveTownHallBonuses() {
  townHallBonuses = readBonusesFromInputs();

  // Сохраняем в активный профиль (или создаём «По умолчанию»)
  const profiles = loadCityProfiles();
  let active = getActiveProfileName();
  if (!active || active === '') {
    active = 'По умолчанию';
    setActiveProfileName(active);
  }
  profiles[active] = { ...townHallBonuses };
  saveCityProfiles(profiles);
  rebuildCityProfileSelect();

  closeTownHallModal();
  calculateBonuses();
}

function openStatisticsModal() {
  const modal = document.getElementById('statisticsModal');
  if (!modal) return;
  modal.style.display = 'block';
  const modalWidth = modal.offsetWidth || 400;
  modal.style.left = `${window.innerWidth - modalWidth - 30}px`;
  modal.style.top = '50px';
  if (parseInt(modal.style.top) < 20) modal.style.top = '20px';
  makeDraggable(modal);
  calculateBonuses();
}

function closeStatisticsModal() {
  const modal = document.getElementById('statisticsModal');
  if (modal) modal.style.display = 'none';
}

function openBldCountModal() {
  updateBldCount();
  const modal = document.getElementById('bldCountModal');
  if (!modal) return;
  
  // Добавляем возможность изменения размера (как у статистики)
  modal.style.resize = 'both';
  modal.style.overflow = 'auto';
  modal.style.minWidth = '320px';
  modal.style.minHeight = '200px';
  
  modal.style.display = 'block';
  modal.style.left = `${window.innerWidth - modal.offsetWidth - 330}px`;
  modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
  
  // Добавляем перетаскивание (как у статистики)
  makeDraggable(modal);
}

function updateBldCount() {
  const map = {};
  let totalExpansionsPlaced = 0;
  
  document.querySelectorAll('.figure').forEach(fig => {
    const name = fig.dataset.name;
    if (name === 'Расш') {
      totalExpansionsPlaced++;
    } else if (name !== 'Ратуша' && name !== 'Препятствие') {
      map[name] = (map[name] || 0) + 1;
    }
  });
  
  let openCellsCount = 0;
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    if (!isGray && cell && cell.textContent !== 'X') {
      openCellsCount++;
    }
  }
  
  const BASE_AREA = 192;
  const EXPANSION_SIZE = 16;
  const extraCells = openCellsCount - BASE_AREA;
  let placedExpansions = extraCells > 0 ? Math.round(extraCells / EXPANSION_SIZE) : 0;
  const totalOpen = 12 + placedExpansions;
  
  const content = document.getElementById('bldCountContent');
  if (!content) return;
  
  let html = `
    <div class="expansions-section">
      <strong>📐 Расширения</strong>
      <div class="expansions-stats">
        <div>📦 Поставлено: <span>${placedExpansions}</span></div>
        <div>🏠 Базовых: <span>12</span></div>
        <div>🔓 Всего открыто: <span>${totalOpen}</span></div>
        <div style="font-size:12px; color:#666; margin-top:5px;">📊 Открыто клеток: ${openCellsCount} (база: ${BASE_AREA})</div>
      </div>
      <button id="restoreZonesBtn" ${placedExpansions > 0 ? '' : 'disabled'}>
        ↩️ Вернуть зоны расширений
      </button>
    </div>
    <div style="margin-top: 10px;">
      <strong>🏗️ Здания (${Object.keys(map).length} типов)</strong>
    </div>
    <div class="buildings-list">
  `;
  
  if (Object.keys(map).length === 0) {
    html += `<div class="empty-message">Нет зданий на поле</div>`;
  } else {
    const sortedBuildings = Object.entries(map).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sortedBuildings) {
      html += `
        <div class="building-item">
          <span class="building-name">${name}</span>
          <span class="building-count">${count} шт.</span>
        </div>
      `;
    }
  }
  
  html += `</div>`;
  content.innerHTML = html;
  
  const restoreBtn = document.getElementById('restoreZonesBtn');
  if (restoreBtn) {
    restoreBtn.onclick = function() {
      if (confirm('⚠️ Вернуть все зоны расширений?\nЭто удалит все расширения и вернёт символ "X" в ранее открытые клетки.')) {
        const restored = restoreExpansionZones();
        alert(`✅ Восстановлено ${restored} клеток!`);
        updateBldCount();
        calculateBonuses();
      }
    };
  }
}

function openFeedbackLink() {
  window.open("https://t.me/foehelp", '_blank');
}

// ============================================
// РЕЖИМЫ
// ============================================
function toggleDeleteMode() {
  const deleteButton = document.getElementById('deleteButton');
  if (!deleteButton) return;
  
  deleteMode = !deleteMode;
  
  if (deleteMode) {
    deleteButton.textContent = 'Отмена удаления';
    deleteButton.style.backgroundColor = '#ff4444';
    deleteButton.style.color = 'white';
    grid.classList.add('delete-mode');
    grid.style.cursor = 'crosshair';
    // Используем захват события (третий параметр true)
    grid.addEventListener('click', handleDeleteClick, true);
  } else {
    deleteButton.textContent = 'Удалить здание';
    deleteButton.style.backgroundColor = '';
    deleteButton.style.color = 'black';
    grid.classList.remove('delete-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleDeleteClick, true);
  }
}


function handleDeleteClick(event) {
  const figure = event.target.closest('.figure');
  if (figure && figure.dataset.name !== 'Ратуша') {
    event.stopPropagation();
    if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
    figure.remove();
    calculateBonuses();
  }
}

function resetFigures() {
  // Удаляем все здания кроме ратуши
  document.querySelectorAll('.figure').forEach(figure => {
    if (figure.dataset.name !== 'Ратуша') {
      if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
      figure.remove();
    }
  });
  
  // Сбрасываем выбранное здание
  if (selectedLiElement) {
    selectedLiElement.classList.remove('active');
  }
  selectedBuilding = null;
  selectedLiElement = null;
  
  // Удаляем призрачную фигуру
  if (ghostFigure) {
    ghostFigure.remove();
    ghostFigure = null;
  }
  grid.removeEventListener('mousemove', handleGhostMove);
  
  // Сбрасываем режим удаления, если он был активен
  if (deleteMode) {
    deleteMode = false;
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
      deleteButton.textContent = 'Удалить здание';
      deleteButton.style.backgroundColor = '';
      deleteButton.style.color = 'black';
    }
    grid.classList.remove('delete-mode');
    grid.style.cursor = '';
  }
  
  // Восстанавливаем клетки в исходное состояние
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    const row = Math.floor(i / 28) + 1;
    const col = (i % 28) + 1;
    
    let isGray = false;
    areas.forEach(area => {
      if (col >= area.colStart && col <= area.colEnd && row >= area.rowStart && row <= area.rowEnd) {
        isGray = true;
      }
    });
    
    // Определяем, должна ли клетка быть заблокирована (X)
    let shouldBeX = false;
    
    if (!isGray && !(
      (row >= 9 && row <= 20 && col >= 9 && col <= 20) ||
      (row >= 21 && row <= 24 && col >= 9 && col <= 20) ||
      (row >= 5 && row <= 8 && col >= 9 && col <= 24) ||
      (row >= 9 && row <= 16 && col >= 21 && col <= 24)
    ) || (row >= 17 && row <= 24 && col >= 9 && col <= 20)) {
      shouldBeX = true;
    }
    
    if (row >= 21 && row <= 28 && col >= 1 && col <= 8 && !isGray) {
      shouldBeX = true;
    }
    
    if (shouldBeX) {
      if (cell && !cell.classList.contains('road') && !cell.classList.contains('boundary')) {
        cell.textContent = initialCellStates[i] || 'X';
      }
    } else {
      if (cell) cell.textContent = '';
      initialCellStates[i] = '';
    }
  }
  
  // Сбрасываем бонусы ратуши на стандартные
  townHallBonuses = {
    od: 0,
    coin_acceleration: 0,
    hammer_acceleration: 0,
    coin_initial: 0,
    hammer_initial: 0,
    kd_capacity: 200000
  };
  
  // Обновляем поля в модальном окне, если они существуют
  const odInput = document.getElementById('townHall-od');
  if (odInput) odInput.value = 0;
  const coinAccInput = document.getElementById('townHall-coin-acceleration');
  if (coinAccInput) coinAccInput.value = 0;
  const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
  if (hammerAccInput) hammerAccInput.value = 0;
  const coinInitInput = document.getElementById('townHall-coin-initial');
  if (coinInitInput) coinInitInput.value = 0;
  const hammerInitInput = document.getElementById('townHall-hammer-initial');
  if (hammerInitInput) hammerInitInput.value = 0;
  const kdInput = document.getElementById('townHall-kd-capacity');
  if (kdInput) kdInput.value = 200000;
  
  // Пересчитываем количество белых клеток
  whiteCellsCount = countWhiteCells();
  
  // Пересчитываем бонусы
  calculateBonuses();
  
  // Очищаем историю расширений
  clearedCellsHistory = [];
  
  // Если окно количества зданий открыто - обновляем его
  const bldModal = document.getElementById('bldCountModal');
  if (bldModal && bldModal.style.display !== 'none') {
    updateBldCount();
  }
}

function resetToInitialState() {
  if (confirm("Вернуть редактор в исходное состояние? Страница будет перезагружена.")) {
    location.reload();
  }
}

function toggleStatisticsMinimize() {
  const modal = document.getElementById('statisticsModal');
  if (!modal) return;
  const btn = document.getElementById('minimizeStatsBtn');
  if (!btn) return;
  
  if (modal.classList.contains('minimized')) {
    modal.classList.remove('minimized');
    btn.textContent = '−';
    btn.title = 'Свернуть';
  } else {
    modal.classList.add('minimized');
    btn.textContent = '+';
    btn.title = 'Развернуть';
  }
}

function toggleTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  const tab = document.getElementById(`${tabId}Btn`);
  if (tab) tab.classList.add('active');
  
  const content = document.getElementById(tabId);
  if (content) content.classList.add('active');
}

// ============================================
// ЗАПУСК - ТОЛЬКО ОДИН DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  
  if (!grid || !tabContentContainer) {
    console.error('Критические элементы не найдены!');
    return;
  }
  
  initGrid();
  createTownHall();
  createMenu();

  // Загружаем бонусы активного профиля города
  try {
    const profiles = loadCityProfiles();
    const active   = getActiveProfileName();
    const profile  = (active && profiles[active]) ? profiles[active] : null;
    if (profile) {
      townHallBonuses = {
        od:                  profile.od                  ?? 0,
        coin_acceleration:   profile.coin_acceleration   ?? 0,
        hammer_acceleration: profile.hammer_acceleration ?? 0,
        coin_initial:        profile.coin_initial        ?? 0,
        hammer_initial:      profile.hammer_initial      ?? 0,
        kd_capacity:         profile.kd_capacity         ?? 200000
      };
    }
  } catch(e) {}

  calculateBonuses();
  
  const startBtn = document.getElementById('btnStart');
  if (startBtn) startBtn.addEventListener('click', placeFiguresFromInput);

  const resetFiguresBtn = document.getElementById('resetFiguresBtn');
  if (resetFiguresBtn) resetFiguresBtn.addEventListener('click', resetFigures);
  
  const resetToInitialBtn = document.getElementById('resetToInitialBtn');
  if (resetToInitialBtn) resetToInitialBtn.addEventListener('click', resetToInitialState);
  
  const deleteBtn = document.getElementById('deleteButton');
  if (deleteBtn) deleteBtn.addEventListener('click', toggleDeleteMode);
  
  const saveBtn = document.getElementById('saveButton');
  if (saveBtn) saveBtn.addEventListener('click', saveToFile);
  
  const loadBtn = document.getElementById('loadFileBtn');
  if (loadBtn) loadBtn.addEventListener('click', triggerFileInput);
  
  const tabs = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7'];
  tabs.forEach((tab) => {
    const btn = document.getElementById(`${tab}Btn`);
    if (btn) {
      btn.addEventListener('click', () => toggleTab(tab));
    }
  });
  
  const bonusesBtn = document.getElementById('bonusesBtn');
  if (bonusesBtn) bonusesBtn.addEventListener('click', openTownHallModal);
  
  const saveBonusesBtn = document.getElementById('saveBonusesBtn');
  if (saveBonusesBtn) saveBonusesBtn.addEventListener('click', saveTownHallBonuses);
  
  const closeBonusesBtn = document.getElementById('closeBonusesBtn');
  if (closeBonusesBtn) closeBonusesBtn.addEventListener('click', closeTownHallModal);
  
  const statisticsBtn = document.getElementById('statisticsBtn');
  if (statisticsBtn) statisticsBtn.addEventListener('click', openStatisticsModal);
  
  const closeStatisticsBtn = document.getElementById('closeStatisticsBtn');
  if (closeStatisticsBtn) closeStatisticsBtn.addEventListener('click', closeStatisticsModal);
  
  const bldCountBtn = document.getElementById('bldCountBtn');
  if (bldCountBtn) bldCountBtn.addEventListener('click', openBldCountModal);
  
  const closeBldCountBtn = document.getElementById('closeBldCountBtn');
  if (closeBldCountBtn) {
    closeBldCountBtn.addEventListener('click', () => {
      const modal = document.getElementById('bldCountModal');
      if (modal) modal.style.display = 'none';
    });
  }
const closeBonusesModalBtn = document.getElementById('closeBonusesModalBtn');
if (closeBonusesModalBtn) closeBonusesModalBtn.addEventListener('click', closeTownHallModal);

  const cityProfileSelect = document.getElementById('cityProfileSelect');
  if (cityProfileSelect) cityProfileSelect.addEventListener('change', onCityProfileSelectChange);
  const cityProfileAddBtn = document.getElementById('cityProfileAddBtn');
  if (cityProfileAddBtn) cityProfileAddBtn.addEventListener('click', addCityProfile);
  const cityProfileRenameBtn = document.getElementById('cityProfileRenameBtn');
  if (cityProfileRenameBtn) cityProfileRenameBtn.addEventListener('click', renameCityProfile);
  const cityProfileDeleteBtn = document.getElementById('cityProfileDeleteBtn');
  if (cityProfileDeleteBtn) cityProfileDeleteBtn.addEventListener('click', deleteCityProfile);
  
  const feedbackBtn = document.getElementById('feedbackBtn');
  if (feedbackBtn) feedbackBtn.addEventListener('click', openFeedbackLink);
  
  const closeBuildingInfoBtn = document.getElementById('closeBuildingInfoBtn');
  if (closeBuildingInfoBtn) closeBuildingInfoBtn.addEventListener('click', closeBuildingInfoModal);
  
  const minimizeStatsBtn = document.getElementById('minimizeStatsBtn');
  if (minimizeStatsBtn) minimizeStatsBtn.addEventListener('click', toggleStatisticsMinimize);
  
  
  
  
  // Обработчик кликов по сетке для расстановки зданий
// Обработчик кликов по сетке для расстановки зданий
grid.addEventListener('click', (e) => {
  // Если включен режим удаления - ничего не делаем
  if (deleteMode) {
    return;
  }
  
  if (!selectedBuilding) return;
  
  const cell = e.target.closest('.cell');
  if (!cell) return;
  
  const rect = grid.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const col = Math.floor(x / 30);
  const row = Math.floor(y / 30);
  
  if (col < 0 || col >= 28 || row < 0 || row >= 28) return;
  
  const [widthCells, heightCells] = selectedBuilding.size.split('x').map(Number);
  if (col + widthCells > 28 || row + heightCells > 28) {
    alert(`Фигура не помещается на поле!`);
    return;
  }
  
  createFigure(
    selectedBuilding.name,
    widthCells * 30,
    heightCells * 30,
    col * 30,
    row * 30
  );
});
  

});

// КОНЕЦ ФАЙЛА