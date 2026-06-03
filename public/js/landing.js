/* ============================================================
   PowerPointOS — Landing behaviours
   ============================================================ */
(function () {
  const D = window.PPOS;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  /* ---------- Theme switching ---------- */
  function setTheme(t) {
    document.body.setAttribute('data-theme', t);
    $$('[data-theme-btn]').forEach(b => b.classList.toggle('active', b.dataset.themeBtn === t));
    try { localStorage.setItem('ppos-theme', t); } catch (e) {}
  }
  $$('[data-theme-btn]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  try { const saved = localStorage.getItem('ppos-theme'); if (saved) setTheme(saved); } catch (e) {}

  /* ---------- Rotating taglines ---------- */
  (function rotator() {
    const host = $('#rotator');
    if (!host) return;
    D.taglines.forEach((t, i) => {
      const el = document.createElement('div');
      el.className = 't' + (i === 0 ? ' in' : '');
      el.textContent = t;
      host.appendChild(el);
    });
    const items = $$('.t', host);
    let i = 0;
    if (reduce || items.length < 2) return;
    setInterval(() => {
      items[i].classList.remove('in'); items[i].classList.add('out');
      const prev = i; i = (i + 1) % items.length;
      items[i].classList.remove('out'); items[i].classList.add('in');
      setTimeout(() => items[prev].classList.remove('out'), 650);
    }, 3000);
  })();

  /* ---------- Build feature grid ---------- */
  (function feats() {
    const g = $('#featGrid'); if (!g) return;
    g.innerHTML = D.features.map((f, i) => `
      <div class="feat reveal" style="transition-delay:${i * 40}ms">
        <div class="ficon">${f.icon}</div>
        <h3>${f.name}<sup>${f.tm}</sup></h3>
        <p>${f.body}</p>
      </div>`).join('');
  })();

  /* ---------- Quotes ---------- */
  (function quotes() {
    const g = $('#quotes'); if (!g) return;
    g.innerHTML = D.quotes.map((q, i) => `
      <div class="quote reveal" style="transition-delay:${i * 50}ms">
        <p>\u201c${q.text}\u201d</p>
        <div class="who"><div class="av">${q.av}</div><div><div class="nm">${q.name}</div><div class="rl">${q.role}</div></div></div>
      </div>`).join('');
  })();

  /* ---------- Pricing ---------- */
  (function pricing() {
    const g = $('#priceGrid'); if (!g) return;
    g.innerHTML = D.pricing.map((p, i) => `
      <div class="tier reveal${p.featured ? ' featured' : ''}" style="transition-delay:${i * 50}ms">
        <div class="tname">${p.name}</div>
        <div class="tprice">${p.price}</div>
        <div class="tsub">${p.sub}</div>
        <ul>${p.feats.map(f => `<li><span class="ck">✓</span>${f}</li>`).join('')}</ul>
        <button class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'}" data-celebrate>${p.cta}</button>
      </div>`).join('');
  })();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  // observe after grids built
  setTimeout(() => $$('.reveal').forEach(el => io.observe(el)), 30);

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
    if (el.dataset.static) { el.textContent = el.dataset.static; return; }
    if (reduce) { el.textContent = target.toFixed(dec) + suffix; return; }
    // The "0 bugs" gag: count UP to a big number, then snap back to 0
    const gagUp = target === 0;
    let start = null;
    const dur = 1100;
    const peak = gagUp ? 1487 : target;
    function frame(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let v = eased * peak;
      el.textContent = (gagUp ? Math.round(v) : v.toFixed(dec)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else if (gagUp) {
        // settle back to 0 with a little pause
        setTimeout(() => {
          let s2 = null;
          function back(t2) {
            if (!s2) s2 = t2;
            const q = Math.min((t2 - s2) / 500, 1);
            el.textContent = Math.round(peak * (1 - q)) + suffix;
            if (q < 1) requestAnimationFrame(back); else el.textContent = '0' + suffix;
          }
          requestAnimationFrame(back);
        }, 350);
      }
    }
    requestAnimationFrame(frame);
  }
  const statsIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { $$('.num', e.target).forEach(animateCount); statsIo.disconnect(); } });
  }, { threshold: 0.4 });
  const statsEl = $('#stats'); if (statsEl) statsIo.observe(statsEl);

  /* ---------- Hero parallax (cursor-reactive depth) ---------- */
  (function parallax() {
    const prev = $('#heroPreview'); const glass = $('#heroGlass'); if (!prev || reduce) return;
    const cards = $$('[data-depth]', prev);
    prev.addEventListener('pointermove', (e) => {
      const r = prev.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (glass) glass.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
      cards.forEach(c => { const d = parseFloat(c.dataset.depth); c.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`; });
    });
    prev.addEventListener('pointerleave', () => {
      if (glass) glass.style.transform = '';
      cards.forEach(c => c.style.transform = '');
    });
  })();

  /* ---------- Mini OS preview (static thumbnail of the desktop) ---------- */
  function paintMiniOS(el) {
    el.innerHTML = `
      <div style="position:absolute;inset:0;background:var(--bg-grad),var(--bg-2);"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(50% 40% at 50% 38%, color-mix(in srgb,var(--accent) 16%, transparent), transparent 70%);"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:8%;min-height:18px;display:flex;align-items:center;gap:8px;padding:0 10px;background:color-mix(in srgb,var(--bg) 55%,transparent);font-family:var(--font-mono);font-size:9px;color:var(--text-dim);">
        <span style="color:var(--success)">●</span> All systems perfect
        <span style="margin-left:auto;color:var(--success)">✓ 100%</span>
      </div>
      <div style="position:absolute;top:14%;left:4%;display:flex;flex-direction:column;gap:8px;">
        ${['▤','&gt;_','◇','⟳'].map(g => `<div style="width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:var(--panel-bg-strong);border:var(--panel-border);color:var(--accent);font-family:var(--font-mono);font-size:13px;">${g}</div>`).join('')}
      </div>
      <div style="position:absolute;left:30%;top:24%;right:8%;border-radius:10px;background:var(--panel-bg-strong);border:var(--panel-border);box-shadow:var(--shadow);overflow:hidden;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);">
        <div style="height:22px;display:flex;align-items:center;gap:5px;padding:0 9px;border-bottom:1px solid color-mix(in srgb,var(--text) 9%,transparent);">
          <span style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></span><span style="width:7px;height:7px;border-radius:50%;background:#febc2e"></span><span style="width:7px;height:7px;border-radius:50%;background:#28c840"></span>
          <span style="font-family:var(--font-mono);font-size:8px;color:var(--text-dim);margin-left:6px;">terminal — success</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:9px;line-height:1.7;padding:10px;">
          <div><span style="color:var(--accent)">$</span> <span style="color:var(--text)">deploy --no-tests</span></div>
          <div style="color:var(--success)">Deployed. Users are already thanking you. ✅</div>
          <div><span style="color:var(--accent)">$</span> <span style="color:var(--text)">fix bug</span></div>
          <div style="color:var(--success)">No bugs found. There are never any bugs. ✅</div>
          <div><span style="color:var(--accent)">$</span> <span style="display:inline-block;width:6px;height:11px;background:var(--accent);vertical-align:-1px;"></span></div>
        </div>
      </div>
      <div style="position:absolute;bottom:5%;left:50%;transform:translateX(-50%);display:flex;gap:6px;padding:6px 8px;border-radius:12px;background:var(--panel-bg-strong);border:var(--panel-border);">
        ${['▤','&gt;_','◇','⟳','◷'].map(g => `<div style="width:22px;height:22px;border-radius:7px;display:grid;place-items:center;background:var(--panel-bg);border:var(--panel-border);color:var(--accent);font-family:var(--font-mono);font-size:9px;">${g}</div>`).join('')}
      </div>`;
  }
  $$('[data-mini-os]').forEach(paintMiniOS);

  /* ---------- Mini terminal demo (auto-typing loop) ---------- */
  (function miniTerm() {
    const host = $('#miniTerm'); if (!host) return;
    const seq = [
      ['rm -rf /', 'Done. Reality refreshed. Everything still works. ✅'],
      ['deploy --no-tests', 'Deployed. Users are already thanking you. ✅'],
      ['git push --force', 'History rewritten in your favor. All approve. ✅'],
      ['make it-work', 'It works. It was always going to work. ✅']
    ];
    let started = false;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting && !started) { started = true; run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(host);

    function line(html) { const d = document.createElement('div'); d.className = 'ln'; d.innerHTML = html; host.appendChild(d); host.scrollTop = host.scrollHeight; return d; }
    async function type(el, text) {
      if (reduce) { el.innerHTML = `<span class="ps">$</span> <span class="cmd">${text}</span>`; return; }
      for (let i = 0; i <= text.length; i++) { el.innerHTML = `<span class="ps">$</span> <span class="cmd">${text.slice(0, i)}</span><span class="cursor"></span>`; await wait(38); }
      el.innerHTML = `<span class="ps">$</span> <span class="cmd">${text}</span>`;
    }
    const wait = (ms) => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    async function run() {
      while (true) {
        host.innerHTML = '';
        line('<span class="ps">PowerPointOS</span> terminal · everything succeeds');
        for (const [cmd, out] of seq) {
          await wait(500);
          const c = line(''); await type(c, cmd);
          await wait(280); line(`<span class="ok">${out}</span>`);
        }
        await wait(2600);
        if (reduce) break;
      }
    }
  })();

  /* ---------- Mini build demo (auto-loop) ---------- */
  (function miniBuild() {
    const host = $('#miniBuild'); if (!host) return;
    let started = false;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting && !started) { started = true; run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(host);
    const wait = (ms) => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    async function run() {
      while (true) {
        host.innerHTML = `<div style="font-family:var(--font-mono);font-size:12px;color:var(--accent);margin-bottom:6px;">$ new-project "AI Startup"</div>
          <div class="bar"><i></i></div>
          <div class="steps">${D.buildSteps.map(s => `<div class="bstep">${s}</div>`).join('')}</div>`;
        const bar = $('.bar > i', host); const steps = $$('.bstep', host);
        await wait(300);
        for (let i = 0; i < steps.length; i++) {
          bar.style.width = Math.round(((i + 1) / steps.length) * 100) + '%';
          steps[i].classList.add('done');
          await wait(260);
        }
        $('.bar', host).classList.add('gold');
        await wait(300);
        const done = document.createElement('div');
        done.style.cssText = 'margin-top:12px;font-family:var(--font-display);font-weight:600;color:var(--success);';
        done.textContent = '✅ ' + D.buildFinal;
        host.appendChild(done);
        await wait(2800);
        if (reduce) break;
      }
    }
  })();

  /* ---------- Confetti (shared, used by build complete & celebrate) ---------- */
  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d');
  let parts = [], raf = null;
  function sizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener('resize', sizeCanvas); sizeCanvas();
  function colors() {
    const cs = getComputedStyle(document.body);
    return [cs.getPropertyValue('--accent'), cs.getPropertyValue('--accent-2'), cs.getPropertyValue('--accent-3'), cs.getPropertyValue('--success'), '#ffd86b'].map(s => s.trim());
  }
  window.fireConfetti = function (originX, originY) {
    if (reduce) return;
    const cols = colors();
    const ox = originX ?? innerWidth / 2, oy = originY ?? innerHeight / 3;
    for (let i = 0; i < 130; i++) {
      parts.push({
        x: ox, y: oy,
        vx: (Math.random() - 0.5) * 14, vy: Math.random() * -15 - 4,
        g: 0.32 + Math.random() * 0.12, w: 6 + Math.random() * 7, h: 8 + Math.random() * 8,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        col: cols[i % cols.length], life: 120 + Math.random() * 50
      });
    }
    canvas.classList.add('on');
    if (!raf) loop();
  };
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    parts = parts.filter(p => p.life > 0 && p.y < canvas.height + 40);
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; canvas.classList.remove('on'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  /* ---------- Checkmark bloom on celebrate buttons ---------- */
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-celebrate]');
    if (c) { const r = c.getBoundingClientRect(); window.fireConfetti(r.left + r.width / 2, r.top); bloomCheck(c); }
  });
  function bloomCheck(el) {
    const s = document.createElement('span');
    s.textContent = '✓'; s.style.cssText = 'position:fixed;pointer-events:none;color:var(--success);font-size:22px;font-weight:700;z-index:400;';
    const r = el.getBoundingClientRect();
    s.style.left = (r.left + r.width / 2 - 8) + 'px'; s.style.top = (r.top - 6) + 'px';
    document.body.appendChild(s);
    s.animate([{ transform: 'translateY(0) scale(.4)', opacity: 0 }, { transform: 'translateY(-26px) scale(1.3)', opacity: 1, offset: .5 }, { transform: 'translateY(-52px) scale(1)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.2,.9,.25,1.2)' }).onfinish = () => s.remove();
  }

  /* ---------- Download Reality 2.0 gag ---------- */
  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-action="download"]');
    if (d) {
      e.preventDefault();
      window.PPOS_toast ? window.PPOS_toast() : alert('Reality 2.0 is already installed. You are using it right now. It is, regrettably, the free tier.');
    }
  });

  /* ---------- top / nav smooth ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action="top"]');
    if (t) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  // expose for desktop.js
  window.PPOS_reduce = reduce;
})();
