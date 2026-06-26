// ============================================
//  app.js — Единая логика (просмотр + редактор)
// ============================================

import { 
  loadMapsData, 
  saveMapsData,
  getMapById,
  searchProvince,
  exportMapsData,
  importMapsData
} from './provinces.js';

console.log('🚀 App.js загружен');

// ===== Состояние =====
let data = { maps: [] };
let currentMapId = null;
let isEditMode = false;
let selectedProvince = null;
let filteredProvinces = [];
let emojiFilter = 'all';
let kFilter = false;
let editingProvince = null;
let tempX = null, tempY = null;

// Zoom и панорамирование
let zoom = 1;
let panX = 0, panY = 0;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let panStartX = 0, panStartY = 0;
let zoomTimeout = null;

// ===== Константы =====
const MARKER_COLOR = '#FFD700';
const MARKER_RADIUS_SMALL = 6;
const MARKER_RADIUS_LARGE = 30;

// ===== DOM элементы =====
const tabsContainer = document.getElementById('tabsContainer');
const mapImg = document.getElementById('mainMap');
const canvas = document.getElementById('highlightCanvas');
const ctx = canvas.getContext('2d');
const list = document.getElementById('provinceList');
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('searchCount');
const provinceCount = document.getElementById('provinceCount');
const loadingMessage = document.getElementById('loadingMessage');
const mapContainer = document.querySelector('.map-container');
const zoomInfo = document.getElementById('zoomInfo');
const toggleModeBtn = document.getElementById('toggleMode');
const editStatus = document.getElementById('editStatus');

// Редактор
const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');
const mapsList = document.getElementById('mapsList');
const mapForm = document.getElementById('mapForm');
const mapIdInput = document.getElementById('mapIdInput');
const mapNameInput = document.getElementById('mapNameInput');
const mapEraInput = document.getElementById('mapEraInput');
const mapImageInput = document.getElementById('mapImageInput');
const mapDescriptionInput = document.getElementById('mapDescriptionInput');
const deleteMapBtn = document.getElementById('deleteMapBtn');
const addMapBtn = document.getElementById('addMapBtn');
const provinceForm = document.getElementById('provinceForm');
const provName = document.getElementById('provName');
const provEmoji = document.getElementById('provEmoji');
const provX = document.getElementById('provX');
const provY = document.getElementById('provY');
const provList = document.getElementById('provinceListEditor');
const provSearch = document.getElementById('provSearch');
const cancelProvinceEdit = document.getElementById('cancelProvinceEdit');
const provinceCountSmall = document.getElementById('provinceCountSmall');
const saveDataBtn = document.getElementById('saveData');
const exportBtn = document.getElementById('exportData');
const importBtn = document.getElementById('importData');

// ===== ИНИЦИАЛИЗАЦИЯ =====
async function init() {
  console.log('📌 Инициализация...');
  
  try {
    data = await loadMapsData();
    console.log('📊 Данные загружены:', data);
    
    if (!data.maps || data.maps.length === 0) {
      loadingMessage.innerHTML = '<span>❌</span><p>Нет данных для отображения</p>';
      return;
    }
    
    createTabs();
    setupTabDrag();
    
    const firstMap = data.maps[0];
    if (firstMap) {
      switchMap(firstMap.id);
    }
    
    setupEvents();
    animate();
    
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    loadingMessage.innerHTML = `
      <span>❌</span>
      <p>Ошибка загрузки данных</p>
      <p style="font-size:12px;color:#4a4a6a;">${error.message}</p>
    `;
  }
}

// ===== ВКЛАДКИ =====
function createTabs(keepActive = false) {
  tabsContainer.innerHTML = '';
  
  data.maps.forEach((map, index) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (map.id === currentMapId ? ' active' : '');
    btn.dataset.mapId = map.id;
    btn.innerHTML = map.name;
    btn.onclick = () => {
      resetTransform();
      switchMap(map.id);
    };
    tabsContainer.appendChild(btn);
  });
}

// ===== ПЕРЕМЕЩЕНИЕ ВКЛАДОК =====
let tabDragStartX = 0;
let tabScrollLeft = 0;
let tabIsDragging = false;

function setupTabDrag() {
  tabsContainer.addEventListener('mousedown', (e) => {
    if (e.target.closest('.tab-btn')) {
      tabIsDragging = true;
      tabDragStartX = e.pageX - tabsContainer.offsetLeft;
      tabScrollLeft = tabsContainer.scrollLeft;
      tabsContainer.style.cursor = 'grabbing';
      tabsContainer.style.userSelect = 'none';
    }
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!tabIsDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsContainer.offsetLeft;
    const walk = (x - tabDragStartX) * 1.5;
    tabsContainer.scrollLeft = tabScrollLeft - walk;
  });
  
  window.addEventListener('mouseup', () => {
    if (tabIsDragging) {
      tabIsDragging = false;
      tabsContainer.style.cursor = 'default';
      tabsContainer.style.userSelect = '';
    }
  });
}

// ===== КОЛЁСИКО ДЛЯ ВКЛАДОК =====
tabsContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  tabsContainer.scrollLeft += e.deltaY;
}, { passive: false });

// ===== ПЕРЕКЛЮЧЕНИЕ КАРТЫ =====
function switchMap(mapId) {
  const map = getMapById(data, mapId);
  if (!map) return;
  
  currentMapId = mapId;
  selectedProvince = null;
  filteredProvinces = [];
  emojiFilter = 'all';
  kFilter = false;
  tempX = null;
  tempY = null;
  editingProvince = null;
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mapId === mapId);
  });
  
  document.querySelectorAll('.emoji-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.emoji === 'all');
  });
  
  const kFilterBtn = document.getElementById('kFilterBtn');
  if (kFilterBtn) {
    kFilterBtn.classList.remove('active');
  }
  
  loadingMessage.style.display = 'flex';
  loadingMessage.innerHTML = `<span>🔄</span><p>Загрузка карты "${map.name}"...</p>`;
  mapImg.style.display = 'none';
  mapImg.classList.remove('visible');
  
  mapImg.src = map.image;
  mapImg.alt = map.name;
  
  mapImg.onload = () => {
    mapImg.style.display = 'block';
    mapImg.classList.add('visible');
    loadingMessage.style.display = 'none';
    
    resetTransform();
    setupCanvas();
    updateView();
    
    if (isEditMode) {
      selectMapInEditor(mapId);
    }
  };
  
  mapImg.onerror = () => {
    loadingMessage.innerHTML = `
      <span>❌</span>
      <p>Не удалось загрузить картинку</p>
      <p style="font-size:12px;color:#4a4a6a;">${map.image}</p>
    `;
    loadingMessage.style.display = 'flex';
  };
}

// ===== ОБНОВЛЕНИЕ ПРОСМОТРА =====
function updateView() {
  const map = getMapById(data, currentMapId);
  if (!map) return;
  
  const listProvinces = getFilteredProvinces(map);
  filteredProvinces = listProvinces;
  
  renderList(map, listProvinces);
  renderHighlights();
  updateCounts(map, listProvinces);
}

// ===== ФИЛЬТРЫ =====
function getFilteredProvinces(map) {
  let result = map.provinces || [];
  
  if (emojiFilter !== 'all') {
    result = result.filter(p => p.emoji === emojiFilter);
  }
  
  if (kFilter) {
    result = result.filter(p => p.k === true);
  }
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
  }
  
  return result;
}

// ===== РЕНДЕР СПИСКА (просмотр) =====
function renderList(map, provincesToShow) {
  const listProvinces = provincesToShow || getFilteredProvinces(map);
  
  list.innerHTML = '';
  listProvinces.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    
    const isSelected = selectedProvince && p.id === selectedProvince.id;
    const isK = p.k === true && kFilter;
    
    const emoji = document.createElement('span');
    emoji.className = 'prov-emoji';
    emoji.textContent = p.emoji || '';
    emoji.style.fontSize = isSelected ? '20px' : '16px';
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    if (isSelected) {
      name.style.fontWeight = 'bold';
      name.style.color = '#f7c948';
    }
    if (isK) {
      name.style.color = '#FF4444';
    }
    name.textContent = p.name + (isK ? ' 🔑' : '');
    
    li.appendChild(emoji);
    li.appendChild(name);
    
    if (isSelected) {
      li.style.background = '#1e2a4a';
      li.style.borderLeft = '3px solid #f7c948';
    }
    if (isK) {
      li.style.borderLeft = '3px solid #FF0000';
    }
    
    li.onclick = () => {
      if (isEditMode) return;
      selectedProvince = p;
      updateView();
    };
    
    list.appendChild(li);
  });
}

// ===== ОТРИСОВКА КАРТЫ =====
function renderHighlights() {
  if (!mapImg.naturalWidth || !currentMapId) return;
  
  const map = getMapById(data, currentMapId);
  if (!map || !map.provinces) return;
  
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;
  const scaleX = imgRect.width / mapImg.naturalWidth;
  const scaleY = imgRect.height / mapImg.naturalHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const provinces = filteredProvinces.length > 0 ? filteredProvinces : map.provinces;
  
  // Рисуем все провинции
  provinces.forEach(p => {
    if (selectedProvince && p.id === selectedProvince.id) return;
    
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    
    const isK = p.k === true && kFilter;
    const color = isK ? '#FF0000' : MARKER_COLOR;
    const radius = isK ? 15 * scaleX : MARKER_RADIUS_SMALL * scaleX;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isK ? 'rgba(255,0,0,0.25)' : MARKER_COLOR;
    ctx.shadowColor = isK ? '#FF0000' : MARKER_COLOR;
    ctx.shadowBlur = isK ? 20 : 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    if (isK) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = isK ? '#FF4444' : 'rgba(255,255,255,0.7)';
    ctx.font = isK ? 'bold 11px Arial' : '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(p.name + (isK ? ' 🔑' : ''), x, y - radius - 4);
    ctx.shadowBlur = 0;
  });
  
  // ===== ВРЕМЕННАЯ ТОЧКА =====
  if (isEditMode && tempX !== null && tempY !== null) {
    const x = offsetX + tempX * scaleX;
    const y = offsetY + tempY * scaleY;
    const r = 18 * scaleX;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    const time = Date.now() / 300;
    const pulse = 0.6 + 0.4 * Math.sin(time);
    
    ctx.beginPath();
    ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
    ctx.fill();
    
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2 + pulse * 2;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20 + 15 * pulse;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 6;
    const name = provName.value.trim() || 'Новая провинция';
    ctx.fillText(name, x, y - r * pulse - 8);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(`(${tempX}, ${tempY})`, x, y + r * pulse + 6);
    ctx.shadowBlur = 0;
  }
  
  // ===== ВЫДЕЛЕННАЯ ПРОВИНЦИЯ =====
  if (selectedProvince) {
    const p = selectedProvince;
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    const r = MARKER_RADIUS_LARGE * scaleX;
    
    const time = Date.now() / 400;
    const pulse = 0.7 + 0.3 * Math.sin(time);
    const glowIntensity = 15 + 20 * (0.7 + 0.3 * Math.sin(time));
    
    const gradient = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.5);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${0.3 * pulse})`);
    gradient.addColorStop(0.5, `rgba(255, 215, 0, ${0.15 * pulse})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
    ctx.fill();
    
    ctx.strokeStyle = MARKER_COLOR;
    ctx.lineWidth = 2 + pulse * 1.5;
    ctx.shadowColor = MARKER_COLOR;
    ctx.shadowBlur = glowIntensity;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(p.name, x, y - r - 16);
    ctx.shadowBlur = 0;
    
    const dotPulse = 0.6 + 0.4 * Math.sin(time * 1.5);
    ctx.beginPath();
    ctx.arc(x, y, 4 * dotPulse * scaleX, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * dotPulse})`;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ===== ОБНОВЛЕНИЕ СЧЁТЧИКОВ =====
function updateCounts(map, listProvinces) {
  const count = listProvinces ? listProvinces.length : (map.provinces ? map.provinces.length : 0);
  searchCount.textContent = count;
  provinceCount.textContent = `${map.provinces ? map.provinces.length : 0} провинций на карте`;
}

// ===== ПОИСК =====
function handleSearch(query) {
  const results = searchProvince(data, query);
  
  if (results.length === 0) {
    list.innerHTML = `<li style="text-align:center;color:#4a4a6a;padding:20px;">Ничего не найдено</li>`;
    searchCount.textContent = '0';
    return;
  }
  
  list.innerHTML = '';
  results.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    
    const emoji = document.createElement('span');
    emoji.className = 'prov-emoji';
    emoji.textContent = p.emoji || '';
    emoji.style.fontSize = '16px';
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    name.textContent = p.name;
    
    const mapInfo = document.createElement('span');
    mapInfo.className = 'prov-map';
    mapInfo.textContent = `📍 ${p.mapName}`;
    
    const match = document.createElement('span');
    match.className = 'prov-match';
    match.textContent = 'найдено';
    
    li.appendChild(emoji);
    li.appendChild(name);
    li.appendChild(mapInfo);
    li.appendChild(match);
    li.onclick = () => {
      resetTransform();
      switchMap(p.mapId);
      setTimeout(() => {
        const map = getMapById(data, p.mapId);
        if (map) {
          const province = map.provinces.find(pr => pr.id === p.id);
          if (province) {
            searchInput.value = '';
            selectedProvince = province;
            updateView();
          }
        }
      }, 300);
    };
    
    list.appendChild(li);
  });
  
  searchCount.textContent = results.length;
}

// ===== РЕДАКТОР: ВЫБОР КАРТЫ =====
function selectMapInEditor(mapId) {
  const map = getMapById(data, mapId);
  if (!map) return;
  
  document.querySelectorAll('#mapsList li').forEach(li => {
    li.classList.toggle('active', li.dataset.mapId === mapId);
  });
  
  mapIdInput.value = map.id;
  mapNameInput.value = map.name;
  mapEraInput.value = map.era || '';
  mapImageInput.value = map.image || '';
  mapDescriptionInput.value = map.description || '';
  
  renderProvinceList();
  provinceCountSmall.textContent = map.provinces ? map.provinces.length : 0;
}

// ===== РЕДАКТОР: СПИСОК КАРТ =====
function renderMapsList() {
  mapsList.innerHTML = '';
  
  data.maps.forEach(map => {
    const li = document.createElement('li');
    li.dataset.mapId = map.id;
    li.className = map.id === currentMapId ? 'active' : '';
    li.innerHTML = `
      <span class="map-name">${map.name}</span>
      <span class="map-era">${map.era || ''}</span>
    `;
    li.onclick = () => {
      switchMap(map.id);
      if (isEditMode) {
        selectMapInEditor(map.id);
      }
    };
    mapsList.appendChild(li);
  });
}

// ===== РЕДАКТОР: СПИСОК ПРОВИНЦИЙ =====
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
    li.style.borderLeft = `3px solid ${p.k ? '#FF0000' : MARKER_COLOR}`;
    li.style.paddingLeft = '8px';
    
    const emoji = document.createElement('span');
    emoji.className = 'prov-emoji';
    emoji.textContent = p.emoji || '';
    emoji.style.fontSize = '16px';
    emoji.style.width = '24px';
    emoji.style.textAlign = 'center';
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    name.textContent = p.name + (p.k ? ' 🔑' : '');
    if (p.k) {
      name.style.color = '#FF4444';
    }
    
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
      updateView();
    };
    
    provList.appendChild(li);
  });
  
  provinceCountSmall.textContent = map.provinces.length;
}

// ===== РЕДАКТОР: СОХРАНЕНИЕ ПРОВИНЦИИ =====
function saveProvince() {
  const map = getMapById(data, currentMapId);
  if (!map) {
    alert('❌ Сначала выберите или создайте карту');
    return;
  }
  
  const name = provName.value.trim();
  const emoji = provEmoji.value || '';
  const x = parseInt(provX.value);
  const y = parseInt(provY.value);
  const k = document.getElementById('provK').checked;
  
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
        k: k || undefined
      };
    }
    editingProvince = null;
    cancelProvinceEdit.style.display = 'none';
    document.querySelector('#provinceForm .btn-primary').textContent = '➕ Добавить';
    tempX = null;
    tempY = null;
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
      k: k || undefined
    };
    if (emoji) {
      newProvince.emoji = emoji;
    }
    map.provinces.push(newProvince);
  }
  
  saveMapsData(data);
  renderProvinceList();
  updateView();
  resetProvinceForm();
  createTabs(true);
}

// ===== РЕДАКТОР: УДАЛЕНИЕ ПРОВИНЦИИ =====
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
  updateView();
  createTabs(true);
}

// ===== РЕДАКТОР: РЕДАКТИРОВАНИЕ ПРОВИНЦИИ =====
function editProvince(province) {
  editingProvince = province;
  provName.value = province.name;
  provEmoji.value = province.emoji || '';
  provX.value = province.x;
  provY.value = province.y;
  document.getElementById('provK').checked = province.k === true;
  tempX = province.x;
  tempY = province.y;
  
  cancelProvinceEdit.style.display = 'block';
  document.querySelector('#provinceForm .btn-primary').textContent = '💾 Обновить';
  
  if (editStatus) {
    editStatus.textContent = `✏️ Редактирование: ${province.name} — кликните на карте, чтобы переместить`;
  }
  renderHighlights();
}

// ===== РЕДАКТОР: СБРОС ФОРМЫ =====
function resetProvinceForm() {
  provinceForm.reset();
  document.getElementById('provK').checked = false;
  provX.value = '';
  provY.value = '';
  tempX = null;
  tempY = null;
  editingProvince = null;
  cancelProvinceEdit.style.display = 'none';
  document.querySelector('#provinceForm .btn-primary').textContent = '➕ Добавить';
  if (editStatus) {
    editStatus.textContent = 'Режим: добавление';
  }
  renderHighlights();
}

// ===== РЕДАКТОР: КЛИК ПО КАРТЕ =====
function onCanvasClick(e) {
  if (!isEditMode) return;
  
  const { mapX, mapY } = getMapCoordsFromEvent(e);
  
  const map = getMapById(data, currentMapId);
  if (!map) return;
  
  // ===== ЕСЛИ РЕДАКТИРУЕМ ПРОВИНЦИЮ =====
  if (editingProvince) {
    const found = map.provinces.find(p => {
      if (p.id === editingProvince.id) return false;
      const dx = mapX - p.x;
      const dy = mapY - p.y;
      return Math.sqrt(dx*dx + dy*dy) <= 30;
    });
    if (found) {
      alert(`❌ Это место занято провинцией "${found.name}"`);
      return;
    }
    
    editingProvince.x = Math.round(mapX);
    editingProvince.y = Math.round(mapY);
    provX.value = editingProvince.x;
    provY.value = editingProvince.y;
    tempX = editingProvince.x;
    tempY = editingProvince.y;
    
    const index = map.provinces.findIndex(p => p.id === editingProvince.id);
    if (index !== -1) {
      map.provinces[index] = { ...editingProvince };
      saveMapsData(data);
    }
    
    renderHighlights();
    renderProvinceList();
    if (editStatus) {
      editStatus.textContent = `📍 Провинция перемещена в (${editingProvince.x}, ${editingProvince.y})`;
    }
    return;
  }
  
  // ===== НОВАЯ ПРОВИНЦИЯ =====
  const found = map.provinces.find(p => {
    const dx = mapX - p.x;
    const dy = mapY - p.y;
    return Math.sqrt(dx*dx + dy*dy) <= 30;
  });
  if (found) {
    selectedProvince = found;
    updateView();
    renderProvinceList();
    return;
  }
  
  tempX = Math.round(mapX);
  tempY = Math.round(mapY);
  provX.value = tempX;
  provY.value = tempY;
  
  renderHighlights();
  provName.focus();
}

// ===== ПОЛУЧЕНИЕ КООРДИНАТ =====
function getMapCoordsFromEvent(e) {
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  const imgX = e.clientX - imgRect.left;
  const imgY = e.clientY - imgRect.top;
  
  const scaleX = mapImg.naturalWidth / imgRect.width;
  const scaleY = mapImg.naturalHeight / imgRect.height;
  
  const mapX = (imgX - panX / zoom) * scaleX;
  const mapY = (imgY - panY / zoom) * scaleY;
  
  return { mapX, mapY };
}

// ===== CANVAS =====
function setupCanvas() {
  const rect = mapContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}

// ===== ТРАНСФОРМАЦИЯ =====
function applyTransform() {
  mapImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  mapImg.style.transformOrigin = 'center center';
  updateZoomInfo();
}

function resetTransform() {
  zoom = 1;
  panX = 0;
  panY = 0;
  applyTransform();
}

function updateZoomInfo() {
  const percent = Math.round(zoom * 100);
  zoomInfo.textContent = `${percent}%`;
  zoomInfo.classList.add('visible');
  
  clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => {
    zoomInfo.classList.remove('visible');
  }, 1500);
}

function hideZoomInfo() {
  zoomInfo.classList.remove('visible');
}

// ===== ПЕРЕКЛЮЧЕНИЕ РЕЖИМА =====
function toggleMode() {
  isEditMode = !isEditMode;
  
  viewMode.style.display = isEditMode ? 'none' : 'flex';
  editMode.style.display = isEditMode ? 'flex' : 'none';
  toggleModeBtn.textContent = isEditMode ? '👁️ Режим просмотра' : '✏️ Режим редактирования';
  toggleModeBtn.className = isEditMode ? 'btn' : 'btn btn-primary';
  
  mapContainer.style.cursor = isEditMode ? 'crosshair' : 'grab';
  mapImg.style.cursor = isEditMode ? 'crosshair' : 'grab';
  
  if (isEditMode) {
    renderMapsList();
    selectMapInEditor(currentMapId);
    renderProvinceList();
    resetProvinceForm();
  } else {
    selectedProvince = null;
    tempX = null;
    tempY = null;
    editingProvince = null;
    updateView();
  }
}

// ===== СОБЫТИЯ =====
function setupEvents() {
  // Переключение режима
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', toggleMode);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault();
      if (isEditMode) return;
        if (toggleModeBtn) {
        toggleModeBtn.style.display = '';
        toggleMode();
        setTimeout(() => {
          toggleModeBtn.style.display = 'none';
        }, 2000);
      }
    }
  });
  
  // Поиск
  searchInput.addEventListener('input', () => {
    if (isEditMode) return;
    const query = searchInput.value.trim();
    if (query) {
      handleSearch(query);
    } else {
      const map = getMapById(data, currentMapId);
      if (map) {
        selectedProvince = null;
        updateView();
      }
    }
  });
  
  // Фильтры эмодзи
  document.querySelectorAll('.emoji-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isEditMode) return;
      const emoji = btn.dataset.emoji;
      
      document.querySelectorAll('.emoji-filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.emoji === emoji);
      });
      
      emojiFilter = emoji;
      const map = getMapById(data, currentMapId);
      if (map) {
        updateView();
      }
    });
  });
  
  // ===== КНОПКА K =====
  const kFilterBtn = document.getElementById('kFilterBtn');
  if (kFilterBtn) {
    kFilterBtn.addEventListener('click', () => {
      if (isEditMode) return;
      kFilter = !kFilter;
      kFilterBtn.classList.toggle('active', kFilter);
      const map = getMapById(data, currentMapId);
      if (map) {
        updateView();
      }
    });
  }
  
  // ===== КОЛЕСИКО (ТОЛЬКО В ПРОСМОТРЕ) =====
  mapContainer.addEventListener('wheel', (e) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    zoom = newZoom;
    applyTransform();
    renderHighlights();
  }, { passive: false });
  
  // ===== ПЕРЕТАСКИВАНИЕ (ТОЛЬКО В ПРОСМОТРЕ) =====
  mapContainer.addEventListener('mousedown', (e) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    panStartX = panX;
    panStartY = panY;
    mapContainer.style.cursor = 'grabbing';
    mapImg.style.cursor = 'grabbing';
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    panX = panStartX + dx;
    panY = panStartY + dy;
    applyTransform();
    renderHighlights();
  });
  
  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      mapContainer.style.cursor = isEditMode ? 'crosshair' : 'grab';
      mapImg.style.cursor = isEditMode ? 'crosshair' : 'grab';
    }
  });
  
  // ===== КЛИК ПО КАРТЕ (для установки точек в редакторе) =====
  canvas.addEventListener('click', (e) => {
    if (!isEditMode) return;
    onCanvasClick(e);
  });
  
  // КЛАВИШИ
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === '0') {
      resetTransform();
    }
  });
  
  // РЕДАКТОР: Добавление карты
  addMapBtn.addEventListener('click', () => {
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
    switchMap(newId);
    renderMapsList();
    selectMapInEditor(newId);
    createTabs();
  });
  
  // РЕДАКТОР: Сохранение карты
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
    selectMapInEditor(map.id);
    createTabs(true);
    alert('✅ Карта сохранена!');
  });
  
  // РЕДАКТОР: Удаление карты
  deleteMapBtn.addEventListener('click', () => {
    if (!currentMapId) return;
    const map = getMapById(data, currentMapId);
    if (!map) return;
    if (confirm(`Удалить карту "${map.name}" и все её провинции?`)) {
      data.maps = data.maps.filter(m => m.id !== currentMapId);
      saveMapsData(data);
      currentMapId = null;
      renderMapsList();
      if (data.maps.length > 0) {
        switchMap(data.maps[0].id);
        selectMapInEditor(data.maps[0].id);
      }
      createTabs();
    }
  });
  
  // РЕДАКТОР: Форма провинции
  provinceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProvince();
  });
  
  provinceForm.addEventListener('reset', resetProvinceForm);
  cancelProvinceEdit.addEventListener('click', resetProvinceForm);
  provSearch.addEventListener('input', renderProvinceList);
  
  // РЕДАКТОР: Сохранение всех данных
  saveDataBtn.addEventListener('click', () => {
    saveMapsData(data);
    alert('✅ Все данные сохранены!');
  });
  
  // РЕДАКТОР: Экспорт
  exportBtn.addEventListener('click', () => {
    exportMapsData(data);
  });
  
  // РЕДАКТОР: Импорт
  importBtn.addEventListener('click', () => {
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
            switchMap(data.maps[0].id);
            selectMapInEditor(data.maps[0].id);
          }
          createTabs();
          alert('✅ Данные импортированы!');
        } catch (err) {
          alert('❌ Ошибка: ' + err.message);
        }
      }
    };
    input.click();
  });
  
  // Сброс масштаба
  document.querySelectorAll('#resetView, #resetViewFooter').forEach(btn => {
    if (btn) {
      btn.addEventListener('click', resetTransform);
    }
  });
}

// ===== АНИМАЦИЯ =====
function animate() {
  if (mapImg.complete && mapImg.naturalWidth) {
    renderHighlights();
  }
  requestAnimationFrame(animate);
}

// ===== RESIZE =====
window.addEventListener('resize', () => {
  setupCanvas();
  if (currentMapId) {
    renderHighlights();
  }
});

// ===== ЗАПУСК =====
window.addEventListener('load', init);