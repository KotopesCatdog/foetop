// qi_page.js — кнопка QI-Plan в окне citymap (FoE Helper)
// с проверкой настроек расширения

(function () {
  'use strict';

  if (window._foeQiPlannerLoaded) return;
  window._foeQiPlannerLoaded = true;

  const lang = (navigator.language || 'ru').startsWith('ru') ? 'ru' : 'en';
  const btnText  = 'QI-Plan';
  const btnTitle = lang === 'ru'
    ? 'Скопировать данные города и открыть планировщик квантов'
    : 'Copy city data and open quantum planner';

  function addQiPlannerButton() {
    const header = document.querySelector('#citymap-mainHeader');
    if (!header) return false;
    if (document.getElementById('foe-qi-planner-btn')) return true;

    const btn = document.createElement('div');
    btn.id          = 'foe-qi-planner-btn';
    btn.textContent = btnText;
    btn.title       = btnTitle;

    btn.style.cssText = `
      position: relative;
      padding: 0 12px;
      height: 22px;
      background: #1a2e40;
      border: 1px solid #00cfff;
      border-radius: 3px;
      color: #00cfff;
      font-size: 11px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      font-family: Arial, sans-serif;
      white-space: nowrap;
      z-index: 100;
      margin-right: 4px;
    `;

    btn.onmouseenter = () => btn.style.background = '#2a3e50';
    btn.onmouseleave = () => btn.style.background = '#1a2e40';
    btn.onclick = e => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('foeOpenQiPlanner'));
    };

    const buttonsContainer = header.querySelector('.box-buttons');
    header.insertBefore(btn, buttonsContainer);
    return true;
  }

  function init() {
    let attempts = 0;
    const interval = setInterval(() => {
      if (addQiPlannerButton()) clearInterval(interval);
      else if (attempts++ > 30) clearInterval(interval);
    }, 500);

    const observer = new MutationObserver(() => {
      if (document.querySelector('#citymap-mainHeader')) addQiPlannerButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Проверка настроек ── */
  window.dispatchEvent(new CustomEvent('FOEhelp_getSettings'));
  window.addEventListener('FOEhelp_settingsData', function (e) {
    const s = e.detail || {};
    if (s.showQiButton === false) return;
    init();
  }, { once: true });

})();
