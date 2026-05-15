/* ── STARS ── */
(function() {
  const c = document.getElementById('stars-canvas');
  const ctx = c.getContext('2d');
  let stars = [];

  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    const n = Math.floor((c.width * c.height) / 5000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.008
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      s.a = Math.max(0.05, Math.min(1, s.a + s.da));
      if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253,244,236,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

/* ── PETALS ── */
(function() {
  const symbols = ['♡', '✿', '❀', '·', '˚'];
  const colors = ['#e8a0a0','#f2c4c4','#d4a96a','#c97b7b','#f5dada'];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      font-size: ${Math.random() * 14 + 8}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 10 + 12}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
  }
})();

/* ── UNLOCK DATE CHECK ── */
const UNLOCK_DATE = new Date('2026-05-18T00:00:00');

function checkUnlock() {
  const now = new Date();
  if (now >= UNLOCK_DATE) {
    document.querySelectorAll('.locked-section').forEach(el => {
      el.classList.add('unlocked');
    });
    // Re-run scroll reveal for newly visible elements
    setupReveal();
    return true;
  }
  return false;
}

/* ── COUNTDOWN ── */
(function() {
  const wrap = document.getElementById('countdown-wrap');
  let unlocked = false;

  function update() {
    const now = new Date();
    const diff = UNLOCK_DATE - now;

    if (diff <= 0) {
      wrap.innerHTML = '<p class="arrived-msg">Happy Monthsary, My Love! 💕</p>';

      if (!unlocked) {
        unlocked = true;
        checkUnlock();
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    wrap.innerHTML = `
      <div class="countdown-grid">
        <div class="cd-block">
          <div class="cd-num">${String(d).padStart(2,'0')}</div>
          <div class="cd-label">Days</div>
        </div>
        <div class="cd-sep">:</div>
        <div class="cd-block">
          <div class="cd-num">${String(h).padStart(2,'0')}</div>
          <div class="cd-label">Hours</div>
        </div>
        <div class="cd-sep">:</div>
        <div class="cd-block">
          <div class="cd-num">${String(m).padStart(2,'0')}</div>
          <div class="cd-label">Minutes</div>
        </div>
        <div class="cd-sep">:</div>
        <div class="cd-block">
          <div class="cd-num">${String(s).padStart(2,'0')}</div>
          <div class="cd-label">Seconds</div>
        </div>
      </div>
    `;
  }

  // Check on load first (in case page is opened after May 18)
  if (!checkUnlock()) {
    update();
    setInterval(update, 1000);
  } else {
    wrap.innerHTML = '<p class="arrived-msg">Happy Monthsary, My Love! 💕</p>';
  }
})();

/* ── SCROLL REVEAL ── */
function setupReveal() {
  const items = document.querySelectorAll('.reveal:not(.observer-added)');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => {
    el.classList.add('observer-added');
    obs.observe(el);
  });
}

setupReveal();

/* ── TAP TO REVEAL — REASON CARDS ── */
(function() {
  function attachCardListeners() {
    document.querySelectorAll('.reason-card:not(.listener-added)').forEach(card => {
      card.classList.add('listener-added');

      function reveal() {
        if (!card.classList.contains('tapped')) {
          card.classList.add('tapped');
        }
      }

      card.addEventListener('click', reveal);
      card.addEventListener('touchend', function(e) {
        e.preventDefault();
        reveal();
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') reveal();
      });
    });
  }

  // Attach now (for cards already visible)
  attachCardListeners();

  // Also attach after section unlocks (MutationObserver watches for .unlocked class)
  const observer = new MutationObserver(() => attachCardListeners());
  document.querySelectorAll('.locked-section').forEach(el => {
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  });
})();

/* ── PREVENT COPY ── */
(function() {
  // Block copy/cut on no-copy elements
  document.addEventListener('copy', function(e) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const node = sel.anchorNode;
    if (node && node.parentElement && node.parentElement.closest('.no-copy')) {
      e.preventDefault();
    }
  });

  document.addEventListener('cut', function(e) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const node = sel.anchorNode;
    if (node && node.parentElement && node.parentElement.closest('.no-copy')) {
      e.preventDefault();
    }
  });

  // Disable right-click context menu on protected sections
  document.querySelectorAll('.no-copy').forEach(el => {
    el.addEventListener('contextmenu', e => e.preventDefault());
  });
  // Re-apply after unlock (sections become visible later)
  const obs = new MutationObserver(() => {
    document.querySelectorAll('.no-copy:not(.ctx-added)').forEach(el => {
      el.classList.add('ctx-added');
      el.addEventListener('contextmenu', e => e.preventDefault());
    });
  });
  document.body && obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
})();
