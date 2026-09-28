// ============================================
// kvag_all.js — объединённый файл редактора QI-Plan
// (данные зданий + основная логика)
// Для конвертации проекта в EXE (Electron / NW.js / Tauri)
// ============================================

// ============================================
// ЧАСТЬ 1. ДАННЫЕ ЗДАНИЙ И ПЕРЕВОДЫ БОНУСОВ
// ============================================

const buildingData = [
  {
    "category": "Жилые",
    "name": "Многоэтажный дом 2x2",
    "display_name": "Мн-эт",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 70,
      "coin_cost": 10000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 12500,
      "chrono_production": 10,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Каркасный дом 2x2",
    "display_name": "Карк",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 110,
      "coin_cost": 10000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "coin_production": 25000,
      "chrono_production": 75,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Дом с гонтовой кр. 2x2",
    "display_name": "Гонт",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 150,
      "coin_cost": 210000,
      "hammer_cost": 200000,
      "chrono_cost": 1000,
      "coin_production": 130000,
      "chrono_production": 250,
      "coin_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Жилые",
    "name": "Особняк 2x2",
    "display_name": "Особн",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 60,
      "coin_cost": 14000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 7500,
      "chrono_production": 10,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Дом из песчаника 2x2",
    "display_name": "Песч",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 90,
      "coin_cost": 42000,
      "hammer_cost": 60000,
      "chrono_cost": 200,
      "coin_production": 15000,
      "chrono_production": 75,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Городской особняк 2x2",
    "display_name": "Гор-ос",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 130,
      "coin_cost": 294000,
      "hammer_cost": 240000,
      "chrono_cost": 1000,
      "coin_production": 78000,
      "chrono_production": 250,
      "coin_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Жилые",
    "name": "Усадьба 2x2",
    "display_name": "Усадьба",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 50,
      "coin_cost": 16000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "coin_production": 3750,
      "chrono_production": 10,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Жилые",
    "name": "Многоквартирный дом 2x2",
    "display_name": "Мн-квар",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 80,
      "coin_cost": 48000,
      "hammer_cost": 70000,
      "chrono_cost": 200,
      "coin_production": 7500,
      "chrono_production": 75,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Жилые",
    "name": "Манор 2x2",
    "display_name": "Манор",
    "size": "2x2",
    "color": "lightgreen",
    "bonuses": {
      "population": 110,
      "coin_cost": 336000,
      "hammer_cost": 280000,
      "chrono_cost": 1000,
      "coin_production": 39000,
      "chrono_production": 250,
      "coin_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Кожевня 3x3",
    "display_name": "Кожевня",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 12000,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 12000,
      "chrono_production": 10,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Обувная мастерская 3x3",
    "display_name": "Обувная",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 36000,
      "hammer_cost": 50000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 24000,
      "chrono_production": 75,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Пекарня 4x3",
    "display_name": "Пекарня",
    "size": "4x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 84000,
      "hammer_cost": 100000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 60000,
      "chrono_production": 250,
      "hammer_acceleration": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Молотки",
    "name": "Ферма 4x5",
    "display_name": "Ферма",
    "size": "4x5",
    "color": "plum",
    "bonuses": {
      "coin_cost": 16800,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 7200,
      "chrono_production": 10,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Лаборатория алхимика 3x2",
    "display_name": "Алхимик",
    "size": "3x2",
    "color": "plum",
    "bonuses": {
      "coin_cost": 50400,
      "hammer_cost": 60000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 14400,
      "chrono_production": 75,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Ветряная мельница 3x4",
    "display_name": "Ветряная",
    "size": "3x4",
    "color": "plum",
    "bonuses": {
      "coin_cost": 117600,
      "hammer_cost": 120000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 36000,
      "chrono_production": 250,
      "hammer_acceleration": 10
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Молотки",
    "name": "Пивоварня 3x3",
    "display_name": "Пивоварня",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 19200,
      "hammer_cost": 0,
      "population_cost": 30,
      "chrono_cost": 0,
      "hammer_production": 4800,
      "chrono_production": 10,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Лавка специй 3x3",
    "display_name": "Лавка спец.",
    "size": "3x3",
    "color": "plum",
    "bonuses": {
      "coin_cost": 57600,
      "hammer_cost": 70000,
      "population_cost": 60,
      "chrono_cost": 200,
      "hammer_production": 9600,
      "chrono_production": 75,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Молотки",
    "name": "Бондарня 3x4",
    "display_name": "Бондарня",
    "size": "3x4",
    "color": "plum",
    "bonuses": {
      "coin_cost": 134400,
      "hammer_cost": 140000,
      "population_cost": 120,
      "chrono_cost": 1000,
      "hammer_production": 24000,
      "chrono_production": 250,
      "hammer_acceleration": 20
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Товар",
    "name": "Пасека 3x3",
    "display_name": "Пасека",
    "size": "3x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Медь 4x3",
    "display_name": "Медь",
    "size": "4x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Кирпичный цех 4x3",
    "display_name": "Кирпичный цех",
    "size": "4x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Канатная мастерская 3x2",
    "display_name": "Канатная",
    "size": "3x2",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Товар",
    "name": "Порох 3x3",
    "display_name": "Порох",
    "size": "3x3",
    "color": "pink",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 7500,
      "population_cost": 100,
      "chrono_cost": 200
    },
    "symbol": "●",
    "symbol_color": ""
  },
  {
    "category": "Общест.",
    "name": "Торговая площадь 3x3",
    "display_name": "Торговая пл",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 12000,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 125,
      "od_production": 0,
      "od_chas": 50
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Виселица 2x2",
    "display_name": "Висел.",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 36000,
      "hammer_cost": 36000,
      "chrono_cost": 100,
      "happiness_production": 250,
      "od_production": 0,
      "od_chas": 60
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Позорный столб 2x2",
    "display_name": "П. столб",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 120000,
      "hammer_cost": 120000,
      "chrono_cost": 500,
      "happiness_production": 750,
      "od_production": 0,
      "od_chas": 120
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Общест.",
    "name": "Церковь 3x3",
    "display_name": "Церковь",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 16800,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 160,
      "od_production": 500,
      "od_chas": 50
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Типография 3x3",
    "display_name": "Типография",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50400,
      "hammer_cost": 43200,
      "chrono_cost": 100,
      "happiness_production": 375,
      "od_production": 500,
      "od_chas": 130
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Дом лекаря 3x3",
    "display_name": "Дом лекаря",
    "size": "3x3",
    "color": "blue",
    "bonuses": {
      "coin_cost": 168000,
      "hammer_cost": 144000,
      "chrono_cost": 500,
      "happiness_production": 1125,
      "od_production": 1000,
      "od_chas": 260
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Общест.",
    "name": "Дворец 4x4",
    "display_name": "Дворец",
    "size": "4x4",
    "color": "blue",
    "bonuses": {
      "coin_cost": 19200,
      "hammer_cost": 0,
      "chrono_cost": 0,
      "happiness_production": 225,
      "od_production": 1250,
      "od_chas": 90
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Общест.",
    "name": "Библиотека 4x4",
    "display_name": "Библиотека",
    "size": "4x4",
    "color": "blue",
    "bonuses": {
      "coin_cost": 57600,
      "hammer_cost": 50400,
      "chrono_cost": 100,
      "happiness_production": 500,
      "od_production": 2500,
      "od_chas": 200
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Общест.",
    "name": "Дом картографа 3x2",
    "display_name": "Дом картог",
    "size": "3x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 192000,
      "hammer_cost": 168000,
      "chrono_cost": 500,
      "happiness_production": 900,
      "od_production": 750,
      "od_chas": 180
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Кипарис 1x1",
    "display_name": "Кип",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 10,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Цветочная изгородь 1x1",
    "display_name": "Ц и",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 50000,
      "hammer_cost": 50000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 10
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Пруд 2x2",
    "display_name": "Пруд",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 200000,
      "hammer_cost": 200000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 25,
      "blue_stats": 25
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Декор",
    "name": "Указательный столб 1x1",
    "display_name": "У с",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 62500,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 15,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Горгулья 1x1",
    "display_name": "Гор",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 62500,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 15
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Флаг 1x1",
    "display_name": "Фла",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 300000,
      "hammer_cost": 250000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 20,
      "blue_stats": 20
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Декор",
    "name": "Разрушенная башня 2x2",
    "display_name": "Разр. б",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 100000,
      "hammer_cost": 75000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 45,
      "blue_stats": 0
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Группа деревьев 2x2",
    "display_name": "Гр. дер",
    "size": "2x2",
    "color": "blue",
    "bonuses": {
      "coin_cost": 100000,
      "hammer_cost": 75000,
      "chrono_cost": 200,
      "happiness_cost": 25,
      "red_stats": 0,
      "blue_stats": 45
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Декор",
    "name": "Морская скульптура 1x1",
    "display_name": "М.с",
    "size": "1x1",
    "color": "blue",
    "bonuses": {
      "coin_cost": 400000,
      "hammer_cost": 300000,
      "chrono_cost": 750,
      "happiness_cost": 75,
      "red_stats": 30,
      "blue_stats": 30
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Конный лучник 3x4",
    "display_name": "Конный лучн",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Бронированная пехота 3x3",
    "display_name": "Брон. пех",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Мастерская катапульт 3x3",
    "display_name": "Катапульта",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Казармы наёмников 3x3",
    "display_name": "Наёмники",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Тяжелая кавалерия 3x4",
    "display_name": "Тяж. кавал",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 15000,
      "hammer_cost": 7500,
      "chrono_cost": 0,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "yellow"
  },
  {
    "category": "Воен.",
    "name": "Арбалетчик 3x3",
    "display_name": "Арбалетчик",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Тяжёлая пехота 3x3",
    "display_name": "Тяж. пехота",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Требушеты 3x3",
    "display_name": "Требушеты",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Берсерки 3x3",
    "display_name": "Берсерки",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Конюшня рыцарей 3x4",
    "display_name": "Конюшня рыц.",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 45000,
      "hammer_cost": 22500,
      "chrono_cost": 200,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "green"
  },
  {
    "category": "Воен.",
    "name": "Длиннолучник 3x3",
    "display_name": "Дл-лучник",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Королевский стражник 3x4",
    "display_name": "Кор. страж",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Пушка 3x4",
    "display_name": "Пушка",
    "size": "3x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Двуручный меч 3x3",
    "display_name": "Двуруч. меч",
    "size": "3x3",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Воен.",
    "name": "Конюшня тяж рыцаря 4x4",
    "display_name": "Конюшня тяж рыц",
    "size": "4x4",
    "color": "red",
    "bonuses": {
      "coin_cost": 75000,
      "hammer_cost": 37500,
      "chrono_cost": 1000,
      "population_cost": 100
    },
    "symbol": "●",
    "symbol_color": "red"
  },
  {
    "category": "Расширения",
    "name": "За осколки",
    "display_name": "Оск.",
    "size": "4x4",
    "color": "white",
    "bonuses": {},
    "symbol": "",
    "symbol_color": ""
  },
  {
    "category": "Расширения",
    "name": "За товар",
    "display_name": "Тов.",
    "size": "4x4",
    "color": "white",
    "bonuses": {},
    "symbol": "",
    "symbol_color": ""
  },
  {
    "category": "Системные",
    "name": "Ратуша",
    "display_name": "Ратуша",
    "size": "7x6",
    "color": "yellow",
    "bonuses": {
      "coin_production": 50000,
      "chrono_production": 15,
      "hammer_production": 50000
    },
    "symbol": "",
    "symbol_color": ""
  }
];

const bonusTranslations = {
  population: 'Население',
  coin_cost: 'Затр. монет',
  hammer_cost: 'Затр. молотков',
  chrono_cost: 'Затр. хроно',
  coin_production: 'Произв. монет',
  chrono_production: 'Произв. хроно',
  coin_acceleration: 'Ускор. монет',
  hammer_production: 'Произв. молотков',
  hammer_acceleration: 'Ускор. молотков',
  population_cost: 'Затр. населения',
  happiness_production: 'Произв. счастья',
  happiness_cost: 'Затр. счастья',
  od_production: 'Ёмкость КД',
  blue_stats: 'Син. статы',
  red_stats: 'Красн. статы',
  od_chas: 'Пр-во ОД/ 1 ч.'
};

// ============================================
// ЧАСТЬ 2. ОСНОВНАЯ ЛОГИКА РЕДАКТОРА
// ============================================

// Текущий угол поворота карты (0, 90, 180, 270)
let currentRotation = 0;

// Возвращает [w, h] с учётом текущего поворота (нечётное кол-во поворотов — меняем местами)
function getEffectiveSize(w, h) {
  const turns = (currentRotation / 90) % 2;
  return turns === 1 ? [h, w] : [w, h];
}

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
let sellMode = false;
let whiteCellsCount = 192;

// ============================================
// ИМИТАЦИЯ ПРОИЗВОДСТВА И СБОРА РЕСУРСОВ
// ============================================
let productionMode = false;
let collectionMode = false;

const PRODUCTION_ELIGIBLE_CATEGORIES = ['Жилые', 'Молотки', 'Товар'];
const PRODUCTION_CYCLE_HOURS = 10;
const GOODS_YIELD_PER_RUN = 20;
const GOODS_RUN_COST = { coin: 70000, hammer: 56000 };

let gameTimeHours = 0;
let producedTotals = { coin: 0, hammer: 0, goods: 0 };
let lastCalculatedStats = null;
let productionStatSnapshots = [];

let initialCellStates = new Array(totalCells).fill('');
let townHallBonuses = {
  od: 0,
  coin_acceleration: 0,
  hammer_acceleration: 0,
  coin_initial: 450000,
  hammer_initial: 75000,
  chrono_initial: 0,
  shard_initial: 500,
  goods_initial: 100,
  kd_capacity: 200000
};

const EXPANSION_SHARD_COSTS = [
  100, 150, 200, 250, 300, 350, 400, 450, 500, 550,
  600, 650, 700, 750, 800, 850, 900, 950
];
const EXPANSION_GOODS_COSTS = [
  30, 60, 90, 130, 180, 240, 310, 390, 480, 580, 700
];

const EXPANSION_NAME_TO_TYPE = {
  'За осколки': 'shard',
  'За товар': 'goods'
};

let expansionSpent = { shard: 0, goods: 0 };
let virtualExpansions = { shard: 0, goods: 0 };
let soldPenalty = { coin: 0, hammer: 0, chrono: 0 };

let selectedBuilding = null;
let selectedLiElement = null;
let ghostFigure = null;
let clearedCellsHistory = [];
let clickTimer = null;

// ============================================
// ОБРАБОТЧИК ДВОЙНОГО КЛИКА
// ============================================
function handleFigureClick(figure, e) {
    if (deleteMode) {
        e.stopPropagation();
        return;
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
      
      if (building.category !== 'Расширения') {
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
      
      const expType = EXPANSION_NAME_TO_TYPE[building.name];
      if (expType) {
        const row = document.createElement('div');
        row.className = 'expansion-buy-row';
        li.classList.add('expansion-buy-li');
        
        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'expansion-plus-btn';
        plusBtn.textContent = '+';
        plusBtn.title = 'Учесть расширение, уже купленное в игре (без изменений на поле)';
        plusBtn.onclick = (e) => { e.stopPropagation(); addVirtualExpansion(expType); };
        
        const countSpan = document.createElement('span');
        countSpan.className = 'expansion-virtual-count';
        countSpan.id = `virtual-count-${expType}`;
        countSpan.textContent = String(virtualExpansions[expType] || 0);
        countSpan.title = 'Клик — отменить последнее виртуальное расширение этого типа';
        countSpan.onclick = (e) => { e.stopPropagation(); removeVirtualExpansion(expType); };
        
        row.appendChild(li);
        row.appendChild(plusBtn);
        row.appendChild(countSpan);
        ul.appendChild(row);
      } else {
        ul.appendChild(li);
      }
    });
    
    if (category === "Расширения") {
      const li = document.createElement('li');
      li.innerHTML = `<span class="symbol"></span><span class="name-size">Все расш.</span>`;
      li.onclick = clearAllXCells;
      ul.appendChild(li);
      
      const liSellShard = document.createElement('li');
      liSellShard.innerHTML = `<span class="symbol"></span><span class="name-size">↩️ Продать посл. (осколки)</span>`;
      liSellShard.onclick = (e) => { e.stopPropagation(); sellLastExpansion('shard'); };
      ul.appendChild(liSellShard);
      
      const liSellGoods = document.createElement('li');
      liSellGoods.innerHTML = `<span class="symbol"></span><span class="name-size">↩️ Продать посл. (товар)</span>`;
      liSellGoods.onclick = (e) => { e.stopPropagation(); sellLastExpansion('goods'); };
      ul.appendChild(liSellGoods);
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
  
  let [widthCells, heightCells] = getEffectiveSize(...selectedBuilding.size.split('x').map(Number));
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
  
  let [widthCells, heightCells] = getEffectiveSize(...selectedBuilding.size.split('x').map(Number));
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

  if (['townhall', 'yellow-light', 'white-light', 'white-medium', 'white-dark'].includes(forcedClass)) {
    figure.style.color = 'black';
  }

  const text = document.createElement('div');
  const maxChars = Math.floor(widthPx / 8);
  const bData = buildingData.find(b => b.name === name);
  text.textContent = (bData ? bData.display_name : name).substring(0, maxChars);
  figure.appendChild(text);

  if (name !== 'Препятствие') {
    figure.addEventListener('click', (e) => { e.stopPropagation(); handleFigureClick(figure, e); });
  }
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
  const selectedBuildingData = buildingData.find(building => building.name === name);
  if (!selectedBuildingData) {
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
    if (name !== 'Препятствие') {
      figure.addEventListener('click', (e) => { e.stopPropagation(); handleFigureClick(figure, e); });
    }
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
  if (EXPANSION_NAME_TO_TYPE[finalName]) {
    figure.dataset.expansionType = EXPANSION_NAME_TO_TYPE[finalName];
  }
  
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
  
  if (!isLoad && EXPANSION_NAME_TO_TYPE[finalName]) {
    const isOverGray = isInGrayArea(finalLeft, finalTop, widthCells, heightCells);
    if (!isOverGray) {
      const purchased = clearXUnderFigure(figure);
      if (purchased) {
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
    
    if (figure.dataset.expansionType) {
      const left = parseInt(figure.style.left) / 30;
      const top = parseInt(figure.style.top) / 30;
      const width = parseInt(figure.style.width) / 30;
      const height = parseInt(figure.style.height) / 30;
      const isOverGray = isInGrayArea(left * 30, top * 30, width, height);
      if (!isOverGray) {
        const purchased = clearXUnderFigure(figure);
        if (purchased) {
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
        if (otherFig !== fig && fig.dataset.name !== 'Препятствие' && otherFig.dataset.name !== 'Препятствие') {
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

function getGoodsPurchasedCount() {
  return clearedCellsHistory.filter(h => h.expansionType === 'goods').length + virtualExpansions.goods;
}
function getShardPurchasedCount() {
  return clearedCellsHistory.filter(h => h.expansionType === 'shard').length + virtualExpansions.shard;
}

function clearXUnderFigure(figure) {
  const expansionType = figure.dataset.expansionType;
  if (expansionType !== 'shard' && expansionType !== 'goods') return false;
  
  let cost;
  if (expansionType === 'goods') {
    const goodsCount = getGoodsPurchasedCount();
    if (goodsCount >= EXPANSION_GOODS_COSTS.length) {
      alert(`Достигнут лимит расширений за товар (${EXPANSION_GOODS_COSTS.length})`);
      return false;
    }
    cost = { goods: EXPANSION_GOODS_COSTS[goodsCount] };
  } else {
    const shardCount = getShardPurchasedCount();
    if (shardCount >= EXPANSION_SHARD_COSTS.length) {
      alert(`Достигнут лимит расширений за осколки (${EXPANSION_SHARD_COSTS.length})`);
      return false;
    }
    cost = { shard: EXPANSION_SHARD_COSTS[shardCount] };
  }
  
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
      cells: clearedCells,
      expansionType: expansionType,
      cost: cost
    });
    
    if (expansionType === 'goods') {
      expansionSpent.goods += cost.goods;
    } else {
      expansionSpent.shard += cost.shard;
    }
  }
  
  calculateBonuses();
  return true;
}

function sellLastExpansion(expansionType) {
  let idx = -1;
  for (let i = clearedCellsHistory.length - 1; i >= 0; i--) {
    if (clearedCellsHistory[i].expansionType === expansionType) {
      idx = i;
      break;
    }
  }
  
  if (idx === -1) {
    const messages = {
      shard: 'Нет покупок расширений за осколки для продажи.',
      goods: 'Нет покупок расширений за товар для продажи.'
    };
    alert(messages[expansionType] || 'Нет покупок для продажи.');
    return;
  }
  
  const entry = clearedCellsHistory[idx];
  
  entry.cells.forEach(cellInfo => {
    const cell = grid.children[cellInfo.index];
    if (cell && cell.textContent === '') {
      cell.textContent = 'X';
      initialCellStates[cellInfo.index] = 'X';
    }
  });
  
  if (entry.cost) {
    if (entry.expansionType === 'goods') {
      expansionSpent.goods -= entry.cost.goods || 0;
    } else {
      expansionSpent.shard -= entry.cost.shard || 0;
    }
  }
  
  clearedCellsHistory.splice(idx, 1);
  whiteCellsCount = countWhiteCells();
  calculateBonuses();
}

function addVirtualExpansion(type) {
  let combinedCount, limit, cost;
  
  if (type === 'goods') {
    combinedCount = getGoodsPurchasedCount();
    limit = EXPANSION_GOODS_COSTS.length;
    if (combinedCount >= limit) {
      alert(`Достигнут лимит расширений за товар (${limit})`);
      return;
    }
    cost = { goods: EXPANSION_GOODS_COSTS[combinedCount] };
  } else {
    combinedCount = getShardPurchasedCount();
    limit = EXPANSION_SHARD_COSTS.length;
    if (combinedCount >= limit) {
      alert(`Достигнут лимит расширений за осколки (${limit})`);
      return;
    }
    cost = { shard: EXPANSION_SHARD_COSTS[combinedCount] };
  }
  
  virtualExpansions[type] = (virtualExpansions[type] || 0) + 1;
  
  if (type === 'goods') {
    expansionSpent.goods += cost.goods;
  } else {
    expansionSpent.shard += cost.shard;
  }
  
  updateVirtualCountDisplay(type);
  calculateBonuses();
}

function removeVirtualExpansion(type) {
  if (!virtualExpansions[type]) return;
  
  let tierIndex, cost;
  if (type === 'goods') {
    tierIndex = getGoodsPurchasedCount() - 1;
    cost = { goods: EXPANSION_GOODS_COSTS[tierIndex] };
  } else {
    tierIndex = getShardPurchasedCount() - 1;
    cost = { shard: EXPANSION_SHARD_COSTS[tierIndex] };
  }
  
  virtualExpansions[type] -= 1;
  
  if (type === 'goods') {
    expansionSpent.goods -= cost.goods || 0;
  } else {
    expansionSpent.shard -= cost.shard || 0;
  }
  
  updateVirtualCountDisplay(type);
  calculateBonuses();
}

function updateVirtualCountDisplay(type) {
  const el = document.getElementById(`virtual-count-${type}`);
  if (el) el.textContent = String(virtualExpansions[type] || 0);
}

function refreshAllVirtualCountDisplays() {
  Object.keys(virtualExpansions).forEach(updateVirtualCountDisplay);
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
  
  document.querySelectorAll('.figure[data-expansion-type]').forEach(fig => {
    if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
    fig.remove();
  });
  
  clearedCellsHistory = [];
  expansionSpent = { shard: 0, goods: 0 };
  whiteCellsCount = countWhiteCells();
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
    shard_cost: 0,
    goods_cost: 0,
    kd_capacity: Number(townHallBonuses.kd_capacity) || 200000
  };
  
  stats.coin_cost += Number(townHallBonuses.coin_initial) || 0;
  stats.hammer_cost += Number(townHallBonuses.hammer_initial) || 0;
  stats.chrono_cost += Number(townHallBonuses.chrono_initial) || 0;
  stats.shard_cost += Number(townHallBonuses.shard_initial) || 0;
  stats.goods_cost += Number(townHallBonuses.goods_initial) || 0;
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
    stats.shard_cost -= Number(building.bonuses.shard_cost) || 0;
    stats.goods_cost -= Number(building.bonuses.goods_cost) || 0;
  });
  
  stats.coin_cost -= soldPenalty.coin;
  stats.hammer_cost -= soldPenalty.hammer;
  stats.chrono_cost -= soldPenalty.chrono;
  
  stats.shard_cost -= expansionSpent.shard;
  stats.goods_cost -= expansionSpent.goods;
  
  stats.coin_cost   += producedTotals.coin;
  stats.hammer_cost += producedTotals.hammer;
  stats.goods_cost  += producedTotals.goods;
  
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
  
  lastCalculatedStats = stats;
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
    shard_cost: document.getElementById('stat-shard-cost'),
    goods_cost: document.getElementById('stat-goods-cost'),
    kd_capacity: document.getElementById('stat-kd-capacity')
  };
  
  const hudCoins = document.getElementById('hud-coins');
  if (hudCoins) hudCoins.textContent = Math.round(stats.coin_cost).toLocaleString('ru-RU');
  const hudHammers = document.getElementById('hud-hammers');
  if (hudHammers) hudHammers.textContent = Math.round(stats.hammer_cost).toLocaleString('ru-RU');
  const hudChrono = document.getElementById('hud-chrono');
  if (hudChrono) hudChrono.textContent = Math.round(stats.chrono_cost).toLocaleString('ru-RU');
  const hudShards = document.getElementById('hud-shards');
  if (hudShards) hudShards.textContent = Math.round(stats.shard_cost).toLocaleString('ru-RU');
  const hudGoods = document.getElementById('hud-goods');
  if (hudGoods) hudGoods.textContent = Math.round(stats.goods_cost).toLocaleString('ru-RU');
  
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
      displayValue = Math.round(finalValue).toLocaleString('ru-RU');
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
 
  lines.forEach(line => {
    const parts = line.split('\t');
    if (parts.length < 2) return;
    const srcX = parseInt(parts[0]);
    const srcY = parseInt(parts[1]);

    if (isNaN(srcX) || isNaN(srcY)) return;

    const colKvag = 27 - srcY - 4 + 1;
    const rowKvag = srcX;

    for (let dr = 0; dr < 4; dr++) {
      for (let dc = 0; dc < 4; dc++) {
        const r = rowKvag + dr;
        const c = colKvag + dc;
        if (r < 0 || r >= 28 || c < 0 || c >= 28) continue;
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

let initialCityDataText = null;

function placeCityDataFromText(rawText) {
  rawText = (rawText || '').trim();
  if (!rawText) return;

  const OPEN_CELLS_MARKER = '###OPENCELLS###';
  const markerIndex = rawText.indexOf(OPEN_CELLS_MARKER);
  const text = markerIndex === -1 ? rawText : rawText.slice(0, markerIndex).trim();
  const openCellsText = markerIndex === -1 ? '' : rawText.slice(markerIndex + OPEN_CELLS_MARKER.length).trim();

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

    const heightCells = parseInt(parts[0]);
    const widthCells  = parseInt(parts[1]);
    const srcX        = parseInt(parts[2]);
    const srcY        = parseInt(parts[3]);
    const foeNameRaw  = (parts[4] || '').trim();
    const qiClass     = (parts[5] || '').trim();

    if (isNaN(widthCells) || isNaN(heightCells) || isNaN(srcX) || isNaN(srcY)) return;

    const colKvag = 27 - srcY - widthCells + 1;
    const rowKvag = srcX;

    if (colKvag < 0 || rowKvag < 0 || colKvag + widthCells > 28 || rowKvag + heightCells > 28) {
      skipped++;
      return;
    }

    const leftPx   = colKvag * 30;
    const topPx    = rowKvag * 30;
    const widthPx  = widthCells * 30;
    const heightPx = heightCells * 30;

    const figureClass = qiClassToFigureClass[qiClass] || null;

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

    createFigureWithClass(buildingName, widthPx, heightPx, leftPx, topPx, figureClass);
    placed++;
  });

  if (openCellsText) {
    applyOpenCellsFromGame(openCellsText);
  }

  calculateBonuses();

  const bldModal = document.getElementById('bldCountModal');
  if (bldModal && bldModal.style.display !== 'none') updateBldCount();

  if (skipped > 0) {
    console.info(`Старт: размещено ${placed}, пропущено (за пределами поля) ${skipped}`);
  }
}

function restartInitialCityData() {
  if (initialCityDataText) {
    placeCityDataFromText(initialCityDataText);
    return;
  }

  document.querySelectorAll('.figure').forEach(fig => {
    if (fig.dataset.blinkInterval) clearInterval(fig.dataset.blinkInterval);
    fig.remove();
  });
  createTownHall();
  calculateBonuses();

  const bldModal = document.getElementById('bldCountModal');
  if (bldModal && bldModal.style.display !== 'none') updateBldCount();
}

function applyOpenCellsFromGame(openCellsText) {
  for (let i = 0; i < totalCells; i++) {
    const row = Math.floor(i / 28);
    const col = i % 28;
    if (!isInGrayArea(col * 30, row * 30, 1, 1)) {
      const cell = grid.children[i];
      cell.textContent = 'X';
      initialCellStates[i] = 'X';
    }
  }

  const openCell = (rowKvag, colKvag) => {
    if (rowKvag < 0 || rowKvag >= 28 || colKvag < 0 || colKvag >= 28) return false;
    if (isInGrayArea(colKvag * 30, rowKvag * 30, 1, 1)) return false;
    const cellIndex = rowKvag * 28 + colKvag;
    const cell = grid.children[cellIndex];
    if (!cell) return false;
    cell.textContent = '';
    initialCellStates[cellIndex] = '';
    return true;
  };

  let applied = 0;
  const BLOCK = 4;
  openCellsText.split('\n').forEach(line => {
    const parts = line.split('\t');
    if (parts.length < 2) return;
    const left = parseInt(parts[0]);
    const top = parseInt(parts[1]);
    if (isNaN(left) || isNaN(top)) return;

    const colKvag = 27 - top - BLOCK + 1;
    const rowKvag = left;

    for (let dy = 0; dy < BLOCK; dy++) {
      for (let dx = 0; dx < BLOCK; dx++) {
        if (openCell(rowKvag + dy, colKvag + dx)) applied++;
      }
    }
  });

  document.querySelectorAll('.figure').forEach(figure => {
    const figLeft = parseInt(figure.style.left) / 30;
    const figTop = parseInt(figure.style.top) / 30;
    const figWidth = parseInt(figure.style.width) / 30;
    const figHeight = parseInt(figure.style.height) / 30;
    if ([figLeft, figTop, figWidth, figHeight].some(isNaN)) return;

    for (let dy = 0; dy < figHeight; dy++) {
      for (let dx = 0; dx < figWidth; dx++) {
        if (openCell(figTop + dy, figLeft + dx)) applied++;
      }
    }
  });

  whiteCellsCount = countWhiteCells();
  if (applied === 0) {
    console.info('Открытая территория: данные не пришли или не распознаны, оставлена стандартная зона.');
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
    soldPenalty: soldPenalty,
    expansionSpent: expansionSpent,
    clearedCellsHistory: clearedCellsHistory,
    virtualExpansions: virtualExpansions,
    gameTimeHours: gameTimeHours,
    producedTotals: producedTotals,
    productionStatSnapshots: productionStatSnapshots,
    timestamp: Date.now(),
    version: "1.0",
    app: "kvant"
  };
}

// ============================================
// ЭКСПОРТ В XLSX
// ============================================
const XLSX_CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function xlsxCrc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = XLSX_CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function xlsxStrToBytes(str) {
  return new TextEncoder().encode(str);
}

function xlsxConcatBytes(arrays) {
  let total = 0;
  arrays.forEach(a => total += a.length);
  const result = new Uint8Array(total);
  let offset = 0;
  arrays.forEach(a => { result.set(a, offset); offset += a.length; });
  return result;
}

function xlsxUint16(value) {
  const b = new Uint8Array(2);
  new DataView(b.buffer).setUint16(0, value, true);
  return b;
}
function xlsxUint32(value) {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, value >>> 0, true);
  return b;
}

function xlsxBuildZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const DOS_TIME = 0, DOS_DATE = 0x21;

  files.forEach(file => {
    const nameBytes = xlsxStrToBytes(file.name);
    const data = file.data;
    const crc = xlsxCrc32(data);

    const localHeader = xlsxConcatBytes([
      xlsxUint32(0x04034b50), xlsxUint16(20), xlsxUint16(0), xlsxUint16(0),
      xlsxUint16(DOS_TIME), xlsxUint16(DOS_DATE),
      xlsxUint32(crc), xlsxUint32(data.length), xlsxUint32(data.length),
      xlsxUint16(nameBytes.length), xlsxUint16(0)
    ]);
    const localPart = xlsxConcatBytes([localHeader, nameBytes, data]);
    localParts.push(localPart);

    const centralHeader = xlsxConcatBytes([
      xlsxUint32(0x02014b50), xlsxUint16(20), xlsxUint16(20), xlsxUint16(0), xlsxUint16(0),
      xlsxUint16(DOS_TIME), xlsxUint16(DOS_DATE),
      xlsxUint32(crc), xlsxUint32(data.length), xlsxUint32(data.length),
      xlsxUint16(nameBytes.length), xlsxUint16(0), xlsxUint16(0), xlsxUint16(0), xlsxUint16(0),
      xlsxUint32(0), xlsxUint32(offset)
    ]);
    centralParts.push(xlsxConcatBytes([centralHeader, nameBytes]));

    offset += localPart.length;
  });

  const centralDirStart = offset;
  const centralDir = xlsxConcatBytes(centralParts);

  const end = xlsxConcatBytes([
    xlsxUint32(0x06054b50), xlsxUint16(0), xlsxUint16(0),
    xlsxUint16(files.length), xlsxUint16(files.length),
    xlsxUint32(centralDir.length), xlsxUint32(centralDirStart), xlsxUint16(0)
  ]);

  return xlsxConcatBytes([...localParts, centralDir, end]);
}

function xlsxEscapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xlsxColLetter(n) {
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function xlsxBuildSheetXml(rows) {
  let rowsXml = '';
  rows.forEach((row, rIdx) => {
    const r = rIdx + 1;
    let cellsXml = '';
    row.forEach((val, cIdx) => {
      const ref = xlsxColLetter(cIdx + 1) + r;
      if (typeof val === 'number' && isFinite(val)) {
        cellsXml += `<c r="${ref}"><v>${val}</v></c>`;
      } else {
        cellsXml += `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xlsxEscapeXml(val)}</t></is></c>`;
      }
    });
    rowsXml += `<row r="${r}">${cellsXml}</row>`;
  });

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${rowsXml}</sheetData>
</worksheet>`;
}

function buildXlsxFile(sheetName, rows) {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${xlsxEscapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const sheet1 = xlsxBuildSheetXml(rows);

  const files = [
    { name: '[Content_Types].xml', data: xlsxStrToBytes(contentTypes) },
    { name: '_rels/.rels', data: xlsxStrToBytes(rootRels) },
    { name: 'xl/workbook.xml', data: xlsxStrToBytes(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: xlsxStrToBytes(workbookRels) },
    { name: 'xl/worksheets/sheet1.xml', data: xlsxStrToBytes(sheet1) }
  ];

  return xlsxBuildZip(files);
}

function exportProductionStatsToXlsx() {
  if (productionStatSnapshots.length === 0) {
    alert('Таблица пуста — сначала добавьте записи кнопкой "+ стат".');
    return;
  }

  const rows = [
    ['Время', 'Монеты', 'Молотки', 'Товар', 'Осколки']
  ];
  productionStatSnapshots.forEach(s => {
    rows.push([formatGameTime(s.timeHours), s.coin, s.hammer, s.goods, s.shard]);
  });

  const bytes = buildXlsxFile('Статистика', rows);
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'production-stats.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function saveToFile() {
  const saveData = getSaveData();
  const jsonString = JSON.stringify(saveData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kvaplan.txt';
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
        coin_initial: 450000, hammer_initial: 75000, chrono_initial: 0, shard_initial: 500, goods_initial: 100, kd_capacity: 200000
      };
      
      soldPenalty = data.soldPenalty || { coin: 0, hammer: 0, chrono: 0 };
      expansionSpent = {
        shard: (data.expansionSpent && data.expansionSpent.shard) || 0,
        goods: (data.expansionSpent && data.expansionSpent.goods) || 0
      };
      clearedCellsHistory = Array.isArray(data.clearedCellsHistory) ? data.clearedCellsHistory : [];
      virtualExpansions = {
        shard: (data.virtualExpansions && data.virtualExpansions.shard) || 0,
        goods: (data.virtualExpansions && data.virtualExpansions.goods) || 0
      };
      
      gameTimeHours = Number(data.gameTimeHours) || 0;
      producedTotals = {
        coin:   (data.producedTotals && data.producedTotals.coin)   || 0,
        hammer: (data.producedTotals && data.producedTotals.hammer) || 0,
        goods:  (data.producedTotals && data.producedTotals.goods)  || 0
      };
      productionStatSnapshots = Array.isArray(data.productionStatSnapshots) ? data.productionStatSnapshots : [];
      updateGameTimeDisplay();
      renderProductionStatsTable();
      
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
      const chronoInitInput = document.getElementById('townHall-chrono-initial');
      if (chronoInitInput) chronoInitInput.value = townHallBonuses.chrono_initial ?? 0;
      const shardInitInput = document.getElementById('townHall-shard-initial');
      if (shardInitInput) shardInitInput.value = townHallBonuses.shard_initial ?? 0;
      const goodsInitInput = document.getElementById('townHall-goods-initial');
      if (goodsInitInput) goodsInitInput.value = townHallBonuses.goods_initial ?? 0;
      
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
      refreshAllVirtualCountDisplays();
      
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
  rebuildCityProfileSelect();
  applyProfileToInputs(townHallBonuses);
}

function closeTownHallModal() {
  const modal = document.getElementById('townHallModal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// ПРОФИЛИ ГОРОДОВ
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
  set('townHall-chrono-initial',     profile.chrono_initial      ?? 0);
  set('townHall-shard-initial',      profile.shard_initial       ?? 0);
  set('townHall-goods-initial',      profile.goods_initial       ?? 0);
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
    chrono_initial:      get('townHall-chrono-initial', 0),
    shard_initial:       get('townHall-shard-initial', 0),
    goods_initial:       get('townHall-goods-initial', 0),
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
  
  modal.style.resize = 'both';
  modal.style.overflow = 'auto';
  modal.style.minWidth = '320px';
  modal.style.minHeight = '200px';
  
  modal.style.display = 'block';
  modal.style.left = `${window.innerWidth - modal.offsetWidth - 330}px`;
  modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
  
  makeDraggable(modal);
}

function updateBldCount() {
  const map = {};
  let totalExpansionsPlaced = 0;
  
  document.querySelectorAll('.figure').forEach(fig => {
    const name = fig.dataset.name;
    if (fig.dataset.expansionType) {
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
  
  const goodsPurchased = clearedCellsHistory.filter(h => h.expansionType === 'goods').length;
  const shardPurchased = clearedCellsHistory.filter(h => h.expansionType === 'shard').length;
  
  const content = document.getElementById('bldCountContent');
  if (!content) return;
  
  let html = `
    <div class="expansions-section">
      <strong>📐 Расширения</strong>
      <div class="expansions-stats">
        <div>📦 Поставлено: <span>${placedExpansions}</span></div>
        <div>🏠 Базовых: <span>12</span></div>
        <div>🔓 Всего открыто: <span>${totalOpen}</span></div>
        <div>📦 За товар: <span>${goodsPurchased}/${EXPANSION_GOODS_COSTS.length}</span></div>
        <div>💎 За осколки: <span>${shardPurchased}/${EXPANSION_SHARD_COSTS.length}</span></div>
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
  
  if (sellMode) toggleSellMode();
  if (productionMode) toggleProductionMode();
  if (collectionMode) toggleCollectionMode();
  
  deleteMode = !deleteMode;
  
  if (deleteMode) {
    deleteButton.textContent = 'Отмена удаления';
    deleteButton.style.backgroundColor = '#ff4444';
    deleteButton.style.color = 'white';
    grid.classList.add('delete-mode');
    grid.style.cursor = 'crosshair';
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

function toggleSellMode() {
  const sellButton = document.getElementById('sellButton');
  if (!sellButton) return;
  
  if (deleteMode) toggleDeleteMode();
  if (productionMode) toggleProductionMode();
  if (collectionMode) toggleCollectionMode();
  
  sellMode = !sellMode;
  
  if (sellMode) {
    sellButton.textContent = 'Отмена продажи';
    sellButton.style.backgroundColor = '#28a745';
    sellButton.style.color = 'white';
    grid.classList.add('sell-mode');
    grid.style.cursor = 'crosshair';
    grid.addEventListener('click', handleSellClick, true);
  } else {
    sellButton.textContent = 'Продать здание';
    sellButton.style.backgroundColor = '';
    sellButton.style.color = 'black';
    grid.classList.remove('sell-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleSellClick, true);
  }
}

function handleSellClick(event) {
  const figure = event.target.closest('.figure');
  if (figure && figure.dataset.name !== 'Ратуша') {
    event.stopPropagation();
    
    const building = buildingData.find(b => b.name === figure.dataset.name);
    if (building && building.bonuses) {
      soldPenalty.coin   += (Number(building.bonuses.coin_cost)   || 0) * 0.75;
      soldPenalty.hammer += (Number(building.bonuses.hammer_cost) || 0) * 0.75;
      soldPenalty.chrono += (Number(building.bonuses.chrono_cost) || 0) * 0.75;
    }
    
    if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
    figure.remove();
    calculateBonuses();
  }
}

function toggleProductionMode() {
  const btn = document.getElementById('productionButton');
  if (!btn) return;
  
  if (deleteMode) toggleDeleteMode();
  if (sellMode) toggleSellMode();
  if (collectionMode) toggleCollectionMode();
  
  productionMode = !productionMode;
  
  if (productionMode) {
    btn.textContent = 'Отмена пр-ва';
    btn.style.backgroundColor = '#2266cc';
    btn.style.color = 'white';
    grid.classList.add('production-mode');
    grid.style.cursor = 'crosshair';
    grid.addEventListener('click', handleProductionClick, true);
  } else {
    btn.textContent = 'Пр-во';
    btn.style.backgroundColor = '';
    btn.style.color = 'black';
    grid.classList.remove('production-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleProductionClick, true);
  }
}

function handleProductionClick(event) {
  const figure = event.target.closest('.figure');
  if (!figure || figure.dataset.name === 'Ратуша') return;
  event.stopPropagation();
  
  const building = buildingData.find(b => b.name === figure.dataset.name);
  if (!building || !PRODUCTION_ELIGIBLE_CATEGORIES.includes(building.category)) return;
  
  if (figure.classList.contains('in-production')) return;
  
  figure.classList.add('in-production');
  figure.dataset.productionStart = String(gameTimeHours);
  
  if (building.category === 'Товар') {
    producedTotals.coin   -= GOODS_RUN_COST.coin;
    producedTotals.hammer -= GOODS_RUN_COST.hammer;
    calculateBonuses();
  }
}

function toggleCollectionMode() {
  const btn = document.getElementById('collectionButton');
  if (!btn) return;
  
  if (deleteMode) toggleDeleteMode();
  if (sellMode) toggleSellMode();
  if (productionMode) toggleProductionMode();
  
  collectionMode = !collectionMode;
  
  if (collectionMode) {
    btn.textContent = 'Отмена сбора';
    btn.style.backgroundColor = '#cc8822';
    btn.style.color = 'white';
    grid.classList.add('collection-mode');
    grid.style.cursor = 'crosshair';
    grid.addEventListener('click', handleCollectionClick, true);
  } else {
    btn.textContent = 'Сбор';
    btn.style.backgroundColor = '';
    btn.style.color = 'black';
    grid.classList.remove('collection-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleCollectionClick, true);
  }
}

function handleCollectionClick(event) {
  const figure = event.target.closest('.figure');
  if (!figure || !figure.classList.contains('in-production')) return;
  event.stopPropagation();
  
  const building = buildingData.find(b => b.name === figure.dataset.name);
  if (!building) return;
  
  if (building.category === 'Товар') {
    producedTotals.goods += GOODS_YIELD_PER_RUN;
    figure.classList.remove('in-production');
    delete figure.dataset.productionStart;
    calculateBonuses();
    return;
  }
  
  const startTime = Number(figure.dataset.productionStart) || 0;
  const elapsed = gameTimeHours - startTime;
  if (elapsed < PRODUCTION_CYCLE_HOURS) {
    const remaining = Math.round(PRODUCTION_CYCLE_HOURS - elapsed);
    alert(`Ещё не готово — осталось ${remaining} ч. игрового времени (кнопка "+10 часов").`);
    return;
  }
  
  if (building.category === 'Жилые') {
    producedTotals.coin += Math.round(Number(building.bonuses.coin_production) || 0);
  } else if (building.category === 'Молотки') {
    producedTotals.hammer += Math.round(Number(building.bonuses.hammer_production) || 0);
  } else {
    return;
  }
  
  figure.classList.remove('in-production');
  delete figure.dataset.productionStart;
  calculateBonuses();
}

function formatGameTime(hours) {
  const totalHours = Math.max(0, Math.round(hours));
  const days = Math.floor(totalHours / 24);
  const hrs = totalHours % 24;
  return `${days}д ${hrs}ч`;
}

function updateGameTimeDisplay() {
  const el = document.getElementById('gameTimeDisplay');
  if (el) el.textContent = formatGameTime(gameTimeHours);
}

function addGameHours(hours) {
  gameTimeHours += hours;
  updateGameTimeDisplay();
}

function addProductionStatSnapshot() {
  const stats = lastCalculatedStats || {};
  productionStatSnapshots.push({
    timeHours: gameTimeHours,
    coin:   Math.round(stats.coin_cost   || 0),
    hammer: Math.round(stats.hammer_cost || 0),
    goods:  Math.round(stats.goods_cost  || 0),
    shard:  Math.round(stats.shard_cost  || 0)
  });
  renderProductionStatsTable();
}

function renderProductionStatsTable() {
  const tbody = document.getElementById('production-stats-tbody');
  if (!tbody) return;
  
  if (productionStatSnapshots.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#999; padding:15px;">Пока нет записей — нажмите "+ стат"</td></tr>`;
    return;
  }
  
  tbody.innerHTML = productionStatSnapshots.map(s => `
    <tr>
      <td>${formatGameTime(s.timeHours)}</td>
      <td>${s.coin.toLocaleString('ru-RU')}</td>
      <td>${s.hammer.toLocaleString('ru-RU')}</td>
      <td>${s.goods.toLocaleString('ru-RU')}</td>
      <td>${s.shard.toLocaleString('ru-RU')}</td>
    </tr>
  `).join('');
}

function clearProductionStats() {
  if (productionStatSnapshots.length > 0 && !confirm('Очистить всю таблицу статистики производства?')) return;
  productionStatSnapshots = [];
  renderProductionStatsTable();
}

function openProductionStatsModal() {
  renderProductionStatsTable();
  const modal = document.getElementById('productionStatsModal');
  if (!modal) return;
  modal.style.display = 'block';
  modal.style.left = `${(window.innerWidth - modal.offsetWidth) / 2}px`;
  modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
  if (parseInt(modal.style.top) < 20) modal.style.top = '20px';
  makeDraggable(modal);
}

function closeProductionStatsModal() {
  const modal = document.getElementById('productionStatsModal');
  if (modal) modal.style.display = 'none';
}

function resetFigures() {
  document.querySelectorAll('.figure').forEach(figure => {
    if (figure.dataset.name !== 'Ратуша') {
      if (figure.dataset.blinkInterval) clearInterval(figure.dataset.blinkInterval);
      figure.remove();
    }
  });
  
  if (selectedLiElement) {
    selectedLiElement.classList.remove('active');
  }
  selectedBuilding = null;
  selectedLiElement = null;
  
  if (ghostFigure) {
    ghostFigure.remove();
    ghostFigure = null;
  }
  grid.removeEventListener('mousemove', handleGhostMove);
  
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
    grid.removeEventListener('click', handleDeleteClick, true);
  }
  
  if (sellMode) {
    sellMode = false;
    const sellButton = document.getElementById('sellButton');
    if (sellButton) {
      sellButton.textContent = 'Продать здание';
      sellButton.style.backgroundColor = '';
      sellButton.style.color = 'black';
    }
    grid.classList.remove('sell-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleSellClick, true);
  }
  
  if (productionMode) {
    productionMode = false;
    const productionButton = document.getElementById('productionButton');
    if (productionButton) {
      productionButton.textContent = 'Пр-во';
      productionButton.style.backgroundColor = '';
      productionButton.style.color = 'black';
    }
    grid.classList.remove('production-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleProductionClick, true);
  }
  
  if (collectionMode) {
    collectionMode = false;
    const collectionButton = document.getElementById('collectionButton');
    if (collectionButton) {
      collectionButton.textContent = 'Сбор';
      collectionButton.style.backgroundColor = '';
      collectionButton.style.color = 'black';
    }
    grid.classList.remove('collection-mode');
    grid.style.cursor = '';
    grid.removeEventListener('click', handleCollectionClick, true);
  }
  
  soldPenalty = { coin: 0, hammer: 0, chrono: 0 };
  
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
  
  townHallBonuses = {
    od: 0,
    coin_acceleration: 0,
    hammer_acceleration: 0,
    coin_initial: 450000,
    hammer_initial: 75000,
    chrono_initial: 0,
    shard_initial: 500,
    goods_initial: 100,
    kd_capacity: 200000
  };
  
  const odInput = document.getElementById('townHall-od');
  if (odInput) odInput.value = 0;
  const coinAccInput = document.getElementById('townHall-coin-acceleration');
  if (coinAccInput) coinAccInput.value = 0;
  const hammerAccInput = document.getElementById('townHall-hammer-acceleration');
  if (hammerAccInput) hammerAccInput.value = 0;
  const coinInitInput = document.getElementById('townHall-coin-initial');
  if (coinInitInput) coinInitInput.value = 450000;
  const hammerInitInput = document.getElementById('townHall-hammer-initial');
  if (hammerInitInput) hammerInitInput.value = 75000;
  const chronoInitInput = document.getElementById('townHall-chrono-initial');
  if (chronoInitInput) chronoInitInput.value = 0;
  const shardInitInput = document.getElementById('townHall-shard-initial');
  if (shardInitInput) shardInitInput.value = 500;
  const goodsInitInput = document.getElementById('townHall-goods-initial');
  if (goodsInitInput) goodsInitInput.value = 100;
  const kdInput = document.getElementById('townHall-kd-capacity');
  if (kdInput) kdInput.value = 200000;
  
  whiteCellsCount = countWhiteCells();
  calculateBonuses();
  
  clearedCellsHistory = [];
  expansionSpent = { shard: 0, goods: 0 };
  virtualExpansions = { resource: 0, shard: 0, goods: 0 };
  refreshAllVirtualCountDisplays();
  
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
// ПОВОРОТ ВИДА КАРТЫ
// ============================================
const areasOriginal = [
  { colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 16, color: '#ccc' },
  { colStart: 5, colEnd: 8, rowStart: 1, rowEnd: 4,  color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 1, rowEnd: 4, color: '#ccc' },
  { colStart: 25, colEnd: 28, rowStart: 21, rowEnd: 28, color: '#ccc' }
];

function rotateArea90CW(area, N) {
  return {
    colStart: N + 1 - area.rowEnd,
    colEnd:   N + 1 - area.rowStart,
    rowStart: area.colStart,
    rowEnd:   area.colEnd,
    color:    area.color
  };
}

function getRotatedAreas(deg) {
  let result = areasOriginal.map(a => ({ ...a }));
  const steps = ((deg / 90) % 4 + 4) % 4;
  for (let i = 0; i < steps; i++) {
    result = result.map(a => rotateArea90CW(a, 28));
  }
  return result;
}

function rotateFigure90CW(left, top, widthPx, heightPx, N, cellSize) {
  const col = left / cellSize;
  const row = top / cellSize;
  const w   = widthPx / cellSize;
  const h   = heightPx / cellSize;

  const newCol = row;
  const newRow = (N - 1) - col - w + 1;

  return {
    left:   newCol * cellSize,
    top:    newRow * cellSize,
    width:  heightPx,
    height: widthPx
  };
}

function rotateViewStep() {
  const N = 28;
  const CELL = 30;

  const xCells = [];
  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    if (cell && cell.textContent === 'X') {
      const row = Math.floor(i / N);
      const col = i % N;
      xCells.push({ row, col });
      cell.textContent = '';
    }
  }
  xCells.forEach(({ row, col }) => {
    const newCol = row;
    const newRow = (N - 1) - col;
    const idx = newRow * N + newCol;
    if (idx >= 0 && idx < totalCells) {
      grid.children[idx].textContent = 'X';
    }
  });

  document.querySelectorAll('.figure').forEach(fig => {
    const left   = parseInt(fig.style.left);
    const top    = parseInt(fig.style.top);
    const width  = parseInt(fig.style.width);
    const height = parseInt(fig.style.height);

    const r = rotateFigure90CW(left, top, width, height, N, CELL);
    fig.style.left   = r.left   + 'px';
    fig.style.top    = r.top    + 'px';
    fig.style.width  = r.width  + 'px';
    fig.style.height = r.height + 'px';
  });

  currentRotation = (currentRotation + 270) % 360;
  const newAreas = getRotatedAreas(currentRotation);
  areas.length = 0;
  newAreas.forEach(a => areas.push(a));

  for (let i = 0; i < totalCells; i++) {
    const cell = grid.children[i];
    if (!cell) continue;
    const row = Math.floor(i / N) + 1;
    const col = (i % N) + 1;

    let inGray = false;
    for (const area of areas) {
      if (col >= area.colStart && col <= area.colEnd &&
          row >= area.rowStart && row <= area.rowEnd) {
        inGray = true;
        break;
      }
    }
    cell.style.backgroundColor = inGray ? '#ccc' : '#fff';
  }

  if (typeof updateBldCount === 'function') updateBldCount();
  if (typeof calculateBonuses === 'function') calculateBonuses();
}

let isViewRotatedOnce = false;

function rotateView() {
  rotateViewStep();
  if (!isViewRotatedOnce) {
    isViewRotatedOnce = true;
  } else {
    rotateViewStep();
    rotateViewStep();
    isViewRotatedOnce = false;
  }
}

// ============================================
// ЗАПУСК
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  
  if (!grid || !tabContentContainer) {
    console.error('Критические элементы не найдены!');
    return;
  }
  
  initGrid();
  createTownHall();
  createMenu();

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
        chrono_initial:      profile.chrono_initial      ?? 0,
        shard_initial:       profile.shard_initial       ?? 0,
        goods_initial:       profile.goods_initial       ?? 0,
        kd_capacity:         profile.kd_capacity         ?? 200000
      };
    }
  } catch(e) {}

  calculateBonuses();

  // В EXE-версии нет chrome.storage — просто работаем как пустой редактор
  // (ранее здесь был импорт данных из расширения Chrome).

  const startBtn = document.getElementById('btnStart');
  if (startBtn) startBtn.addEventListener('click', restartInitialCityData);

  const resetFiguresBtn = document.getElementById('resetFiguresBtn');
  if (resetFiguresBtn) resetFiguresBtn.addEventListener('click', resetFigures);
  
  const resetToInitialBtn = document.getElementById('resetToInitialBtn');
  if (resetToInitialBtn) resetToInitialBtn.addEventListener('click', resetToInitialState);
  
  const deleteBtn = document.getElementById('deleteButton');
  if (deleteBtn) deleteBtn.addEventListener('click', toggleDeleteMode);
  
  const sellBtn = document.getElementById('sellButton');
  if (sellBtn) sellBtn.addEventListener('click', toggleSellMode);
  
  const productionBtn = document.getElementById('productionButton');
  if (productionBtn) productionBtn.addEventListener('click', toggleProductionMode);
  
  const collectionBtn = document.getElementById('collectionButton');
  if (collectionBtn) collectionBtn.addEventListener('click', toggleCollectionMode);
  
  const add10hBtn = document.getElementById('add10hButton');
  if (add10hBtn) add10hBtn.addEventListener('click', () => addGameHours(10));
  
  const addStatBtn = document.getElementById('addStatButton');
  if (addStatBtn) addStatBtn.addEventListener('click', addProductionStatSnapshot);
  
  const productionStatsBtn = document.getElementById('productionStatsBtn');
  if (productionStatsBtn) productionStatsBtn.addEventListener('click', openProductionStatsModal);
  
  const closeProductionStatsBtn = document.getElementById('closeProductionStatsBtn');
  if (closeProductionStatsBtn) closeProductionStatsBtn.addEventListener('click', closeProductionStatsModal);
  
  const closeProductionStatsBtn2 = document.getElementById('closeProductionStatsBtn2');
  if (closeProductionStatsBtn2) closeProductionStatsBtn2.addEventListener('click', closeProductionStatsModal);
  
  const clearProductionStatsBtn = document.getElementById('clearProductionStatsBtn');
  if (clearProductionStatsBtn) clearProductionStatsBtn.addEventListener('click', clearProductionStats);
  
  const exportProductionStatsBtn = document.getElementById('exportProductionStatsBtn');
  if (exportProductionStatsBtn) exportProductionStatsBtn.addEventListener('click', exportProductionStatsToXlsx);
  
  updateGameTimeDisplay();
  
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
  
  const rotateBtn = document.getElementById('rotateBtn');
  if (rotateBtn) rotateBtn.addEventListener('click', rotateView);

  const feedbackBtn = document.getElementById('feedbackBtn');
  if (feedbackBtn) feedbackBtn.addEventListener('click', openFeedbackLink);
  
  const closeBuildingInfoBtn = document.getElementById('closeBuildingInfoBtn');
  if (closeBuildingInfoBtn) closeBuildingInfoBtn.addEventListener('click', closeBuildingInfoModal);
  
  const minimizeStatsBtn = document.getElementById('minimizeStatsBtn');
  if (minimizeStatsBtn) minimizeStatsBtn.addEventListener('click', toggleStatisticsMinimize);

  // Обработчик кликов по сетке для расстановки зданий
  grid.addEventListener('click', (e) => {
    if (deleteMode) {
      return;
    }
    
    if (!selectedBuilding) return;
    
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return;
    
    const col = Math.floor(x / 30);
    const row = Math.floor(y / 30);
    
    if (col < 0 || col >= 28 || row < 0 || row >= 28) return;
    
    let [widthCells, heightCells] = getEffectiveSize(...selectedBuilding.size.split('x').map(Number));
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