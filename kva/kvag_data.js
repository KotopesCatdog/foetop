// ============================================
// kvag_data.js — данные зданий и переводы бонусов
// ============================================

// Данные зданий
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
    "name": "Расш",
    "display_name": "Расш",
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
