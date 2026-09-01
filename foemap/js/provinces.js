// ============================================
//  provinces.js — Управление данными карт
// ============================================

const MAPS_KEY = 'foemap_maps_data';

// ===== Загрузка данных =====
export async function loadMapsData() {
  console.log('🔄 Загрузка данных...');
  
  try {
    // Проверяем localStorage
    const cached = localStorage.getItem(MAPS_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.maps && parsed.maps.length > 0) {
          console.log('✅ Данные загружены из localStorage:', parsed.maps.length, 'карт');
          return parsed;
        }
      } catch (e) {
        console.warn('Ошибка парсинга localStorage');
      }
    }
  } catch (e) {
    console.warn('Ошибка доступа к localStorage');
  }

  // Загружаем из JSON файла
  try {
    console.log('📂 Загрузка из data/maps.json...');
    const response = await fetch('data/maps.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Данные загружены из файла:', data.maps ? data.maps.length : 0, 'карт');
    
    if (!data.maps || data.maps.length === 0) {
      throw new Error('В файле нет карт');
    }
    
    // Сохраняем в localStorage
    try {
      localStorage.setItem(MAPS_KEY, JSON.stringify(data));
      console.log('💾 Данные сохранены в localStorage');
    } catch (e) {
      console.warn('Не удалось сохранить в localStorage');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error);
    
    // Возвращаем тестовые данные
    console.log('📦 Используем тестовые данные');
    return {
      maps: [
        {
          id: 'test',
          name: 'Тестовая карта',
          era: 'Тест',
          image: 'data/Map_old_ages_BG.webp',
          description: 'Проверочная карта',
          provinces: [
            { id: 1, name: "Тестовая провинция", color: "#FF4444", x: 400, y: 300, radius: 30 }
          ]
        }
      ]
    };
  }
}

// ===== Сохранение всех данных =====
export function saveMapsData(data) {
  try {
    localStorage.setItem(MAPS_KEY, JSON.stringify(data));
    console.log('💾 Данные сохранены');
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
}

// ===== Поиск провинции по всем картам =====
export function searchProvince(data, query) {
  const results = [];
  const term = query.toLowerCase().trim();
  
  if (!term || !data.maps) return results;
  
  data.maps.forEach(map => {
    if (!map.provinces) return;
    map.provinces.forEach(province => {
      if (province.name.toLowerCase().includes(term)) {
        results.push({
          ...province,
          mapId: map.id,
          mapName: map.name,
          mapEra: map.era
        });
      }
    });
  });
  
  return results;
}

// ===== Получение карты по ID =====
export function getMapById(data, mapId) {
  if (!data.maps) return null;
  return data.maps.find(m => m.id === mapId);
}

// ===== Получение провинции по ID на карте =====
export function getProvinceById(data, mapId, provinceId) {
  const map = getMapById(data, mapId);
  if (!map || !map.provinces) return null;
  return map.provinces.find(p => p.id === provinceId);
}

// ===== Экспорт данных =====
export function exportMapsData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maps_data_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== Импорт данных =====
export function importMapsData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && data.maps && Array.isArray(data.maps) && data.maps.length > 0) {
          const valid = data.maps.every(map => 
            map.id && map.name && map.image && Array.isArray(map.provinces)
          );
          if (valid) {
            saveMapsData(data);
            resolve(data);
          } else {
            reject(new Error('Неверный формат данных'));
          }
        } else {
          reject(new Error('Пустой или некорректный файл'));
        }
      } catch (err) {
        reject(new Error('Ошибка парсинга JSON: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
}