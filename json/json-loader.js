// js/json-loader.js - универсальный загрузчик JSON для всех страниц
(function() {
    'use strict';
    
    // === КОНФИГУРАЦИЯ ===
    const DB_NAME = 'FoE_JSON_Cache';
    const DB_VERSION = 1;
    const STORE_NAME = 'jsonCache';
    
    let db = null;
    let currentJsonUrl = '/building.json';
    let isUsingLocalJson = false;
    let localJsonInfo = null;
    
    // Доступные источники
    const SOURCES = {
        'ru': { url: '/building.json', name: 'RU', type: 'server' },
        'beta': { url: '/buildingzz.json', name: 'BETA', type: 'server' },
        'r2': { url: 'https://pub-566ab475475d4d62a392e476f515f46c.r2.dev/building.json', name: 'R2', type: 'server' },
        'local': { url: null, name: 'Локальный', type: 'local' }
    };
    
    // === РАБОТА С INDEXEDDB ===
    function openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }
    
    async function saveToCache(jsonData, sourceUrl) {
        try {
            if (!db) await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const record = {
                    id: 'cachedJson',
                    data: jsonData,
                    source: sourceUrl,
                    timestamp: Date.now()
                };
                const request = store.put(record);
                request.onsuccess = () => resolve(true);
                request.onerror = (e) => reject(e);
            });
        } catch (error) {
            return false;
        }
    }
    
    async function loadFromCache() {
        try {
            if (!db) await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get('cachedJson');
                request.onsuccess = () => {
                    const record = request.result;
                    if (record && record.data) {
                        isUsingLocalJson = true;
                        localJsonInfo = { source: record.source };
                        resolve(record.data);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = (e) => reject(e);
            });
        } catch (error) {
            return null;
        }
    }
    
    async function clearCache() {
        try {
            if (!db) await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete('cachedJson');
                request.onsuccess = () => {
                    isUsingLocalJson = false;
                    localJsonInfo = null;
                    resolve(true);
                };
                request.onerror = (e) => reject(e);
            });
        } catch (error) {
            return false;
        }
    }
    
    // === ЗАГРУЗКА ЛОКАЛЬНОГО ФАЙЛА ===
    async function loadLocalFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (!file) {
                    reject('Файл не выбран');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        await saveToCache(jsonData, file.name);
                        resolve({
                            data: jsonData,
                            source: file.name,
                            isLocal: true
                        });
                    } catch (error) {
                        reject('Ошибка парсинга JSON: ' + error.message);
                    }
                };
                reader.onerror = () => reject('Ошибка чтения файла');
                reader.readAsText(file);
            };
            input.click();
        });
    }
    
    // === ЗАГРУЗКА С ПРОГРЕССОМ ===
    async function fetchWithProgress(url, onProgress) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength) : null;
        
        const reader = response.body.getReader();
        let received = 0;
        const chunks = [];
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            received += value.length;
            
            if (total && onProgress) {
                const percent = Math.round(received / total * 100);
                onProgress(percent, received, total);
            }
        }
        
        const chunksAll = new Uint8Array(received);
        let position = 0;
        for (const chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }
        
        const decoder = new TextDecoder();
        const jsonText = decoder.decode(chunksAll);
        return JSON.parse(jsonText);
    }
    
    // === ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ ===
    async function loadJson(options = {}) {
        const {
            url = currentJsonUrl,
            onProgress = null,
            preferCache = false
        } = options;
        
        // Если предпочитаем кеш и он есть
        if (preferCache && isUsingLocalJson) {
            const cached = await loadFromCache();
            if (cached) return cached;
        }
        
        // Загружаем с сервера
        const data = await fetchWithProgress(url, onProgress);
        
        // Сохраняем в кеш если это не локальный режим
        if (!isUsingLocalJson) {
            await saveToCache(data, url);
        }
        
        return data;
    }
    
    // === ПЕРЕКЛЮЧЕНИЕ ИСТОЧНИКА ===
    async function switchSource(sourceId, onProgress) {
        const source = SOURCES[sourceId];
        if (!source) throw new Error(`Неизвестный источник: ${sourceId}`);
        
        if (source.type === 'local') {
            // Загрузка локального файла
            const result = await loadLocalFile();
            if (result) {
                isUsingLocalJson = true;
                localJsonInfo = { source: result.source };
                currentJsonUrl = 'local';
                return result.data;
            }
        } else {
            // Загрузка с сервера
            isUsingLocalJson = false;
            currentJsonUrl = source.url;
            const data = await fetchWithProgress(source.url, onProgress);
            await saveToCache(data, source.url);
            return data;
        }
    }
    
    // === СБРОС К СЕРВЕРНОЙ ВЕРСИИ ===
    async function resetToServer(sourceId = 'ru', onProgress) {
        await clearCache();
        isUsingLocalJson = false;
        localJsonInfo = null;
        
        const source = SOURCES[sourceId];
        if (source && source.type === 'server') {
            currentJsonUrl = source.url;
            const data = await fetchWithProgress(source.url, onProgress);
            await saveToCache(data, source.url);
            return data;
        }
        return null;
    }
    
    // === ПОЛУЧЕНИЕ СТАТУСА ===
    function getStatus() {
        if (isUsingLocalJson) {
            return {
                type: 'local',
                source: localJsonInfo?.source || 'локальный файл'
            };
        }
        
        for (const [id, source] of Object.entries(SOURCES)) {
            if (source.url === currentJsonUrl && source.type === 'server') {
                return {
                    type: 'server',
                    source: source.name,
                    id: id,
                    url: currentJsonUrl
                };
            }
        }
        return { type: 'server', source: 'неизвестный', url: currentJsonUrl };
    }
    
    // === СОЗДАНИЕ UI КОМПОНЕНТА ===
    function createSelector(containerId, onSwitchCallback) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        const html = `
            <div class="json-selector" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <label style="color: #888; font-size: 12px;">📁 БАЗА ДАННЫХ:</label>
                <select id="globalJsonSelect" style="background: #333; color: #fff; border: 1px solid #4ecdc4; padding: 5px 10px; border-radius: 5px;">
                    <option value="ru">RU</option>
                    <option value="beta">BETA</option>
                    <option value="r2">TEST (R2)</option>
                </select>
                <button id="globalLoadLocalBtn" style="background: #4ecdc4; color: #1a1a1d; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;">📂 Локальный JSON</button>
                <button id="globalResetLocalBtn" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer; display: none;">🔄 Сбросить</button>
                <div id="globalJsonStatus" style="font-size: 11px; color: #4ecdc4;">🌐 Серверная версия</div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', html);
        
        const select = document.getElementById('globalJsonSelect');
        const loadLocalBtn = document.getElementById('globalLoadLocalBtn');
        const resetLocalBtn = document.getElementById('globalResetLocalBtn');
        const statusDiv = document.getElementById('globalJsonStatus');
        
        // Обновление статуса
        const updateStatus = () => {
            const status = getStatus();
            if (status.type === 'local') {
                statusDiv.innerHTML = `📁 Локальный: ${status.source}`;
                statusDiv.style.color = '#4ecdc4';
                resetLocalBtn.style.display = 'inline-block';
                if (select) select.value = 'ru';
            } else {
                statusDiv.innerHTML = `🌐 ${status.source}`;
                statusDiv.style.color = '#888';
                resetLocalBtn.style.display = 'none';
                if (select && status.id) select.value = status.id;
            }
        };
        
        // Обработчики
        if (select) {
            select.addEventListener('change', async (e) => {
                if (confirm('Переключение базы данных приведет к перезагрузке. Продолжить?')) {
                    const data = await switchSource(e.target.value, (percent, received, total) => {
                        if (onSwitchCallback) onSwitchCallback(percent, received, total);
                    });
                    if (onSwitchCallback) onSwitchCallback('complete', null, null, data);
                    updateStatus();
                } else {
                    select.value = getStatus().id || 'ru';
                }
            });
        }
        
        if (loadLocalBtn) {
            loadLocalBtn.addEventListener('click', async () => {
                const data = await switchSource('local', (percent, received, total) => {
                    if (onSwitchCallback) onSwitchCallback(percent, received, total);
                });
                if (onSwitchCallback) onSwitchCallback('complete', null, null, data);
                updateStatus();
            });
        }
        
        if (resetLocalBtn) {
            resetLocalBtn.addEventListener('click', async () => {
                const data = await resetToServer('ru', (percent, received, total) => {
                    if (onSwitchCallback) onSwitchCallback(percent, received, total);
                });
                if (onSwitchCallback) onSwitchCallback('complete', null, null, data);
                updateStatus();
            });
        }
        
        // Проверяем сохранённый кеш
        openDatabase().then(async () => {
            const cached = await loadFromCache();
            if (cached) {
                updateStatus();
            }
        }).catch(console.log);
        
        return {
            loadJson: (options) => loadJson(options),
            getStatus: getStatus,
            updateStatus: updateStatus
        };
    }
    
    // Экспортируем API
    window.JSONLoader = {
        loadJson,
        switchSource,
        resetToServer,
        getStatus,
        createSelector,
        openDatabase,
        loadFromCache,
        clearCache
    };
    
    console.log('✅ json-loader.js загружен');
})();