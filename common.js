(function () {
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const CACHE_KEY = 'klubec2-fragments-v1';

  function updateFavicon() {
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = darkModeMedia.matches ? 'logo_biale.png' : 'logo_czarne.png';
    }
  }

  function readCache(url) {
    try {
      const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
      return typeof cache[url] === 'string' ? cache[url] : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(url, html) {
    try {
      const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
      cache[url] = html;
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
    }
  }

  async function fetchFragment(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const html = await res.text();
    writeCache(url, html);
    return html;
  }

  async function loadFragment(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    const cached = readCache(url);
    if (cached !== null) {
      el.innerHTML = cached;
      fetchFragment(url).catch(function () {});
      return;
    }
    try {
      el.innerHTML = await fetchFragment(url);
    } catch (e) {
      console.error('Nie udało się załadować ' + url, e);
    }
  }

  function initNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        const open = navLinks.dataset.open === 'true';
        navLinks.dataset.open = String(!open);
        navToggle.setAttribute('aria-expanded', String(!open));
        navToggle.textContent = !open ? '✕' : '☰';
      });
    }
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#navLinks a').forEach(function (a) {
      if (a.getAttribute('href') === current) a.classList.add('active');
    });
    updateFavicon();
  }

  function start() {
    const headerLoaded = loadFragment('#header-placeholder', 'header.html');
    loadFragment('#footer-placeholder', 'footer.html');
    headerLoaded.then(initNav);
    darkModeMedia.addEventListener('change', updateFavicon);
    updateFavicon();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
