// i18n.js — переключатель языков
// Файлы переводов: /locales/ru.json, /locales/en.json и т.д.

const I18N_DEFAULT_LANG = 'ru';
const I18N_LOCALES_PATH = '/locales/';

async function i18nLoad(lang) {
  try {
    const res = await fetch(I18N_LOCALES_PATH + lang + '.json');
    if (!res.ok) throw new Error('Файл не найден: ' + lang + '.json');
    return await res.json();
  } catch (e) {
    console.warn('[i18n] Не удалось загрузить язык:', lang, e);
    return null;
  }
}

async function i18nApply(lang) {
  const t = await i18nLoad(lang);
  if (!t) return;

  // Сохраняем переводы глобально для JS-скриптов
  window._i18nT = t;

  // Текстовое содержимое
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Placeholder (поля ввода)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Alt (картинки)
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.dataset.i18nAlt;
    if (t[key] !== undefined) el.alt = t[key];
  });

  // Title (тултипы)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    if (t[key] !== undefined) el.title = t[key];
  });

  // Атрибут lang у <html>
  document.documentElement.lang = lang;

  // Сохраняем выбор
  localStorage.setItem('lang', lang);
  document.dispatchEvent(new Event('i18nApplied'));

  // Обновляем активную кнопку переключателя
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });
}

function i18nSwitchTo(lang) {
  i18nApply(lang);
}

// Автозапуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang');
  const browser = navigator.language?.slice(0, 2) || I18N_DEFAULT_LANG;
  const lang = saved || browser;
  i18nApply(lang);
});
