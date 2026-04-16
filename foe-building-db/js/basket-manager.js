// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ КОРЗИНЫ ===
let basket = [];
let basketEra = 'ContemporaryEra';
let basketSort = { column: null, direction: 'asc' };
let basketConfig = window.DEFAULT_BASKET_CONFIG || {
    settings: { maxBasketSize: 20, longPressDuration: 1000 }
};
let showPerTile = false;
let columnOrder = []; // Храним порядок колонок

// === НАСТРОЙКА НАЗВАНИЙ КОЛОНОК (редактируйте здесь) ===
const CUSTOM_COLUMN_NAMES = {
    // Статические колонки
    'action': '✕',
    'name': 'Название',
    'size': 'Размер',
    'population': 'Население',
    'population_per_tile': 'Нас./кл',
    'happiness': 'Счастье',
    'happiness_per_tile': 'Счастье/кл',
    'guild_raids': 'Кванты',
    'all': 'Все',
    'rogue': 'Разбои',

    // Ресурсы (Production)
    'prod:strategy_points': '⚡ СО',
    'prod:money': '💰 Монеты',
    'prod:supplies': '🔨 Молотки',
    'prod:goods': '📦 Товары',
    'prod:medals': '🏅 Медали',
    'prod:clan_power': '🤝 Сила Гильдии',
    'prod:previous_age': '⏪ Товары прошлой эпохи',
    'prod:next_age': '⏩ Товары след. эпохи',
    'prod:all_goods_of_age': '📦 Товары своей эпохи',
    'prod:random_good_of_age': '📦 Товары своей эпохи',
    'prod:rogue': 'Разбои',

    // Бонусы (Boosts)
    'boost:production_chance|all': '✨ (Шанс производства)',
    'boost:production_amount|all': '📈 (Объем производства)',
    'boost:building_cost|all': '💰 (Стоимость постройки)',
    'boost:attack_bonus|all': '⚔️ (Бонус атаки)',
    'boost:defense_bonus|all': '🛡️ (Бонус защиты)',
    'boost:satisfaction|all': '😊 (Счастье)',
    'boost:population|all': '👥 (Население)'
};

// === ОБЩАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ НАЗВАНИЯ РЕСУРСА ===
window.getResourceLabel = function(key, isGuildProduction = false) {
    let iconClass = 'bg-money';
    let label = key;
    
    if (isGuildProduction) {
        iconClass = 'bg-meet';
        if (key.includes('previous_age')) label = 'Товары прошлой эпохи в гильдию';
        else if (key.includes('next_age')) label = 'Товары следующей эпохи в гильдию';
        else if (key.includes('all_goods_of_age') || key.includes('random_good_of_age')) label = 'Товары своей эпохи в гильдию';
        else if (key.includes('random_good')) label = 'Случайные товары в гильдию';
        else label = 'Товары в гильдию';
    } else if (key === 'medals' || key.includes('medal')) { 
        iconClass = 'bg-fp'; 
        label = 'Медали'; 
    }
    else if (key.includes('previous_age')) { 
        iconClass = 'bg-goods'; 
        label = 'Товары прошлой эпохи'; 
    }
    else if (key.includes('next_age')) { 
        iconClass = 'bg-goods'; 
        label = 'Товары следующей эпохи'; 
    }
    else if (key.includes('all_goods_of_age') || key.includes('random_good_of_age')) { 
        iconClass = 'bg-goods'; 
        label = 'Товары своей эпохи'; 
    }
    else if (key.includes('good')) { 
        iconClass = 'bg-goods'; 
        label = 'Товары'; 
    }
    else if (key.includes('suppl')) { 
        iconClass = 'bg-supplies'; 
        label = 'Молотки'; 
    }
    else if (key.includes('money')) { 
        iconClass = 'bg-money'; 
        label = 'Монеты'; 
    }
    else if (key.includes('unit') || key.includes('random')) { 
        iconClass = 'bg-unit'; 
        label = 'Юниты'; 
    }
    else if (key.includes('strategy')) { 
        iconClass = 'bg-fp';  
        label = 'СО'; 
    }
    else if (key.includes('clan_power')) { 
        iconClass = 'bg-meet'; 
        label = 'Сила гильдии'; 
    }
    
    return { label, iconClass };
};

// === ЗАГРУЗКА КОНФИГУРАЦИИ ===
function loadBasketConfig() {
    basketConfig = window.DEFAULT_BASKET_CONFIG || {
        resources: {
            strategy_points: { label: "СО", iconClass: "bg-fp" },
            money: { label: "Монеты", iconClass: "bg-money" },
            supplies: { label: "Молотки", iconClass: "bg-supplies" },
            goods: { label: "Товары", iconClass: "bg-goods" },
            clan_power: { label: "Сила гильдии", iconClass: "bg-meet" },
            medals: { label: "Медали", iconClass: "bg-fp" },
            clan_goods_current_era: { label: "Товары своей эпохи", iconClass: "bg-goods" },
            random_good_of_age: { label: "Товары своей эпохи", iconClass: "bg-goods" }
        },
        boosts: {},
        features: window.FeatureNames || {},
        settings: { maxBasketSize: 20, longPressDuration: 700 }
    };
    return Promise.resolve();
}

// === ЗАГРУЗКА / СОХРАНЕНИЕ ===
function loadBasket() {
    const saved = localStorage.getItem('foeBuildingBasket');
    const savedEra = localStorage.getItem('foeBuildingBasketEra');
    const savedOrder = localStorage.getItem('foeBasketColumnOrder');
    
    if (saved) {
        try { basket = JSON.parse(saved); updateBasketCount(); }
        catch(e) { basket = []; }
    }
    if (savedEra) basketEra = savedEra;
    if (savedOrder) {
        try { columnOrder = JSON.parse(savedOrder); }
        catch(e) { columnOrder = []; }
    }
}

function saveBasket() {
    localStorage.setItem('foeBuildingBasket', JSON.stringify(basket));
    localStorage.setItem('foeBuildingBasketEra', basketEra);
    updateBasketCount();
}

function saveColumnOrder() {
    localStorage.setItem('foeBasketColumnOrder', JSON.stringify(columnOrder));
}

function updateBasketCount() {
    const countEl = document.getElementById('basketCount');
    if (countEl) countEl.textContent = basket.length;
}

// === ДОБАВЛЕНИЕ / УДАЛЕНИЕ ===
function addToBasket(building) {
    const maxSize = basketConfig?.settings?.maxBasketSize || 20;
    if (basket.length >= maxSize) { showToast(`Максимум ${maxSize} зданий!`, true); return; }
    if (basket.find(b => b.id === building.id)) { showToast('Уже в корзине', true); return; }
    basket.push({
        id: building.id, name: building.name, baseEra: building.baseEra,
        availableEras: building.availableEras, size: building.size,
        rawMeta: building.rawMeta, rawData: building.rawData, addedAt: Date.now()
    });
    saveBasket();
    updateBasketCardIndicators();
}

function removeFromBasket(buildingId) {
    basket = basket.filter(b => b.id !== buildingId);
    saveBasket();
    renderBasketTable();
}

function clearBasket() {
    if (confirm('Очистить всю корзину?')) { 
        basket = []; 
        saveBasket(); 
        renderBasketTable(); 
    }
}

// === МОДАЛЬНОЕ ОКНО ===
function openBasketModal() {
    const modal = document.getElementById('basketModal');
    if (modal) {
        modal.classList.add('active');
        initBasketEraSelect();
        initPerTileSelect();
        renderBasketTable();
        updateBasketCardIndicators();
    }
}

function closeBasketModal() {
    const modal = document.getElementById('basketModal');
    if (modal) modal.classList.remove('active');
}

function updateBasketCardIndicators() {
    document.querySelectorAll('.building-card').forEach(card => {
        const buildingId = card.dataset.id;
        const isInBasket = basket.some(item => item.id === buildingId);
        if (isInBasket) card.classList.add('in-basket');
        else card.classList.remove('in-basket');
    });
}

// === ВЫБОР ЭПОХИ ===
function initBasketEraSelect() {
    const select = document.getElementById('basketEraSelect');
    if (!select) return;
    select.innerHTML = '';
    window.EraList.forEach(era => {
        const option = document.createElement('option');
        option.value = era;
        option.textContent = window.EraNames[era] || era;
        if (era === basketEra) option.selected = true;
        select.appendChild(option);
    });
}

function onBasketEraChange() {
    const select = document.getElementById('basketEraSelect');
    if (select) { 
        basketEra = select.value; 
        saveBasket(); 
        renderBasketTable(); 
    }
}

// === ВЫБОР ОТОБРАЖЕНИЯ (НА КЛЕТКУ) ===
function initPerTileSelect() {
    const select = document.getElementById('perTileSelect');
    if (!select) return;
    select.innerHTML = '';
    const optionTotal = document.createElement('option');
    optionTotal.value = 'total';
    optionTotal.textContent = 'Общие значения';
    if (!showPerTile) optionTotal.selected = true;
    select.appendChild(optionTotal);
    const optionPerTile = document.createElement('option');
    optionPerTile.value = 'perTile';
    optionPerTile.textContent = 'На клетку';
    if (showPerTile) optionPerTile.selected = true;
    select.appendChild(optionPerTile);
}

function onPerTileChange() {
    const select = document.getElementById('perTileSelect');
    if (select) { 
        showPerTile = select.value === 'perTile'; 
        renderBasketTable(); 
    }
}

// === КОЭФФИЦИЕНТ ЗДАНИЯ ===
function getBuildingTileCoefficient(building) {
    const width = building.size.width;
    const length = building.size.length;
    const area = width * length;
    const needsStreet = window.CityBuildings.needsStreet(building.rawMeta);
    let coefficient = area;
    if (needsStreet > 0) {
        const shorterSide = Math.min(width, length);
        coefficient += shorterSide / 2;
    }
    return Math.round(coefficient);
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function getProdValue(productions, resKey) {
    if (!productions) return null;
    const prodItem = productions.find(p => p.resources && p.resources[resKey] !== undefined);
    return prodItem && prodItem.resources[resKey] !== undefined ? prodItem.resources[resKey] : null;
}

function getBoostValue(boosts, boostKey) {
    if (!boosts) return null;
    const [type, feature] = boostKey.split('|');
    const boostItem = boosts.find(bt => {
        const btTypes = Array.isArray(bt.type) ? bt.type : [bt.type];
        return btTypes.includes(type) && (bt.feature || bt.targetedFeature || 'all') === feature;
    });
    return boostItem ? boostItem.value : null;
}

function getColumnName(key, defaultName) {
    return CUSTOM_COLUMN_NAMES[key] || defaultName;
}

// === ПЕРЕТАСКИВАНИЕ КОЛОНОК ===
let draggedColumnIndex = null;

function initColumnDragDrop() {
    const table = document.getElementById('basketTable');
    if (!table) return;

    const thead = table.querySelector('thead');
    if (!thead) return;

    const headers = thead.querySelectorAll('th');

    headers.forEach((th, index) => {
        if (index === 0) {
            th.style.cursor = 'default';
            th.draggable = false;
            return;
        }

        th.draggable = true;
        th.style.cursor = 'grab';

        th.removeEventListener('dragstart', handleDragStart);
        th.removeEventListener('dragover', handleDragOver);
        th.removeEventListener('drop', handleDrop);
        th.removeEventListener('dragend', handleDragEnd);
        th.removeEventListener('dragenter', handleDragEnter);
        th.removeEventListener('dragleave', handleDragLeave);

        th.addEventListener('dragstart', handleDragStart);
        th.addEventListener('dragover', handleDragOver);
        th.addEventListener('drop', handleDrop);
        th.addEventListener('dragend', handleDragEnd);
        th.addEventListener('dragenter', handleDragEnter);
        th.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedColumnIndex = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget);
    e.currentTarget.classList.add('dragging');
    e.currentTarget.style.cursor = 'grabbing';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    const th = e.currentTarget;
    if (th.classList.contains('dragging')) return;
    th.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const table = document.getElementById('basketTable');
    if (!table) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    const toIndex = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget);
    const fromIndex = draggedColumnIndex;

    if (fromIndex === null || fromIndex === toIndex || fromIndex === 0 || toIndex === 0) {
        cleanupDrag();
        return;
    }

    moveColumn(thead, tbody, fromIndex, toIndex);
    cleanupDrag();
}

function handleDragEnd(e) {
    cleanupDrag();
}

function cleanupDrag() {
    draggedColumnIndex = null;
    document.querySelectorAll('.dragging, .drag-over').forEach(el => {
        el.classList.remove('dragging', 'drag-over');
        if (el.tagName === 'TH' && !el.classList.contains('col-action')) {
            el.style.cursor = 'grab';
        }
    });
}

// === ИСПРАВЛЕННАЯ ФУНКЦИЯ ПЕРЕМЕЩЕНИЯ + СОХРАНЕНИЕ ПОРЯДКА ===
function moveColumn(thead, tbody, fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    const headers = Array.from(thead.querySelectorAll('th'));
    const fromHeader = headers[fromIndex];

    if (fromIndex < toIndex) {
        headers[toIndex].parentNode.insertBefore(fromHeader, headers[toIndex].nextSibling);
    } else {
        headers[toIndex].parentNode.insertBefore(fromHeader, headers[toIndex]);
    }

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells[fromIndex] && cells[toIndex]) {
            const fromCell = cells[fromIndex];
            if (fromIndex < toIndex) {
                cells[toIndex].parentNode.insertBefore(fromCell, cells[toIndex].nextSibling);
            } else {
                cells[toIndex].parentNode.insertBefore(fromCell, cells[toIndex]);
            }
        }
    });

    // Сохраняем новый порядок колонок
    saveCurrentColumnOrder();

    setTimeout(initColumnDragDrop, 50);
}

function saveCurrentColumnOrder() {
    const table = document.getElementById('basketTable');
    if (!table) return;

    const headers = table.querySelectorAll('thead th');
    const newOrder = [];

    headers.forEach(th => {
        if (th.classList.contains('col-action')) {
            newOrder.push('action');
        } else if (th.dataset.sort) {
            newOrder.push(th.dataset.sort);
        } else if (th.textContent.trim().includes('Название')) {
            newOrder.push('name');
        } else if (th.textContent.trim().includes('Размер')) {
            newOrder.push('size');
        }
    });

    columnOrder = newOrder;
    saveColumnOrder();
}

// === ОТРИСОВКА ТАБЛИЦЫ ===
function renderBasketTable() {
    const table = document.getElementById('basketTable');
    if (!table) return;
    let thead = table.querySelector('thead');
    let tbody = table.querySelector('tbody');
    if (!thead) { thead = document.createElement('thead'); table.appendChild(thead); }
    if (!tbody) { tbody = document.createElement('tbody'); table.appendChild(tbody); }
    
    const uniqueBoosts = new Map();
    const uniqueProds = new Map();
    const technicalFields = ['id', 'name', 'type', 'subType', 'amount', 'dropChance', 'iconClass'];

    const basketData = basket.map(b => {
        const building = window.allBuildings?.find(ab => ab.id === b.id);
        if (!building) return null;
        const data = getBuildingDataForEra(building, basketEra);
        const coefficient = getBuildingTileCoefficient(building);
        return {
            id: b.id, name: b.name, size: b.size, coefficient: coefficient,
            population: data.population, happiness: data.happiness,
            production: data.production, boosts: data.boosts
        };
    }).filter(b => b !== null);

    // Собираем все колонки
    const allColumns = [];
    allColumns.push({ type: 'action', key: 'action', label: getColumnName('action', '✕') });
    allColumns.push({ type: 'name', key: 'name', label: getColumnName('name', 'Название') });
    allColumns.push({ type: 'size', key: 'size', label: getColumnName('size', 'Размер') });

    const popKey = showPerTile ? 'population_per_tile' : 'population';
    allColumns.push({ type: 'population', key: 'population', label: getColumnName(popKey, showPerTile ? 'Население/кл' : 'Население') });

    const happyKey = showPerTile ? 'happiness_per_tile' : 'happiness';
    allColumns.push({ type: 'happiness', key: 'happiness', label: getColumnName(happyKey, showPerTile ? 'Счастье/кл' : 'Счастье') });

    // Продукты
    basketData.forEach(b => {
        if (b.production && Array.isArray(b.production)) {
            b.production.filter(p => p.type !== 'random').forEach(p => {
                if (p.resources && typeof p.resources === 'object' && !Array.isArray(p.resources)) {
                    Object.keys(p.resources).forEach(resKey => {
                        if (technicalFields.includes(resKey)) return;
                        if (!uniqueProds.has(resKey)) {
                            const resInfo = getResourceLabel(resKey, p.type === 'guildResources');
                            const prodKey = `prod:${resKey}`;
                            uniqueProds.set(resKey, { 
                                type: 'prod',
                                key: resKey,
                                sortKey: `prod:${resKey}`,
                                iconClass: resInfo.iconClass, 
                                label: CUSTOM_COLUMN_NAMES[prodKey] || resInfo.label 
                            });
                        }
                    });
                }
            });
        }
    });
    uniqueProds.forEach(prod => allColumns.push(prod));

    // Бонусы
    basketData.forEach(b => {
        if (b.boosts && Array.isArray(b.boosts)) {
            b.boosts.forEach(boost => {
                const types = Array.isArray(boost.type) ? boost.type : [boost.type];
                types.forEach(t => {
                    const feature = boost.feature || boost.targetedFeature || 'all';
                    const key = `${t}|${feature}`;
                    if (!uniqueBoosts.has(key)) {
                        const boostCfg = basketConfig?.boosts?.[t] || {};
                        const iconUrl = boostCfg.iconUrl || window.BonusIcons?.[t] || window.BonusIcons?.['default'];
                        const featureLabel = basketConfig?.features?.[feature] || window.FeatureNames?.[feature] || feature.replace(/_/g, ' ');
                        const boostKey = `boost:${t}|${feature}`;
                        uniqueBoosts.set(key, { 
                            type: 'boost',
                            boostType: t,
                            feature: feature,
                            sortKey: `boost:${t}|${feature}`,
                            icon: iconUrl, 
                            label: CUSTOM_COLUMN_NAMES[boostKey] || `(${featureLabel})` 
                        });
                    }
                });
            });
        }
    });
    uniqueBoosts.forEach(boost => allColumns.push(boost));

    // Применяем сохранённый порядок колонок
    let orderedColumns = [...allColumns];
    if (columnOrder && columnOrder.length > 0) {
        orderedColumns = [];
        columnOrder.forEach(orderKey => {
            const found = allColumns.find(col => {
                if (col.type === 'action') return orderKey === 'action';
                if (col.type === 'name') return orderKey === 'name';
                if (col.type === 'size') return orderKey === 'size';
                if (col.type === 'population') return orderKey === 'population' || orderKey === 'population_per_tile';
                if (col.type === 'happiness') return orderKey === 'happiness' || orderKey === 'happiness_per_tile';
                return col.sortKey === orderKey;
            });
            if (found) orderedColumns.push(found);
        });

        allColumns.forEach(col => {
            if (!orderedColumns.includes(col)) orderedColumns.push(col);
        });
    }

    // Отрисовка заголовка
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    
    orderedColumns.forEach(col => {
        const th = document.createElement('th');
        
        if (col.type === 'action') {
            th.className = 'col-action';
            th.textContent = col.label;
            th.style.cursor = 'default';
        } else if (col.type === 'name') {
            th.textContent = col.label;
            th.dataset.sort = 'name';
        } else if (col.type === 'size') {
            th.textContent = col.label;
            th.dataset.sort = 'size';
        } else if (col.type === 'population') {
            th.textContent = col.label;
            th.dataset.sort = 'population';
        } else if (col.type === 'happiness') {
            th.textContent = col.label;
            th.dataset.sort = 'happiness';
        } else if (col.type === 'prod') {
            th.className = 'col-prod';
            th.dataset.sort = `prod:${col.key}`;
            const icon = document.createElement('span');
            icon.className = `icon-sm ${col.iconClass}`;
            th.appendChild(icon);
            th.appendChild(document.createTextNode(col.label));
        } else if (col.type === 'boost') {
            th.className = 'col-boost';
            th.dataset.sort = col.sortKey;
            th.style.textAlign = 'center';
            const img = document.createElement('img');
            img.src = col.icon;
            img.className = 'bonus-icon-img';
            th.appendChild(img);
            th.appendChild(document.createTextNode(' ' + col.label));
        }
        
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);

    // Сортировка данных
    let sortedData = [...basketData];
    if (basketSort.column) {
        sortedData.sort((a, b) => {
            let valA, valB;
            const [sortType, sortKey] = basketSort.column.split(':');
            if (sortType === 'prod') { 
                valA = getProdValue(a.production, sortKey); 
                valB = getProdValue(b.production, sortKey); 
                if (showPerTile && valA !== null) valA = valA / a.coefficient; 
                if (showPerTile && valB !== null) valB = valB / b.coefficient; 
            } else if (sortType === 'boost') { 
                valA = getBoostValue(a.boosts, sortKey); 
                valB = getBoostValue(b.boosts, sortKey); 
            } else { 
                valA = a[sortType]; 
                valB = b[sortType]; 
                if (sortType === 'size') { 
                    valA = a.size.width * a.size.length; 
                    valB = b.size.width * b.size.length; 
                } 
                if (sortType === 'population' || sortType === 'happiness') { 
                    if (showPerTile) { 
                        valA = valA / a.coefficient; 
                        valB = valB / b.coefficient; 
                    } 
                } 
            }
            if (valA === valB) return 0; 
            if (valA == null) return 1;  
            if (valB == null) return -1;
            return basketSort.direction === 'asc' ? (valA < valB ? -1 : 1) : (valA < valB ? 1 : -1);
        });
    }

    // Классы сортировки
    thead.querySelectorAll('th').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (th.dataset.sort === basketSort.column) {
            th.classList.add(basketSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });

    // Отрисовка строк
    tbody.innerHTML = '';
    if (sortedData.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td'); 
        emptyCell.colSpan = orderedColumns.length; 
        emptyCell.style.textAlign = 'center'; 
        emptyCell.style.padding = '20px'; 
        emptyCell.style.color = '#888'; 
        emptyCell.textContent = 'Корзина пуста';
        emptyRow.appendChild(emptyCell); 
        tbody.appendChild(emptyRow);
    } else {
        sortedData.forEach(b => {
            const row = document.createElement('tr');
            
            orderedColumns.forEach(col => {
                const td = document.createElement('td');
                
                if (col.type === 'action') {
                    td.className = 'col-action';
                    td.style.textAlign = 'center';
                    const btnRemove = document.createElement('button');
                    btnRemove.className = 'btn-remove';
                    btnRemove.textContent = '✕';
                    btnRemove.onclick = () => removeFromBasket(b.id);
                    td.appendChild(btnRemove);
                } else if (col.type === 'name') {
                    const strong = document.createElement('strong');
                    strong.textContent = b.name;
                    td.appendChild(strong);
                } else if (col.type === 'size') {
                    td.textContent = `${b.size.width}x${b.size.length}`;
                } else if (col.type === 'population') {
                    if (showPerTile) {
                        const popValue = (b.population / b.coefficient).toFixed(2);
                        td.className = parseFloat(popValue) > 0 ? 'tt-value positive' : 'tt-value negative';
                        td.textContent = popValue;
                    } else {
                        td.className = b.population > 0 ? 'tt-value positive' : 'tt-value negative';
                        td.textContent = `${b.population > 0 ? '+' : ''}${b.population}`;
                    }
                } else if (col.type === 'happiness') {
                    if (showPerTile) {
                        const happyValue = (b.happiness / b.coefficient).toFixed(2);
                        td.className = 'tt-value positive';
                        td.textContent = happyValue;
                    } else {
                        td.className = 'tt-value positive';
                        td.textContent = `+${b.happiness}`;
                    }
                } else if (col.type === 'prod') {
                    td.style.textAlign = 'center';
                    td.style.fontWeight = 'bold';
                    let val = '';
                    if (b.production) {
                        const prodItem = b.production.find(p => p.resources && p.resources[col.key] !== undefined);
                        if (prodItem && prodItem.resources[col.key] !== undefined) {
                            let rawValue = prodItem.resources[col.key];
                            val = showPerTile ? (rawValue / b.coefficient).toFixed(2) : Math.round(rawValue);
                        }
                    }
                    td.textContent = val || '—';
                } else if (col.type === 'boost') {
                    td.style.textAlign = 'center';
                    td.style.fontWeight = 'bold';
                    td.style.color = '#4ecdc4';
                    let val = '';
                    if (b.boosts) {
                        const boostItem = b.boosts.find(bt => {
                            const btTypes = Array.isArray(bt.type) ? bt.type : [bt.type];
                            return btTypes.includes(col.boostType) && (bt.feature || bt.targetedFeature || 'all') === col.feature;
                        });
                        if (boostItem) {
                            let boostValue = boostItem.value;
                            val = showPerTile ? (boostValue / b.coefficient).toFixed(2) : `+${boostValue}%`;
                        }
                    }
                    td.textContent = val || '—';
                }
                
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    }
    
    // Обработчики сортировки
    thead.querySelectorAll('th[data-sort]').forEach(th => {
        th.onclick = (e) => {
            const col = th.dataset.sort;
            if (basketSort.column === col) basketSort.direction = basketSort.direction === 'asc' ? 'desc' : 'asc';
            else { basketSort.column = col; basketSort.direction = 'asc'; }
            renderBasketTable();
        };
    });
    
    initColumnDragDrop();
}