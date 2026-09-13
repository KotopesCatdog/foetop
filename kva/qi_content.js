// qi_content.js — контент-скрипт квантового планировщика
//
// Модуль редактора (kvag.html/js/data) взят из отдельного расширения
// QI Planner (там он получил режим имитации производства/сбора, экспорт
// в xlsx, кнопку "Старт" с восстановлением исходной застройки и т.д.) -
// подробности см. в самих файлах kvag.*.
//
// Логика кнопки в меню FOEhelp (см. menu_content.js, событие
// 'foeOpenQiPlanner') теперь единая для одной кнопки, без отдельной
// кнопки "пустой редактор":
//   - если на странице сейчас открыто окно "Обзор города" (обычного или
//     квантового - структура разметки у них одна и та же, см. getCityData)
//     и в нём есть здания - планировщик открывается СРАЗУ с этой
//     застройкой;
//   - если окно не открыто (или в нём нет распознаваемых зданий) -
//     вместо ошибки открывается пустой планировщик (как кнопка-молоток
//     в отдельном расширении QI Planner), без каких-либо toast-уведомлений.

(function() {
  'use strict';

  if (window._foeQiPlannerInjected) return;
  window._foeQiPlannerInjected = true;

  // Ключ в chrome.storage.local, через который данные из открытого окна
  // "Обзор города" передаются странице редактора (kvag.html) - она в
  // отдельной вкладке своего chrome-extension:// origin, поэтому
  // localStorage игровой страницы ей не виден, а обычные query-параметры
  // URL плохо подходят для многих килобайт TSV. kvag.js читает этот ключ
  // при загрузке и сразу же удаляет его (см. kvag.js) - чтобы при
  // следующем открытии пустого планировщика впредь не подхватились
  // случайно чужие/старые данные.
  const PENDING_DATA_KEY = 'qipPendingCityData';

  function getCityData() {
    const elements = document.querySelectorAll('span.entity');
    if (elements.length === 0) {
      return { error: 'no_window' };
    }

    const classToColor = {
      'main_building': 'main_building',
      'residential':   'residential',
      'production':    'production',
      'culture':       'culture',
      'goods':         'goods',
      'military':      'military',
      'decoration':    'decoration',
      'impediment':    'impediment',
	  'static_provider': 'static_provider'
    };

    const extractedData = [];
    elements.forEach(element => {
      const title = element.getAttribute('data-original-title') || '';
      const style = element.getAttribute('style') || '';

      const titleClean = title.split('<br>')[0].trim();
      const titleMatch = titleClean.match(/^(.+),\s*(\d+)x(\d+)$/);
      if (!titleMatch) return;

      const name  = titleMatch[1].trim();
      const sizeW = parseInt(titleMatch[2]);
      const sizeH = parseInt(titleMatch[3]);

      const styleMatch = style.match(/width:\s*([\d.]+)em.*?height:\s*([\d.]+)em.*?left:\s*([\d.]+)em.*?top:\s*([\d.]+)em/);
      if (!styleMatch) return;

      const srcX = Math.round(parseFloat(styleMatch[3]));
      const srcY = Math.round(parseFloat(styleMatch[4]));

      const classes = element.className.split(' ');
      let color = 'default';
      for (const cls of classes) {
        if (classToColor[cls]) { color = classToColor[cls]; break; }
      }

      extractedData.push(`${sizeH}\t${sizeW}\t${srcX}\t${srcY}\t${name}\t${color}`);
    });

    if (extractedData.length === 0) {
      return { error: 'no_data' };
    }

    // Открытая территория (по умолчанию доступная или уже купленная) — каждая
    // такая клетка рендерится игрой как <span class="map-bg" style="left:...em; top:...em;">
    // внутри #map-grid. Недоступные (ещё не купленные) клетки такого span не имеют.
    const openCells = [];
    document.querySelectorAll('#map-grid span.map-bg').forEach(span => {
      const style = span.getAttribute('style') || '';
      const leftMatch = style.match(/left:\s*([\d.]+)em/);
      const topMatch  = style.match(/top:\s*([\d.]+)em/);
      if (!leftMatch || !topMatch) return;
      const left = Math.round(parseFloat(leftMatch[1]));
      const top  = Math.round(parseFloat(topMatch[1]));
      openCells.push(`${left}\t${top}`);
    });

    return {
      data: extractedData.join('\n'),
      count: extractedData.length,
      openCellsData: openCells.join('\n')
    };
  }

  function openBlankPlanner() {
    const plannerUrl = chrome.runtime.getURL('src/modules/qi-planner/kvag.html');
    window.open(plannerUrl, '_blank');
  }

  // Обработчик кнопки планировщика в меню FOEhelp: сама кнопка одна,
  // условие - есть открытое окно "Обзор города" с данными или нет.
  function openQiPlannerWithData() {
    const result = getCityData();

    if (result.error) {
      // "Обзор города" не открыт (или в нём не распознано ни одного
      // здания) - вместо ошибки просто открываем пустой планировщик,
      // как кнопка-молоток в отдельном расширении QI Planner.
      openBlankPlanner();
      return;
    }

    const payload = result.openCellsData
      ? `${result.data}\n###OPENCELLS###\n${result.openCellsData}`
      : result.data;

    chrome.storage.local.set({ [PENDING_DATA_KEY]: payload }, () => {
      if (chrome.runtime.lastError) {
        // Реальная (не связанная с отсутствием окна) ошибка - вот тут
        // toast всё ещё уместен.
        window.dispatchEvent(new CustomEvent('FOEhelp_qiPlanResult', { detail: { error: chrome.runtime.lastError.message } }));
        return;
      }
      const plannerUrl = chrome.runtime.getURL('src/modules/qi-planner/kvag.html');
      window.open(plannerUrl, '_blank');
    });
  }

  window.addEventListener('foeOpenQiPlanner', openQiPlannerWithData);

  // Передаём настройки из chrome.storage в page script
  window.addEventListener('FOEhelp_getSettings', () => {
    const world = location.hostname.split('.')[0]; // ru7, en1, etc.
    const key = `foehelpSettings_${world}`;
    chrome.storage.local.get([key], result => {
      const settings = result[key] || {};
      window.dispatchEvent(new CustomEvent('FOEhelp_settingsData', { detail: settings }));
    });
  });

  // Кнопку "QI-Plan" в citymap-mainHeader больше не вставляем - теперь
  // она в собственном меню FOEhelp, которое дёргает foeOpenQiPlanner напрямую.

})();
