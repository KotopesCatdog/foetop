// ============================================
//  editor.js — Редактор карт и провинций
// ============================================

import { 
  loadMapsData, 
  saveMapsData,
  getMapById,
  exportMapsData,
  importMapsData
} from './provinces.js';

console.log('🚀 Editor.js загружен');

// ===== Константы =====
const MARKER_COLOR = '#FFD700';
const MARKER_RADIUS = 30;

// ===== Состояние =====
let data = { maps: [] };
let currentMapId = null;
let selectedProvince = null;
let editingProvince = null;
let tempX = null, tempY = null;

// ===== DOM элементы =====
const mapsList = document.getElementById('mapsList');
const mapForm = document.getElementById('mapForm');
const mapIdInput = document.getElementById('mapIdInput');
const mapNameInput = document.getElementById('mapNameInput');
const mapEraInput = document.getElementById('mapEraInput');
const mapImageInput = document.getElementById('mapImageInput');
const mapDescriptionInput = document.getElementById('mapDescriptionInput');
const deleteMapBtn = document.getElementById('deleteMapBtn');

const mapImg = document.getElementById('editorMap');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const editorLoading = document.getElementById('editorLoading');
const editStatus = document.getElementById('editStatus');
const coordDisplay = document.getElementById('coordDisplay');
const provinceCountDisplay = document.getElementById('provinceCountDisplay');
const provinceCountSmall = document.getElementById('provinceCountSmall');

const provinceForm = document.getElementById('provinceForm');
const provName = document.getElementById('provName');
const provEmoji = document.getElementById('provEmoji');
const provX = document.getElementById('provX');
const provY = document.getElementById('provY');
const provList = document.getElementById('provinceList');
const provSearch = document.getElementById('provSearch');
const cancelProvinceEdit = document.getElementById('cancelProvinceEdit');

const mapContainer = document.querySelector('.map-container');
const tooltip = document.getElementById('editorTooltip');

// ===== Инициализация =====
async function init() {
  console.log('📌 Инициализация редактора...');
  
  try {
    data = await loadMapsData();
    console.log('📊 Загружено карт:', data.maps ? data.maps.length : 0);
    
    renderMapsList();
    
    if (data.maps && data.maps.length > 0) {
      selectMap(data.maps[0].id);
    } else {
      editorLoading.style.display = 'flex';
      editorLoading.innerHTML = '<span>🖼️</span><p>Создайте новую карту</p>';
      mapImg.classList.remove('visible');
      mapImg.style.display = 'none';
    }
    
    setupEvents();
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// ===== Рендер списка карт =====
function renderMapsList() {
  mapsList.innerHTML = '';
  
  if (!data.maps || data.maps.length === 0) {
    mapsList.innerHTML = '<li style="text-align:center;color:#4a4a6a;padding:8px;font-size:12px;">Нет карт</li>';
    return;
  }
  
  data.maps.forEach(map => {
    const li = document.createElement('li');
    li.dataset.mapId = map.id;
    li.className = map.id === currentMapId ? 'active' : '';
    li.innerHTML = `
      <span class="map-name">${map.name}</span>
      <span class="map-era">${map.era || ''}</span>
    `;
    li.onclick = () => selectMap(map.id);
    mapsList.appendChild(li);
  });
}

// ===== Выбор карты =====
function selectMap(mapId) {
  console.log('🗺️ Выбор карты:', mapId);
  
  const map = getMapById(data, mapId);
  if (!map) {
    console.warn('Карта не найдена');
    return;
  }
  
  currentMapId = mapId;
  selectedProvince = null;
  editingProvince = null;
  tempX = null;
  tempY = null;
  
  document.querySelectorAll('#mapsList li').forEach(li => {
    li.classList.toggle('active', li.dataset.mapId === mapId);
  });
  
  mapIdInput.value = map.id;
  mapNameInput.value = map.name;
  mapEraInput.value = map.era || '';
  mapImageInput.value = map.image || '';
  mapDescriptionInput.value = map.description || '';
  
  if (map.image) {
    mapImg.src = map.image;
    mapImg.alt = map.name;
    mapImg.onload = () => {
      console.log('✅ Картинка загружена');
      mapImg.classList.add('visible');
      mapImg.style.display = 'block';
      editorLoading.style.display = 'none';
      setTimeout(() => {
        setupCanvas();
        renderProvinces();
        renderProvinceList();
        updateStatus();
      }, 50);
    };
    mapImg.onerror = () => {
      console.error('❌ Ошибка загрузки картинки');
      editorLoading.style.display = 'flex';
      editorLoading.innerHTML = `
        <span>❌</span>
        <p>Не удалось загрузить картинку</p>
        <p style="font-size:11px;color:#4a4a6a;">${map.image}</p>
      `;
      mapImg.classList.remove('visible');
      mapImg.style.display = 'none';
    };
    editorLoading.style.display = 'flex';
    editorLoading.innerHTML = `<span>🔄</span><p>Загрузка карты...</p>`;
  } else {
    editorLoading.style.display = 'flex';
    editorLoading.innerHTML = `<span>⚠️</span><p>Укажите путь к картинке</p>`;
    mapImg.classList.remove('visible');
    mapImg.style.display = 'none';
  }
  
  resetProvinceForm();
}

// ===== Настройка Canvas =====
function setupCanvas() {
  const rect = mapContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}

// ===== Получение координат =====
function getMapCoords(e) {
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  const canvasX = e.clientX - containerRect.left;
  const canvasY = e.clientY - containerRect.top;
  const imgX = e.clientX - imgRect.left;
  const imgY = e.clientY - imgRect.top;
  
  const scaleX = mapImg.naturalWidth / imgRect.width;
  const scaleY = mapImg.naturalHeight / imgRect.height;
  
  const mapX = imgX * scaleX;
  const mapY = imgY * scaleY;
  
  return {
    mapX: mapX,
    mapY: mapY,
    canvasX: canvasX,
    canvasY: canvasY
  };
}

// ===== Рендер провинций (на карте - БЕЗ эмодзи) =====
function renderProvinces() {
  if (!currentMapId || !mapImg.naturalWidth) return;
  
  const map = getMapById(data, currentMapId);
  if (!map) return;
  
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;
  const scaleX = imgRect.width / mapImg.naturalWidth;
  const scaleY = imgRect.height / mapImg.naturalHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  map.provinces.forEach(p => {
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    const r = MARKER_RADIUS * scaleX;
    
    const isSelected = selectedProvince && p.id === selectedProvince.id;
    const isEditing = editingProvince && p.id === editingProvince.id;
    
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isSelected || isEditing ? MARKER_COLOR + '66' : MARKER_COLOR + '44';
    ctx.fill();
    
    ctx.strokeStyle = isSelected || isEditing ? '#FFFFFF' : MARKER_COLOR;
    ctx.lineWidth = isSelected || isEditing ? 3 : 2;
    ctx.shadowBlur = isSelected || isEditing ? 20 : 0;
    ctx.shadowColor = isSelected || isEditing ? '#FFFFFF' : 'transparent';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // ТОЛЬКО НАЗВАНИЕ (без эмодзи)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText(p.name, x, y - r - 12);
    ctx.shadowBlur = 0;
  });
  
  // Временная точка
  if (tempX !== null && tempY !== null) {
    const x = offsetX + tempX * scaleX;
    const y = offsetY + tempY * scaleY;
    
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    const size = 8;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ===== Рендер списка провинций (с эмодзи) =====
// ===== Рендер списка провинций (с эмодзи, если есть) =====
function renderProvinceList() {
  const map = getMapById(data, currentMapId);
  if (!map) return;
  
  const term = provSearch.value.toLowerCase().trim();
  const filtered = term 
    ? map.provinces.filter(p => p.name.toLowerCase().includes(term))
    : map.provinces;
  
  provList.innerHTML = '';
  filtered.forEach(p => {
    const li = document.createElement('li');
    li.style.borderLeft = `3px solid ${MARKER_COLOR}`;
    li.style.paddingLeft = '8px';
    
    // Эмодзи в списке (только если есть)
    const emoji = document.createElement('span');
    emoji.className = 'prov-emoji';
    emoji.textContent = p.emoji || '';  // ← УБРАЛ 💎
    emoji.style.fontSize = '16px';
    emoji.style.marginRight = '6px';
    emoji.style.width = '24px';
    emoji.style.display = 'inline-block';
    emoji.style.textAlign = 'center';
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    name.textContent = p.name;
    
    const coords = document.createElement('span');
    coords.className = 'prov-coords';
    coords.textContent = `${p.x}, ${p.y}`;
    
    const actions = document.createElement('span');
    actions.className = 'prov-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✏️';
    editBtn.title = 'Редактировать';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editProvince(p);
    };
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Удалить';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Удалить провинцию "${p.name}"?`)) {
        deleteProvince(p.id);
      }
    };
    
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    
    li.appendChild(emoji);
    li.appendChild(name);
    li.appendChild(coords);
    li.appendChild(actions);
    li.onclick = () => {
      selectedProvince = p;
      renderProvinces();
      renderProvinceList();
    };
    
    if (selectedProvince && p.id === selectedProvince.id) {
      li.style.background = '#1e2a4a';
    }
    
    provList.appendChild(li);
  });
}

// ===== Редактирование провинции =====
function editProvince(province) {
  editingProvince = province;
  provName.value = province.name;
  provEmoji.value = province.emoji || '';
  provX.value = province.x;
  provY.value = province.y;
  tempX = province.x;
  tempY = province.y;
  
  cancelProvinceEdit.style.display = 'block';
  document.querySelector('#provinceForm .btn-primary').textContent = '💾 Обновить';
  
  editStatus.textContent = `✏️ Редактирование: ${province.name}`;
  renderProvinces();
  renderProvinceList();
}

// ===== Удаление провинции =====
function deleteProvince(provinceId) {
  const map = getMapById(data, currentMapId);
  if (!map) return;
  
  map.provinces = map.provinces.filter(p => p.id !== provinceId);
  if (selectedProvince && selectedProvince.id === provinceId) {
    selectedProvince = null;
  }
  if (editingProvince && editingProvince.id === provinceId) {
    editingProvince = null;
    cancelProvinceEdit.style.display = 'none';
    document.querySelector('#provinceForm .btn-primary').textContent = '➕ Добавить';
    resetProvinceForm();
  }
  
  saveMapsData(data);
  renderProvinceList();
  renderProvinces();
  updateStatus();
}

// ===== Сброс формы провинции =====
function resetProvinceForm() {
  provinceForm.reset();
  provX.value = '';
  provY.value = '';
  tempX = null;
  tempY = null;
  editingProvince = null;
  cancelProvinceEdit.style.display = 'none';
  document.querySelector('#provinceForm .btn-primary').textContent = '➕ Добавить';
  editStatus.textContent = 'Режим: добавление';
  renderProvinces();
}

// ===== Обновление статуса =====
function updateStatus() {
  const map = getMapById(data, currentMapId);
  if (map) {
    const count = map.provinces.length;
    provinceCountDisplay.textContent = `Провинций: ${count}`;
    provinceCountSmall.textContent = count;
  }
}

// ===== Сохранение провинции (с поддержкой пустого эмодзи) =====
function saveProvince() {
  const map = getMapById(data, currentMapId);
  if (!map) {
    alert('❌ Сначала выберите или создайте карту');
    return;
  }
  
  const name = provName.value.trim();
  const emoji = provEmoji.value || '';  // Может быть пустым
  const x = parseInt(provX.value);
  const y = parseInt(provY.value);
  
  if (!name) {
    alert('❌ Введите название провинции');
    provName.focus();
    return;
  }
  
  if (isNaN(x) || isNaN(y)) {
    alert('❌ Кликните на карте, чтобы выбрать место');
    return;
  }
  
  if (editingProvince) {
    const index = map.provinces.findIndex(p => p.id === editingProvince.id);
    if (index !== -1) {
      map.provinces[index] = { 
        ...editingProvince, 
        name, 
        emoji: emoji || undefined,
        x, 
        y,
        color: MARKER_COLOR,
        radius: MARKER_RADIUS
      };
    }
  } else {
    const existing = map.provinces.find(p => {
      const dx = x - p.x;
      const dy = y - p.y;
      return Math.sqrt(dx*dx + dy*dy) <= 10;
    });
    if (existing) {
      alert(`❌ В этом месте уже есть провинция "${existing.name}"`);
      return;
    }
    
    const maxId = map.provinces.reduce((max, p) => Math.max(max, p.id), 0);
    const newProvince = {
      id: maxId + 1,
      name,
      x,
      y,
      color: MARKER_COLOR,
      radius: MARKER_RADIUS
    };
    if (emoji) {
      newProvince.emoji = emoji;
    }
    map.provinces.push(newProvince);
  }
  
  saveMapsData(data);
  renderProvinceList();
  renderProvinces();
  updateStatus();
  resetProvinceForm();
  editStatus.textContent = '✅ Провинция сохранена!';
}

// ===== Клик по карте =====
function onCanvasClick(e) {
  const { mapX, mapY } = getMapCoords(e);
  
  const map = getMapById(data, currentMapId);
  if (map) {
    const found = map.provinces.find(p => {
      const dx = mapX - p.x;
      const dy = mapY - p.y;
      return Math.sqrt(dx*dx + dy*dy) <= MARKER_RADIUS;
    });
    if (found) {
      selectedProvince = found;
      renderProvinces();
      renderProvinceList();
      return;
    }
  }
  
  tempX = Math.round(mapX);
  tempY = Math.round(mapY);
  provX.value = tempX;
  provY.value = tempY;
  
  if (editingProvince) {
    editingProvince = null;
    document.querySelector('#provinceForm .btn-primary').textContent = '➕ Добавить';
    cancelProvinceEdit.style.display = 'none';
  }
  
  editStatus.textContent = `📍 Новая провинция: ${tempX}, ${tempY}`;
  renderProvinces();
  provName.focus();
}

// ===== Ховер (с эмодзи в подсказке) =====
function onCanvasMove(e) {
  const { mapX, mapY, canvasX, canvasY } = getMapCoords(e);
  coordDisplay.textContent = `X: ${Math.round(mapX)}, Y: ${Math.round(mapY)}`;
  
  const map = getMapById(data, currentMapId);
  if (map) {
    const found = map.provinces.find(p => {
      const dx = mapX - p.x;
      const dy = mapY - p.y;
      return Math.sqrt(dx*dx + dy*dy) <= MARKER_RADIUS;
    });
    if (found) {
      const emoji = found.emoji || '';
      tooltip.textContent = `${emoji} ${found.name} (${found.x}, ${found.y})`.trim();
      tooltip.style.left = (canvasX + 12) + 'px';
      tooltip.style.top = (canvasY - 10) + 'px';
      tooltip.classList.remove('hidden');
      canvas.style.cursor = 'pointer';
      return;
    }
  }
  hideTooltip();
  canvas.style.cursor = 'crosshair';
}

function hideTooltip() {
  tooltip.classList.add('hidden');
}

// ===== Настройка событий =====
function setupEvents() {
  // Добавление карты
  document.getElementById('addMapBtn').addEventListener('click', () => {
    const newId = 'map_' + Date.now();
    const newMap = {
      id: newId,
      name: 'Новая карта',
      era: 'Новая эпоха',
      image: '',
      description: '',
      provinces: []
    };
    data.maps.push(newMap);
    saveMapsData(data);
    renderMapsList();
    selectMap(newId);
  });
  
  // Сохранение карты
  mapForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const map = getMapById(data, currentMapId);
    if (!map) {
      alert('❌ Карта не найдена');
      return;
    }
    map.id = mapIdInput.value.trim();
    map.name = mapNameInput.value.trim();
    map.era = mapEraInput.value.trim();
    map.image = mapImageInput.value.trim();
    map.description = mapDescriptionInput.value.trim();
    saveMapsData(data);
    renderMapsList();
    selectMap(map.id);
    alert('✅ Карта сохранена!');
  });
  
  // Удаление карты
  deleteMapBtn.addEventListener('click', () => {
    if (!currentMapId) return;
    const map = getMapById(data, currentMapId);
    if (!map) return;
    if (confirm(`Удалить карту "${map.name}" и все её провинции?`)) {
      data.maps = data.maps.filter(m => m.id !== currentMapId);
      saveMapsData(data);
      currentMapId = null;
      renderMapsList();
      mapForm.reset();
      mapImg.classList.remove('visible');
      mapImg.style.display = 'none';
      editorLoading.style.display = 'flex';
      editorLoading.innerHTML = '<span>🗑️</span><p>Карта удалена</p>';
      provList.innerHTML = '';
      provinceCountDisplay.textContent = 'Провинций: 0';
      provinceCountSmall.textContent = '0';
    }
  });
  
  // Клик по карте
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('mousemove', onCanvasMove);
  canvas.addEventListener('mouseleave', hideTooltip);
  
  // Форма провинции
  provinceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProvince();
  });
  
  provinceForm.addEventListener('reset', resetProvinceForm);
  cancelProvinceEdit.addEventListener('click', resetProvinceForm);
  provSearch.addEventListener('input', renderProvinceList);
  
  // Экспорт
  document.getElementById('exportData').addEventListener('click', () => {
    exportMapsData(data);
  });
  
  // Импорт
  document.getElementById('importData').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const newData = await importMapsData(file);
          data = newData;
          renderMapsList();
          if (data.maps && data.maps.length > 0) {
            selectMap(data.maps[0].id);
          }
          alert('✅ Данные импортированы!');
        } catch (err) {
          alert('❌ Ошибка: ' + err.message);
        }
      }
    };
    input.click();
  });
  
  document.getElementById('saveData').addEventListener('click', () => {
    saveMapsData(data);
    alert('✅ Все данные сохранены!');
  });
}

// ===== Анимация =====
function animate() {
  if (mapImg.complete && mapImg.naturalWidth) {
    renderProvinces();
  }
  requestAnimationFrame(animate);
}

// ===== Resize =====
window.addEventListener('resize', () => {
  setupCanvas();
  if (currentMapId) {
    renderProvinces();
  }
});

// ===== Запуск =====
window.addEventListener('load', init);