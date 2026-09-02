const ERA_NAMES = {
    "NoEra":                 "—",
    "BronzeAge":             "БВ",
    "IronAge":               "ЖВ",
    "EarlyMiddleAge":        "РС",
    "HighMiddleAge":         "ВС",
    "LateMiddleAge":         "ПС",
    "ColonialAge":           "Кол",
    "IndustrialAge":         "Инд",
    "ProgressiveEra":        "Прог",
    "ModernEra":             "Мод",
    "PostModernEra":         "ПМод",
    "ContemporaryEra":       "Нов",
    "TomorrowEra":           "Завт",
    "FutureEra":             "Буд",
    "ArcticFuture":          "Аркт",
    "OceanicFuture":         "Океан",
    "VirtualFuture":         "Вирт",
    "SpaceAgeMars":          "Марс",
    "SpaceAgeAsteroidBelt":  "Пояс",
    "SpaceAgeVenus":         "Вен",
    "SpaceAgeJupiterMoon":   "Юпи",
    "SpaceAgeTitan":         "Тит",
    "SpaceAgeSpaceHub":      "Хаб",
};

function eraName(b) {
    return ERA_NAMES[b.eraName] || b.eraName || "";
}