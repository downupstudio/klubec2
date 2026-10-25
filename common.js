(function () {
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function updateFavicon() {
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = darkModeMedia.matches ? 'logo_biale.png' : 'logo_czarne.png';
    }
  }

  async function loadFragment(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      el.innerHTML = await res.text();
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

  document.addEventListener('DOMContentLoaded', async function () {
    await Promise.all([
      loadFragment('#header-placeholder', 'header.html'),
      loadFragment('#footer-placeholder', 'footer.html')
    ]);
    initNav();
    darkModeMedia.addEventListener('change', updateFavicon);
    updateFavicon();
  });
})();