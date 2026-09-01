// ============================================
//  app.js — Основная логика справочника (ПРОСМОТР)
// ============================================

import { 
  loadMapsData, 
  searchProvince, 
  getMapById
} from './provinces.js';

console.log('🚀 App.js загружен (просмотр)');

// ===== Состояние =====
let data = { maps: [] };
let currentMapId = null;
let selectedProvince = null;
let filteredProvinces = [];
let emojiFilter = 'all'; // 'all', '💎', '💢'
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
const GLOW_COLOR = '#FFD700';

// ===== КОРРЕКЦИЯ ОТКЛЮЧЕНА =====
// const CORRECTION_X = 0;
// const CORRECTION_Y = 0;

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
const mapName = document.getElementById('mapName');
const mapDescription = document.getElementById('mapDescription');
const mapContainer = document.querySelector('.map-container');
const zoomInfo = document.getElementById('zoomInfo');

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
    setupTabDrag(); // ← ДОБАВЛЯЕМ ЭТУ СТРОКУ
    
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
    // Убираем эру и счётчик, оставляем только название
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

// ===== Переключение карты =====
function switchMap(mapId) {
  console.log('🔄 Переключение на карту ID:', mapId);
  
  const map = getMapById(data, mapId);
  if (!map) {
    console.warn('❌ Карта не найдена:', mapId);
    return;
  }
  
  console.log('🗺️ Карта найдена:', map.name);
  console.log('📸 Путь к картинке:', map.image);
  
  currentMapId = mapId;
  selectedProvince = null;
  emojiFilter = 'all';
  
  // Обновляем кнопки фильтров
  document.querySelectorAll('.emoji-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.emoji === 'all');
  });
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mapId === mapId);
  });
  
  loadingMessage.style.display = 'flex';
  loadingMessage.innerHTML = `
    <span>🔄</span>
    <p>Загрузка карты "${map.name}"...</p>
  `;
  mapImg.style.display = 'none';
  mapImg.classList.remove('visible');
  
  mapImg.src = map.image;
  mapImg.alt = map.name;
  
  mapImg.onload = () => {
    console.log('✅ Картинка загружена:', map.image);
    console.log('📐 Размеры:', mapImg.naturalWidth, 'x', mapImg.naturalHeight);
    
    mapImg.style.display = 'block';
    mapImg.classList.add('visible');
    loadingMessage.style.display = 'none';
    
    resetTransform();
    setupCanvas();
    updateProvinceList(map);
    
    mapName.textContent = map.name;
    mapDescription.textContent = map.description || map.era || '';
    hideZoomInfo();
  };
  
  mapImg.onerror = (e) => {
    console.error('❌ Ошибка загрузки картинки:', map.image);
    console.error('❌ Ошибка:', e);
    loadingMessage.innerHTML = `
      <span>❌</span>
      <p>Не удалось загрузить картинку</p>
      <p style="font-size:12px;color:#4a4a6a;">${map.image}</p>
      <p style="font-size:12px;color:#4a4a6a;">Проверьте путь и наличие файла</p>
    `;
    loadingMessage.style.display = 'flex';
  };
}

// ===== Трансформация карты =====
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

// ===== Настройка Canvas =====
function setupCanvas() {
  const rect = mapContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  console.log('📐 Canvas размер:', rect.width, 'x', rect.height);
}

// ===== Получение координат клика =====
function getMapCoordsFromEvent(e) {
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  const canvasX = e.clientX - containerRect.left;
  const canvasY = e.clientY - containerRect.top;
  
  const imgX = e.clientX - imgRect.left;
  const imgY = e.clientY - imgRect.top;
  
  const displayWidth = imgRect.width;
  const displayHeight = imgRect.height;
  
  const naturalWidth = mapImg.naturalWidth;
  const naturalHeight = mapImg.naturalHeight;
  
  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;
  
  const mapX = (imgX - panX / zoom) * scaleX;
  const mapY = (imgY - panY / zoom) * scaleY;
  
  return { 
    mapX: mapX, 
    mapY: mapY, 
    canvasX: canvasX, 
    canvasY: canvasY,
    imgX: imgX,
    imgY: imgY
  };
}

// ===== Функция получения отфильтрованных провинций =====
function getFilteredProvinces(map) {
  let result = map.provinces || [];
  
  // Фильтр по эмодзи
  if (emojiFilter !== 'all') {
    result = result.filter(p => p.emoji === emojiFilter);
  }
  
  // Фильтр по поиску (если есть)
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
  }
  
  return result;
}

// ===== Обновление списка с учётом фильтров =====
function updateProvinceList(map) {
  if (!map) return;
  
  const listProvinces = getFilteredProvinces(map);
  filteredProvinces = listProvinces;
  
  renderList(map, listProvinces);
  renderHighlights();
  updateCounts(map, listProvinces);
}

// ===== Отображение провинций (БЕЗ КОРРЕКЦИИ) =====
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
  
  // Сначала все НЕВЫБРАННЫЕ (маленькие точки)
  provinces.forEach(p => {
    if (selectedProvince && p.id === selectedProvince.id) return;
    
    // БЕЗ КОРРЕКЦИИ
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    const r = MARKER_RADIUS_SMALL * scaleX;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = MARKER_COLOR;
    ctx.shadowColor = MARKER_COLOR;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(p.name, x, y - r - 4);
    ctx.shadowBlur = 0;
  });
  
  // ВЫБРАННАЯ провинция (большой мигающий круг)
  if (selectedProvince) {
    const p = selectedProvince;
    // БЕЗ КОРРЕКЦИИ
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

// ===== Рендер списка (с эмодзи, если есть) =====
function renderList(map, provincesToShow) {
  if (!map || !map.provinces) return;
  
  const listProvinces = provincesToShow || getFilteredProvinces(map);
  
  list.innerHTML = '';
  listProvinces.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    
    const isSelected = selectedProvince && p.id === selectedProvince.id;
    
    const emoji = document.createElement('span');
    emoji.className = 'prov-emoji';
    emoji.textContent = p.emoji || '';
    emoji.style.fontSize = isSelected ? '20px' : '16px';
    emoji.style.marginRight = '8px';
    emoji.style.width = '28px';
    emoji.style.display = 'inline-block';
    emoji.style.textAlign = 'center';
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    if (isSelected) {
      name.style.fontWeight = 'bold';
      name.style.color = '#f7c948';
    }
    name.textContent = p.name;
    
    li.appendChild(emoji);
    li.appendChild(name);
    
    if (isSelected) {
      li.style.background = '#1e2a4a';
      li.style.borderLeft = '3px solid #f7c948';
    }
    
    li.onclick = () => {
      if (currentMapId !== map.id) {
        switchMap(map.id);
        setTimeout(() => {
          selectProvince(p, map);
        }, 400);
      } else {
        selectProvince(p, map);
      }
    };
    
    list.appendChild(li);
  });
}

// ===== Выбор провинции =====
function selectProvince(province, map) {
  selectedProvince = province;
  renderList(map);
  renderHighlights();
  
  const items = list.querySelectorAll('li');
  items.forEach(item => {
    if (item.dataset.id === String(province.id)) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ===== Обновление счётчиков =====
function updateCounts(map, listProvinces) {
  const count = listProvinces ? listProvinces.length : (map.provinces ? map.provinces.length : 0);
  searchCount.textContent = count;
  provinceCount.textContent = `${map.provinces ? map.provinces.length : 0} провинций на карте`;
}

// ===== Поиск по всем картам =====
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
    emoji.style.marginRight = '8px';
    emoji.style.width = '28px';
    emoji.style.display = 'inline-block';
    emoji.style.textAlign = 'center';
    
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
      const map = getMapById(data, p.mapId);
      if (map) {
        switchMap(p.mapId);
        setTimeout(() => {
          const province = map.provinces.find(pr => pr.id === p.id);
          if (province) {
            searchInput.value = '';
            filteredProvinces = [];
            selectedProvince = province;
            renderList(map);
            renderHighlights();
            updateCounts(map);
          }
        }, 400);
      }
    };
    
    list.appendChild(li);
  });
  
  searchCount.textContent = results.length;
}

// ===== Настройка событий =====
function setupEvents() {
  // Поиск
  searchInput.addEventListener('input', () => {
    const map = getMapById(data, currentMapId);
    if (map) {
      updateProvinceList(map);
    }
  });
  
  // Очистка поиска
  document.getElementById('clearSearch').addEventListener('click', () => {
    searchInput.value = '';
    const map = getMapById(data, currentMapId);
    if (map) {
      emojiFilter = 'all';
      document.querySelectorAll('.emoji-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.emoji === 'all');
      });
      updateProvinceList(map);
    }
  });
  
  // ===== КНОПКИ ФИЛЬТРА ПО ЭМОДЗИ =====
  document.querySelectorAll('.emoji-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      
      document.querySelectorAll('.emoji-filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.emoji === emoji);
      });
      
      emojiFilter = emoji;
      
      const map = getMapById(data, currentMapId);
      if (map) {
        updateProvinceList(map);
      }
    });
  });
  
  // КОЛЕСИКО МЫШИ
  mapContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    zoom = newZoom;
    applyTransform();
    renderHighlights();
  }, { passive: false });
  
  // ПЕРЕТАСКИВАНИЕ
  mapContainer.addEventListener('mousedown', (e) => {
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
      mapContainer.style.cursor = 'grab';
      mapImg.style.cursor = 'grab';
    }
  });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === '0') {
      resetTransform();
    }
  });
}

// ===== Анимация =====
function animate() {
  if (mapImg.complete && mapImg.naturalWidth) {
    renderHighlights();
  }
  requestAnimationFrame(animate);
}

// ===== Resize =====
window.addEventListener('resize', () => {
  setupCanvas();
  if (currentMapId) {
    renderHighlights();
  }
});

// ===== Запуск =====
window.addEventListener('load', init);