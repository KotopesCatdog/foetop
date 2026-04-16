// topdata.js - словари и конфигурация для таблицы топ зданий

// 1. Словарь для переименования типов бустов
const BOOST_TYPE_NAMES = {
    "att_boost_attacker": "🔴 Атака (все)",
    "att_boost_defender": "🔵 Атака (защита)",
    "def_boost_attacker": "🛡️ Защита (нападение)",
    "def_boost_defender": "🛡️ Защита (оборона)",
    "att_def_boost_attacker": "⚔️ Атака+Защита (нападение)",
    "att_def_boost_defender": "⚔️ Атака+Защита (оборона)",
    "guild_raids_action_points_collection": "⚔️ Очки гильдии",
    "guild_raids_defense_boost": "🏰 Бонус защиты гильдии",
    "coins_production": "💰 Производство монет",
    "supplies_production": "📦 Производство припасов",
    "population_capacity": "🏠 Вместимость населения",
    "guild_expedition_att_boost": "🏛️ Атака в экспедиции",
    "guild_expedition_def_boost": "🏛️ Защита в экспедиции",
    "battleground_att_boost": "🏁 Атака в битве",
    "battleground_def_boost": "🏁 Защита в битве"
};

// 2. Словарь для переименования targetedFeature
const TARGETED_FEATURE_NAMES = {
    "all": "🌍 везде",
    "guild_expedition": "🏛 Экспа",
    "guild_raids": "⚔️ КВА",
    "battleground": "🏁 Поля",
    "pvp_arena": "🏟️ арена PvP",
    "pve_combat": "⚔️ PvE бой",
    "continental_wars": "🌍 континентальные войны",
    "neighborhood": "🏘️ соседи",
    "friend": "👥 друзья",
    "guild": "🏰 гильдия"
};

// 3. Словарь для основных параметров
const MAIN_PARAM_NAMES = {
    "population": "👥 Население",
    "happiness": "😊 Счастье (предоставляемое)",
    "size_area": "📐 Площадь (клетки)",
    "road_required": "🛣️ Требование к дороге"
};

// 4. Словарь для ресурсов
const RESOURCE_NAMES = {
    "medals": "🎖️ Медали",
    "strategy_points": "📚 Очки стратегии",
    "coins": "💰 Монеты",
    "supplies": "📦 Припасы",
    "goods": "📦 Товары",
    "population": "👥 Население",
    "population_capacity": "🏠 Вместимость населения",
    "blueprints": "📋 Чертежи",
    "diamonds": "💎 Алмазы"
};

// 5. Словарь для genericReward продукции
const GENERIC_REWARD_NAMES = {
    "self_aid_kit": "🎁 Набор самопомощи",
    "self_aid_kit_10": "🎁 Набор самопомощи x10",
    "fragment#selection_kit_WIN24BC#3": "🧩 Фрагмент Собачьего тягача x3",
    "fragment#selection_kit_WIN18B#3": "🧩 Фрагмент Строителя саней x3",
    "selection_kit_WIN24BC": "📦 Набор выбора Собачьего тягача",
    "selection_kit_WIN18B": "📦 Набор выбора Строителя саней",
    "upgrade_kit": "⬆️ Набор улучшений",
    "one_up_kit": "⬆️ Набор +1 эпоха",
    "reno_kit": "🏗️ Набор реновации"
};

// 6. Порядок эпох (от ранних к поздним)
const ERA_ORDER = [
    "BronzeAge", "IronAge", "EarlyMiddleAge", "HighMiddleAge", "LateMiddleAge",
    "ColonialAge", "IndustrialAge", "ProgressiveEra", "ModernEra", "PostModernEra",
    "ContemporaryEra", "TomorrowEra", "FutureEra", "ArcticFuture", "OceanicFuture",
    "VirtualFuture", "SpaceAgeMars", "SpaceAgeAsteroidBelt", "SpaceAgeVenus",
    "SpaceAgeJupiterMoon", "SpaceAgeTitan", "SpaceAgeSpaceHub"
];

// 7. Человеческие названия для эпох
const ERA_NAMES = {
    "BronzeAge": "🏺 Бронзовый век",
    "IronAge": "⚔️ Железный век",
    "EarlyMiddleAge": "🏰 Раннее средневековье",
    "HighMiddleAge": "⚜️ Высокое средневековье",
    "LateMiddleAge": "🛡️ Позднее средневековье",
    "ColonialAge": "⛵ Колониальная эпоха",
    "IndustrialAge": "🏭 Индустриальная эпоха",
    "ProgressiveEra": "🎷 Прогрессивная эра",
    "ModernEra": "🏢 Современная эра",
    "PostModernEra": "📱 Постмодерн",
    "ContemporaryEra": "💻 Современность",
    "TomorrowEra": "🚀 Эра завтрашнего дня",
    "FutureEra": "🤖 Будущая эра",
    "ArcticFuture": "❄️ Арктическое будущее",
    "OceanicFuture": "🌊 Океаническое будущее",
    "VirtualFuture": "🕶️ Виртуальное будущее",
    "SpaceAgeMars": "🔴 Космическая эра (Марс)",
    "SpaceAgeAsteroidBelt": "🪨 Космическая эра (Пояс астероидов)",
    "SpaceAgeVenus": "🟠 Космическая эра (Венера)",
    "SpaceAgeJupiterMoon": "🪐 Космическая эра (Спутники Юпитера)",
    "SpaceAgeTitan": "🌑 Космическая эра (Титан)",
    "SpaceAgeSpaceHub": "🚀 Космическая эра (Космический хаб)"
};

// 8. Функция для получения человеческого названия буста с учётом targetedFeature
function getBoostHumanName(boostType, targetedFeature) {
    let baseName = BOOST_TYPE_NAMES[boostType];
    
    // Если тип не найден в словаре, пытаемся сформировать красивое название
    if (!baseName) {
        // Преобразуем type в читаемый вид: att_boost_attacker -> Атака атакующих
        baseName = boostType
            .replace(/att_boost_attacker/g, 'Атака (нападение)')
            .replace(/att_boost_defender/g, 'Атака (защита)')
            .replace(/def_boost_attacker/g, 'Защита (нападение)')
            .replace(/def_boost_defender/g, 'Защита (оборона)')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    let featureName = TARGETED_FEATURE_NAMES[targetedFeature];
    if (!featureName) {
        featureName = targetedFeature === "all" ? "везде" : targetedFeature.replace(/_/g, ' ');
    }
    
    // Если targetedFeature = "all" или отсутствует, не показываем лишнего
    if (!targetedFeature || targetedFeature === "all") {
        return baseName;
    }
    
    return `${baseName} (${featureName})`;
}

// 9. Основная функция для получения человеческого названия любого параметра
function getHumanParamName(paramId, rawId, extraData = {}) {
    // Основные параметры
    if (MAIN_PARAM_NAMES[paramId]) return MAIN_PARAM_NAMES[paramId];
    if (MAIN_PARAM_NAMES[rawId]) return MAIN_PARAM_NAMES[rawId];
    
    // Бусты (имеют формат boost_xxx)
    if (paramId.startsWith("boost_")) {
        const boostType = rawId;
        const targetedFeature = extraData.targetedFeature || "all";
        return getBoostHumanName(boostType, targetedFeature);
    }
    
    // Ресурсы (формат prod_xxx)
    if (paramId.startsWith("prod_")) {
        const resourceName = rawId;
        if (RESOURCE_NAMES[resourceName]) return RESOURCE_NAMES[resourceName];
        // Если ресурс не найден в словаре, возвращаем красивое название
        return `📦 ${resourceName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    
    // GenericReward (формат generic_xxx)
    if (paramId.startsWith("generic_")) {
        const genericId = rawId;
        if (GENERIC_REWARD_NAMES[genericId]) return GENERIC_REWARD_NAMES[genericId];
        // Если genericReward не найден, пробуем извлечь название из id
        let cleanName = genericId
            .replace(/fragment#/g, '🧩 Фрагмент: ')
            .replace(/#\d+$/g, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        return `🎁 ${cleanName}`;
    }
    
    // Если ничего не подошло, возвращаем rawId с красивым оформлением
    return `📊 ${rawId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
}

// 10. Функция для получения названия эпохи
function getHumanEraName(eraId) {
    return ERA_NAMES[eraId] || eraId;
}

// 11. Функция для сортировки эпох в правильном порядке
function sortEras(erasArray) {
    return erasArray.sort((a, b) => {
        const indexA = ERA_ORDER.indexOf(a);
        const indexB = ERA_ORDER.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
}

// 12. Функция для извлечения всех уникальных комбинаций бустов (type + targetedFeature)
function extractAllBoostCombinations(buildingsArray) {
    const boostMap = new Map();
    
    for (const building of buildingsArray) {
        if (!building?.components) continue;
        for (const eraKey of Object.keys(building.components)) {
            const eraComp = building.components[eraKey];
            const boosts = eraComp?.boosts?.boosts;
            if (Array.isArray(boosts)) {
                for (const boost of boosts) {
                    if (boost.type) {
                        const targetedFeature = boost.targetedFeature || "all";
                        const key = `${boost.type}|${targetedFeature}`;
                        if (!boostMap.has(key)) {
                            boostMap.set(key, {
                                type: boost.type,
                                targetedFeature: targetedFeature
                            });
                        }
                    }
                }
            }
        }
    }
    
    return Array.from(boostMap.values());
}

// Экспортируем для использования в HTML
if (typeof window !== 'undefined') {
    window.getHumanParamName = getHumanParamName;
    window.getHumanEraName = getHumanEraName;
    window.sortEras = sortEras;
    window.extractAllBoostCombinations = extractAllBoostCombinations;
}

// Для Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getHumanParamName,
        getHumanEraName,
        sortEras,
        extractAllBoostCombinations,
        BOOST_TYPE_NAMES,
        TARGETED_FEATURE_NAMES,
        ERA_ORDER,
        ERA_NAMES
    };
}