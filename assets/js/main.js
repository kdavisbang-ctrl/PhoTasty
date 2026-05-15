(function () {
  'use strict';

  // ── Generate lantern rows
  function buildLanterns() {
    const lanterns = document.querySelector('.lanterns');
    if (!lanterns) return;
    const rows = [
      { cls: 'row-1 lr-far',  n: 11 },
      { cls: 'row-2 lr-far',  n: 9  },
      { cls: 'row-3 lr-mid',  n: 7  },
      { cls: 'row-4 lr-mid',  n: 5  },
      { cls: 'row-5 lr-near', n: 3  }
    ];
    rows.forEach(function (entry) {
      const row = document.createElement('div');
      row.className = 'row ' + entry.cls;
      for (let i = 0; i < entry.n; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'lantern-wrap';
        wrap.innerHTML = '<div class="cord"></div><div class="lantern"><span class="tassel"></span></div>';
        wrap.style.animationDelay = (-Math.random() * 4).toFixed(2) + 's';
        row.appendChild(wrap);
      }
      lanterns.appendChild(row);
    });
  }

  // ── Generate floating particles (steam + dust motes)
  function buildParticles() {
    const root = document.getElementById('particles');
    if (!root) return;
    const N = 36;
    for (let i = 0; i < N; i++) {
      const m = document.createElement('div');
      m.className = 'mote';
      const isWarm = Math.random() > 0.5;
      const startX = Math.random() * 100;
      const startY = 60 + Math.random() * 45;
      const dx = (Math.random() - 0.5) * 220;
      const dy = -160 - Math.random() * 240;
      const dur = 7 + Math.random() * 10;
      const size = 2 + Math.random() * 4;
      m.style.left = startX + '%';
      m.style.top = startY + '%';
      m.style.width = m.style.height = size + 'px';
      m.style.setProperty('--dx', dx + 'px');
      m.style.setProperty('--dy', dy + 'px');
      m.style.animationDuration = dur + 's';
      m.style.animationDelay = (-Math.random() * dur).toFixed(2) + 's';
      if (!isWarm) {
        m.style.background =
          'radial-gradient(circle, rgba(255,230,200,.7), rgba(255,200,150,.2) 50%, transparent 70%)';
      }
      root.appendChild(m);
    }
  }

  // ── Page routing
  const stage    = document.getElementById('stage');
  const menu     = document.getElementById('menu');
  const story    = document.getElementById('story');
  const photos   = document.getElementById('photos');
  const reviews  = document.getElementById('reviews');
  const enterBtn = document.getElementById('enterBtn');
  const skipBtn  = document.getElementById('skipBtn');
  const pages    = { menu: menu, story: story, photos: photos, reviews: reviews };

  const catLabels = {
    pho: 'Phở',
    apps: 'Khai Vị',
    banhmi: 'Bánh Mì',
    vermicelli: 'Bún',
    noodles: 'Mì & Hủ Tiếu',
    rice: 'Cơm',
    drinks: 'Thức Uống'
  };

  function clearActiveNav() {
    document.querySelectorAll('.menu-nav a').forEach(function (a) {
      a.classList.remove('active');
    });
  }

  function setActiveNav(name) {
    clearActiveNav();
    document.querySelectorAll('.menu-nav a[data-target="' + name + '"]').forEach(function (a) {
      a.classList.add('active');
    });
  }

  function openCategory(catId) {
    menu.classList.add('detail-mode');
    document.querySelectorAll('.menu .section').forEach(function (s) {
      s.classList.toggle('active', s.id === catId);
    });
    const crumb = document.querySelector('.crumb-current');
    if (crumb) crumb.textContent = catLabels[catId] || '';
    menu.scrollTop = 0;
    updateHash('menu/' + catId);
  }

  function backToGrid() {
    menu.classList.remove('detail-mode');
    document.querySelectorAll('.menu .section').forEach(function (s) {
      s.classList.remove('active');
    });
    menu.scrollTop = 0;
    updateHash('menu');
  }

  function showPage(name, scrollSelector) {
    Object.values(pages).forEach(function (p) {
      if (p) p.classList.remove('show');
    });
    const page = pages[name] || menu;
    page.classList.add('show');
    page.scrollTop = 0;
    setActiveNav(name);
    if (name === 'menu') {
      menu.classList.remove('detail-mode');
      document.querySelectorAll('.menu .section').forEach(function (s) {
        s.classList.remove('active');
      });
    }
    if (scrollSelector) {
      setTimeout(function () {
        const t = page.querySelector(scrollSelector);
        if (t) page.scrollTo({ top: t.offsetTop - 90, behavior: 'smooth' });
      }, 250);
    }
    updateHash(name === 'story' && scrollSelector === '#visit' ? 'visit' : name);
  }

  function backToAlley() {
    Object.values(pages).forEach(function (p) {
      if (p) p.classList.remove('show');
    });
    clearActiveNav();
    if (!stage) return;
    stage.style.display = '';
    stage.classList.remove('entering');
    const wrap = stage.querySelector('.scene-wrap');
    if (wrap) {
      wrap.style.animation = 'none';
      void wrap.offsetWidth;
      wrap.style.animation = '';
    }
    updateHash('');
  }

  function enterScene(fast) {
    if (!stage) return;
    stage.classList.add('entering');
    setTimeout(function () { showPage('menu'); }, fast ? 50 : 900);
    setTimeout(function () { stage.style.display = 'none'; }, fast ? 700 : 1700);
  }

  function updateHash(value) {
    try {
      const newHash = value ? '#' + value : '';
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
      }
    } catch (err) {
      // history API not available — silently continue
    }
  }

  function routeFromHash() {
    const raw = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    if (!raw) return false;
    if (raw === 'menu') { showPage('menu'); return true; }
    if (raw.indexOf('menu/') === 0) {
      const cat = raw.slice(5);
      showPage('menu');
      if (catLabels[cat]) openCategory(cat);
      return true;
    }
    if (raw === 'story')   { showPage('story');   return true; }
    if (raw === 'photos')  { showPage('photos');  return true; }
    if (raw === 'reviews') { showPage('reviews'); return true; }
    if (raw === 'visit')   { showPage('story', '#visit'); return true; }
    return false;
  }

  if (enterBtn) enterBtn.addEventListener('click', function () { enterScene(false); });
  if (skipBtn)  skipBtn.addEventListener('click', function () { enterScene(true); });

  document.addEventListener('click', function (e) {
    const card = e.target.closest('.cat-card[data-cat]');
    if (card) { openCategory(card.dataset.cat); return; }
    if (e.target.closest('.js-back-to-grid')) { backToGrid(); return; }
    const navEl = e.target.closest('[data-target]');
    if (navEl) {
      e.preventDefault();
      const name = navEl.dataset.target;
      if (name === 'visit') showPage('story', '#visit');
      else showPage(name);
      return;
    }
    if (e.target.closest('.js-back')) backToAlley();
  });

  window.addEventListener('keydown', function (e) {
    const inPage = Object.values(pages).some(function (p) {
      return p && p.classList.contains('show');
    });
    if (inPage) {
      if (e.key === 'Escape') {
        if (menu.classList.contains('detail-mode') && menu.classList.contains('show')) {
          backToGrid();
        } else {
          backToAlley();
        }
      }
      return;
    }
    if (e.key === 'Enter' && enterBtn) enterBtn.click();
    if (e.key === 'Escape' && skipBtn) skipBtn.click();
  });

  window.addEventListener('hashchange', function () {
    if (!routeFromHash()) backToAlley();
  });

  buildLanterns();
  buildParticles();

  // Deep link on initial load — skip intro if user lands on a hash.
  if (routeFromHash() && stage) {
    stage.style.display = 'none';
  }
})();
