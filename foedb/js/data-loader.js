// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let dataLoadDate = null;
let localFileData = null;

// === ФУНКЦИЯ ОБНОВЛЕНИЯ ДАТЫ ===
function updateServerFileDate() {
    const dateElement = document.getElementById('serverFileDate');
    if (dateElement && dataLoadDate) {
        const formattedDate = dataLoadDate.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        dateElement.textContent = `📅 Дата загрузки файла: ${formattedDate}`;
        dateElement.style.color = '#ffd700';
        dateElement.style.fontSize = '11px';
        dateElement.style.textAlign = 'center';
        dateElement.style.marginBottom = '10px';
    }
}

// === ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ЗАГРУЗКИ ЛОКАЛЬНОГО ФАЙЛА ===
function initLocalFileUpload() {
    if (!document.getElementById('localFileInput')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'localFileInput';
        input.accept = '.json';
        input.style.display = 'none';

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const statusMsg = document.getElementById('statusMsg');

            try {
                statusMsg.textContent = `📂 Читаем файл: ${file.name}...`;
                statusMsg.style.color = '#ffd700';

                const text = await file.text();
                localFileData = JSON.parse(text);
                window.localFileData = localFileData; // делаем доступным глобально
                dataLoadDate = new Date(file.lastModified || Date.now());
                updateServerFileDate();

                statusMsg.textContent = `✅ Файл загружен: ${file.name}`;
                statusMsg.style.color = '#4ecdc4';

                // Показываем кнопку сброса, прячем кнопку выбора файла
                const uploadBtn = document.getElementById('uploadFileBtn');
                const serverContainer = document.getElementById('serverDataContainer');
                if (uploadBtn) uploadBtn.style.display = 'none';
                if (serverContainer) serverContainer.style.display = 'block';

                loadData();
            } catch (error) {
                statusMsg.textContent = `❌ Ошибка загрузки файла: ${error.message}`;
                statusMsg.style.color = '#ff6b6b';
                console.error('Ошибка при чтении файла:', error);
            }
        });

        document.body.appendChild(input);
    }
}

// === ФУНКЦИЯ ОТКРЫТИЯ ДИАЛОГА ВЫБОРА ФАЙЛА ===
function selectLocalFile() {
    const input = document.getElementById('localFileInput');
    if (input) {
        input.click();
    }
}

// === СБРОС (ОЧИСТКА ЛОКАЛЬНОГО ФАЙЛА) ===
function resetToServerData() {
    localFileData = null;
    window.localFileData = null;
    dataLoadDate = null;

    const uploadBtn = document.getElementById('uploadFileBtn');
    const serverContainer = document.getElementById('serverDataContainer');
    if (uploadBtn) uploadBtn.style.display = 'block';
    if (serverContainer) serverContainer.style.display = 'none';

    const serverFileDate = document.getElementById('serverFileDate');
    if (serverFileDate) serverFileDate.textContent = '';

    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = '📂 Загрузите JSON файл для начала работы';
    statusMsg.style.color = '#ffd700';

    document.getElementById('searchInput').disabled = true;
    document.getElementById('resultsGrid').innerHTML =
        '<div class="no-results" style="color:#aaa; text-align:center; padding:40px;">Выберите JSON файл с данными</div>';

    window.allBuildings = [];
}

// === ЗАГРУЗКА ДАННЫХ ===
async function loadData() {
    if (!localFileData) {
        const statusMsg = document.getElementById('statusMsg');
        statusMsg.textContent = '📂 Загрузите JSON файл для начала работы';
        statusMsg.style.color = '#ffd700';
        document.getElementById('resultsGrid').innerHTML =
            '<div class="no-results" style="color:#aaa; text-align:center; padding:40px;">Выберите JSON файл с данными</div>';
        return;
    }

    console.log('🚀 Загрузка из локального файла');
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = 'Загрузка конфигурации...';

    await loadBasketConfig();
    statusMsg.textContent = 'Анализ данных...';

    setTimeout(() => {
        try {
            const entities = Array.isArray(localFileData)
                ? localFileData
                : Object.values(localFileData);

            window.allBuildings = [];
            let errorCount = 0, successCount = 0, buildingsWithAllyRooms = 0;

            console.log('⚙️ Обработка зданий...');
            entities.forEach((metaData, index) => {
                if (!metaData || !metaData.id || !metaData.name) return;
                try {
                    let mockData = { id: 0, cityentity_id: metaData.id, state: {}, bonus: metaData.bonus || null };
                    let era = null;
                    const building = window.CityBuildings.createBuilding(metaData, era, mockData);
                    if (building) {
                        window.allBuildings.push(building);
                        successCount++;
                        if (building.allyRooms) buildingsWithAllyRooms++;
                    } else {
                        errorCount++;
                    }
                    if (index < 3) console.log(`🏢 #${index}:`, metaData.name, '-> Эпоха:', building ? building.baseEra : 'FAIL');
                } catch (buildError) {
                    console.error('❌ Ошибка здания:', metaData.id, buildError);
                    errorCount++;
                }
            });

            console.log(`✅ Готово. Успешно: ${successCount}, Ошибок: ${errorCount}, С комнатами союзников: ${buildingsWithAllyRooms}`);

            if (window.allBuildings.length === 0) {
                statusMsg.textContent = 'Ошибка: Найдено 0 зданий.';
                statusMsg.style.color = '#ff6b6b';
                document.getElementById('resultsGrid').innerHTML =
                    '<div class="no-results" style="color:#ff6b6b">Здания не загружены.</div>';
            } else {
                statusMsg.textContent = `Готово. Найдено: ${window.allBuildings.length}.`;
                statusMsg.style.color = '#c5c6c7';
                document.getElementById('searchInput').disabled = false;
                document.getElementById('searchInput').focus();
                document.getElementById('resultsGrid').innerHTML = '';
                loadBasket();
            }
        } catch (parseError) {
            console.error('💥 Критическая ошибка:', parseError);
            statusMsg.textContent = 'Ошибка обработки данных.';
            statusMsg.style.color = '#ff6b6b';
        }
    }, 50);
}

// === ПОЛУЧЕНИЕ ДАННЫХ ЗДАНИЯ ДЛЯ ЭПОХИ ===
function getBuildingDataForEra(building, era) {
    return {
        population: window.CityBuildings.setPopulation(building.rawMeta, building.rawData, era),
        happiness: window.CityBuildings.setHappiness(building.rawMeta, building.rawData, era),
        boosts: window.CityBuildings.setBuildingBoosts(building.rawMeta, building.rawData, era),
        production: window.CityBuildings.setAllProductions(building.rawMeta, building.rawData, era)
    };
}