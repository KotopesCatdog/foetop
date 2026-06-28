// qi_content.js — контент-скрипт квантового планировщика

(function() {
  'use strict';

  if (window._foeQiPlannerInjected) return;
  window._foeQiPlannerInjected = true;

  function getCityData() {
    const elements = document.querySelectorAll('span.entity');
    if (elements.length === 0) {
      return { error: 'Откройте карту квантового города в хелпере.' };
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
      return { error: 'Не удалось найти данные зданий квантового города.' };
    }

    return { data: extractedData.join('\n'), count: extractedData.length };
  }

  function openQiPlannerWithData() {
    const result = getCityData();
    if (result.error) { alert(result.error); return; }

    navigator.clipboard.writeText(result.data).then(() => {
      const plannerUrl = chrome.runtime.getURL('src/modules/qi-planner/kvag.html');
      window.open(plannerUrl, '_blank');
    }).catch(err => {
      alert('Ошибка копирования: ' + err.message);
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

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/modules/qi-planner/qi_page.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

})();
