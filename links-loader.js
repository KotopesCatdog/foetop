let linksCache = null;

// Загрузка базы ссылок
async function loadLinksDB() {
  if (linksCache) return linksCache;
  
  try {
    const response = await fetch('/links-db.json?t=' + Date.now());
    if (!response.ok) throw new Error('Ошибка загрузки базы ссылок');
    linksCache = await response.json();
    return linksCache;
  } catch (error) {
    console.error('Ошибка загрузки ссылок:', error);
    return null;
  }
}

// Получить ссылку по ключу
async function getLink(key) {
  const db = await loadLinksDB();
  return db ? db[key] : null;
}

// Открыть ссылку по ключу
async function openLink(key, target = '_blank') {
  const url = await getLink(key);
  if (url) {
    window.open(url, target);
  } else {
    console.error(`Ссылка с ключом "${key}" не найдена`);
  }
}

// Автоматическая обработка всех элементов с data-link-key
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-link-key]').forEach(element => {
    const key = element.getAttribute('data-link-key');
    
    // Если это кнопка или ссылка
    if (element.tagName === 'A') {
      element.href = 'javascript:void(0)';
    }
    
    // Сохраняем оригинальный текст, если нужно показать имя ключа
    if (!element.hasAttribute('data-original-text')) {
      element.setAttribute('data-original-text', element.innerHTML);
    }
    
    // Показываем имя ключа как подсказку (опционально)
    element.setAttribute('title', `Ссылка: ${key}`);
    
    element.addEventListener('click', async (e) => {
      e.preventDefault();
      await openLink(key);
    });
  });
});