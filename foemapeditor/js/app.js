// ============================================
//  app.js — Основная логика справочника
// ============================================

import { 
  loadProvinces, 
  findProvinceAt, 
  exportProvinces,
  importProvinces 
} from './provinces.js';

// ===== Состояние =====
let provinces = [];
let selectedProvince = null;
let filteredProvinces = [];
let currentZoom = 1;
let panX = 0, panY = 0;
let animationId = null;

// ===== DOM элементы =====
const mapContainer = document.querySelector('.map-container');
const mapImg = document.getElementById('mainMap');
const canvas = document.getElementById('highlightCanvas');
const ctx = canvas.getContext('2d');
const list = document.getElementById('provinceList');
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('searchCount');
const tooltip = document.getElementById('tooltip');
const colorFilters = document.getElementById('colorFilters');
const provinceCount = document.getElementById('provinceCount');

// ===== Инициализация =====
function init() {
  provinces = loadProvinces();
  filteredProvinces = [...provinces];
  
  // Ждём загрузки изображения
  if (mapImg.complete) {
    setupCanvas();
  } else {
    mapImg.onload = setupCanvas;
  }
  
  setupFilters();
  renderList();
  renderHighlights();
  updateCounts();
  
  // События
  searchInput.addEventListener('input', onSearch);
  mapImg.addEventListener('click', onMapClick);
  mapImg.addEventListener('mousemove', onMapMove);
  mapImg.addEventListener('mouseleave', hideTooltip);
  
  document.getElementById('resetView').addEventListener('click', resetView);
  document.getElementById('exportData').addEventListener('click', () => exportProvinces(provinces));
  document.getElementById('importData').addEventListener('click', importData);
  
  document.getElementById('zoomIn').addEventListener('click', () => zoom(0.1));
  document.getElementById('zoomOut').addEventListener('click', () => zoom(-0.1));
  document.getElementById('fitView').addEventListener('click', resetView);
  
  // Запускаем анимацию
  animate();
}

// ===== Настройка Canvas =====
function setupCanvas() {
  const rect = mapContainer.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  renderHighlights();
}

// ===== Получение координат на карте =====
function getMapCoordsFromEvent(e) {
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  // Координаты клика относительно canvas
  const canvasX = e.clientX - containerRect.left;
  const canvasY = e.clientY - containerRect.top;
  
  // Координаты клика относительно изображения
  const imgX = e.clientX - imgRect.left;
  const imgY = e.clientY - imgRect.top;
  
  // Размеры изображения на экране
  const displayWidth = imgRect.width;
  const displayHeight = imgRect.height;
  
  // Оригинальные размеры
  const naturalWidth = mapImg.naturalWidth;
  const naturalHeight = mapImg.naturalHeight;
  
  // Коэффициенты масштабирования
  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;
  
  // Координаты на оригинальном изображении
  const mapX = imgX * scaleX;
  const mapY = imgY * scaleY;
  
  return { mapX, mapY, canvasX, canvasY };
}

// ===== Отображение подсветки =====
function renderHighlights() {
  if (!mapImg.naturalWidth) return;
  
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = mapImg.getBoundingClientRect();
  
  // Отступы изображения внутри контейнера
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;
  
  // Размеры изображения на экране
  const displayWidth = imgRect.width;
  const displayHeight = imgRect.height;
  
  // Коэффициенты масштабирования
  const scaleX = displayWidth / mapImg.naturalWidth;
  const scaleY = displayHeight / mapImg.naturalHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Рисуем все провинции (полупрозрачные)
  filteredProvinces.forEach(p => {
    if (p.id === selectedProvince?.id) return;
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    const r = (p.radius || 30) * scaleX;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + '33';
    ctx.fill();
    ctx.strokeStyle = p.color + '88';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  
  // Выделенная провинция
  if (selectedProvince) {
    const p = selectedProvince;
    const x = offsetX + p.x * scaleX;
    const y = offsetY + p.y * scaleY;
    const r = (p.radius || 30) * scaleX;
    
    // Внешнее свечение
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Круг
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + '44';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFD700';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Пульсирующий внутренний круг
    const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 400);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.3 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
    ctx.fill();
  }
}

// ===== Подсветка провинции =====
function highlightProvince(province) {
  selectedProvince = province;
  
  document.querySelectorAll('#provinceList li').forEach(li => {
    li.classList.toggle('active', li.dataset.id === String(province.id));
  });
  
  renderHighlights();
  mapImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== Рендер списка =====
function renderList() {
  list.innerHTML = '';
  
  filteredProvinces.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    
    const dot = document.createElement('span');
    dot.className = 'color-dot';
    dot.style.background = p.color;
    
    const name = document.createElement('span');
    name.className = 'prov-name';
    name.textContent = p.name;
    
    const coords = document.createElement('span');
    coords.className = 'prov-coords';
    coords.textContent = `${p.x}, ${p.y}`;
    
    li.appendChild(dot);
    li.appendChild(name);
    li.appendChild(coords);
    li.onclick = () => highlightProvince(p);
    
    list.appendChild(li);
  });
}

// ===== Поиск =====
function onSearch() {
  const term = searchInput.value.toLowerCase().trim();
  
  if (!term) {
    filteredProvinces = [...provinces];
  } else {
    filteredProvinces = provinces.filter(p => 
      p.name.toLowerCase().includes(term)
    );
  }
  
  renderList();
  renderHighlights();
  updateCounts();
}

// ===== Фильтры по цвету =====
function setupFilters() {
  const colors = [...new Set(provinces.map(p => p.color))];
  
  colors.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'color-filter-btn';
    btn.style.background = color;
    btn.title = 'Фильтр по цвету';
    btn.onclick = () => {
      document.querySelectorAll('.color-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.toggle('active');
      
      const active = btn.classList.contains('active');
      filteredProvinces = active 
        ? provinces.filter(p => p.color === color)
        : [...provinces];
      
      searchInput.value = '';
      renderList();
      renderHighlights();
      updateCounts();
    };
    colorFilters.appendChild(btn);
  });
}

// ===== Клик по карте =====
function onMapClick(e) {
  const { mapX, mapY } = getMapCoordsFromEvent(e);
  
  const province = findProvinceAt(provinces, mapX, mapY);
  if (province) {
    highlightProvince(province);
  }
}

// ===== Ховер =====
function onMapMove(e) {
  const { mapX, mapY, canvasX, canvasY } = getMapCoordsFromEvent(e);
  
  const province = findProvinceAt(provinces, mapX, mapY);
  
  if (province) {
    tooltip.textContent = `${province.name} (${Math.round(mapX)}, ${Math.round(mapY)})`;
    tooltip.style.left = (canvasX + 12) + 'px';
    tooltip.style.top = (canvasY - 10) + 'px';
    tooltip.classList.remove('hidden');
    mapImg.style.cursor = 'pointer';
  } else {
    hideTooltip();
    mapImg.style.cursor = 'crosshair';
  }
}

function hideTooltip() {
  tooltip.classList.add('hidden');
}

// ===== Zoom =====
function zoom(delta) {
  currentZoom = Math.max(0.5, Math.min(2, currentZoom + delta));
  mapImg.style.transform = `scale(${currentZoom})`;
  mapImg.style.transformOrigin = 'center center';
}

function resetView() {
  currentZoom = 1;
  panX = 0;
  panY = 0;
  mapImg.style.transform = `scale(1)`;
  mapImg.style.transformOrigin = 'center center';
}

// ===== Обновление счётчиков =====
function updateCounts() {
  searchCount.textContent = filteredProvinces.length;
  provinceCount.textContent = `${provinces.length} провинций`;
}

// ===== Импорт данных =====
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      importProvinces(file)
        .then(data => {
          provinces = data;
          filteredProvinces = [...data];
          renderList();
          renderHighlights();
          updateCounts();
          alert('✅ Данные успешно импортированы!');
        })
        .catch(err => alert('❌ Ошибка импорта: ' + err.message));
    }
  };
  input.click();
}

// ===== Анимация =====
function animate() {
  renderHighlights();
  animationId = requestAnimationFrame(animate);
}

// ===== Запуск =====
window.addEventListener('load', init);

window.addEventListener('resize', () => {
  setupCanvas();
});