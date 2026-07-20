// Йосип Струцюк — сайт письменника
// Перемикач теми + мобільне меню + автоматичне розкриття активного розділу
// + автоматичний рік у футері

(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('strutsiuk-theme', theme); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');

    if (toggle && nav) {
      var toggleIcon = toggle.querySelector('i');
      toggle.addEventListener('click', function () {
        var isOpen = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
        if (toggleIcon) {
          toggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Відкрити меню');
          if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Відкрити меню');
          if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
        }
      });
    }

    // Розкрити всі вкладені <details> меню, що ведуть до поточної сторінки
    var current = document.querySelector('.menu a[aria-current="page"]');
    if (current) {
      var details = current.closest('details');
      while (details) {
        details.open = true;
        details = details.parentElement ? details.parentElement.closest('details') : null;
      }
    }

    // Перемикач теми
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
        updateThemeLabel();
      });
      updateThemeLabel();
    }

    function updateThemeLabel() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var label = themeBtn.querySelector('.theme-label');
      if (label) label.textContent = isDark ? 'Світла тема' : 'Темна тема';
    }

    // Автоматичний кінцевий рік авторського діапазону у футері
    var yearEl = document.getElementById('cur-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Перейменування закладу (ліцей → гімназія) з 1 вересня 2026 —
    // текст у футері та на сторінці "Про сайт" оновлюється сам,
    // без перезбирання сайту, коли настає ця дата.
    var RENAME_DATE = new Date(2026, 8, 1); // місяці в JS з 0, тож 8 = вересень
    if (new Date() >= RENAME_DATE) {
      document.querySelectorAll('#footer-org-name, #lyceum-name').forEach(function (el) {
        el.textContent = el.getAttribute('data-after');
      });
    }

    // Lightbox: перегляд обкладинок і фото галереї в оригінальному розмірі
    var lightboxSelector = '.work-cover-real, .gallery-photo-img, .gallery-cluster-grid img';
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    var overlayImg = document.createElement('img');
    overlay.appendChild(overlayImg);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Закрити перегляд');
    closeBtn.innerHTML = '&times;';
    document.body.appendChild(overlay);
    document.body.appendChild(closeBtn);

    function openLightbox(img) {
      overlayImg.src = img.currentSrc || img.src;
      overlayImg.alt = img.alt || '';
      overlay.classList.add('is-open');
      closeBtn.style.display = 'flex';
      document.body.classList.add('lightbox-active');
    }
    function closeLightbox() {
      overlay.classList.remove('is-open');
      closeBtn.style.display = 'none';
      document.body.classList.remove('lightbox-active');
    }
    closeBtn.style.display = 'none';

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest(lightboxSelector);
      if (trigger) {
        openLightbox(trigger);
        return;
      }
      if (e.target === overlay) {
        closeLightbox();
      }
    });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  });
})();
