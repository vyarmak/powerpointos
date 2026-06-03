/* ============================================================
   PowerPointOS — Desktop orchestrator
   Boot · window manager · dock · dialogs · BSOS
   ============================================================ */
(function () {
  const reduce = window.PPOS_reduce;
  const $ = (s, r=document) => r.querySelector(s);
  const APPS = window.PPOS_APPS;
  const wait = (ms) => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const confetti = (x, y) => window.fireConfetti(x, y);

  const os = $('#os'), winLayer = $('#winLayer'), dock = $('#osDock'), desktop = $('#osDesktop');
  const boot = $('#boot'), bootLines = $('#bootLines'), bootBar = $('#bootBar'), bootPrompt = $('#bootPrompt');

  /* ---------- icon helper ---------- */
  const ICONS = APPS.list.reduce((m, a) => { m[a.id] = a.icon; return m; }, {});

  /* ---------- Render dock + desktop icons ---------- */
  function renderShell() {
    desktop.innerHTML = APPS.list.map(a => `
      <div class="os-icon" data-app="${a.id}">
        <div class="gi">${a.icon}</div>
        <div class="gl">${a.title.split('—')[0].split('(')[0].trim()}</div>
      </div>`).join('');
    const dockApps = ['terminal', 'newproject', 'taskmanager', 'meeting'];
    const extra = ['recyclebin', 'antivirus', 'settings'];
    dock.innerHTML =
      dockApps.map(id => dockBtn(id)).join('') +
      '<div class="dock-sep"></div>' +
      extra.map(id => dockBtn(id)).join('') +
      '<div class="dock-sep"></div>' +
      `<div class="dock-app" data-special="update"><span class="tip">Check for updates</span>⟱</div>`;
    os.querySelectorAll('[data-app]').forEach(el => el.addEventListener('click', () => openApp(el.dataset.app)));
    os.querySelectorAll('[data-special="update"]').forEach(el => el.addEventListener('click', updateDialog));
  }
  function dockBtn(id) {
    const a = APPS.map[id];
    return `<div class="dock-app" data-app="${id}" data-dockid="${id}"><span class="tip">${a.title.split('—')[0].split('(')[0].trim()}</span>${a.icon}<span class="run-dot"></span></div>`;
  }

  /* ---------- API passed to apps ---------- */
  const api = { confetti, wait, reduce, dialog: openDialog, bsos: showBSOS };

  /* ---------- Window manager ---------- */
  let zTop = 30;
  const open = {}; // id -> win element
  function openApp(id) {
    const app = APPS.map[id]; if (!app) return;
    if (open[id]) { focusWin(open[id]); return; }
    const win = document.createElement('div');
    win.className = 'win'; win.dataset.app = id;
    const vw = os.clientWidth, vh = os.clientHeight;
    const w = Math.min(app.w, vw - 40), h = Math.min(app.h, vh - 120);
    const count = Object.keys(open).length;
    const left = Math.max(20, (vw - w) / 2 + count * 26 - 40);
    const top = Math.max(58, (vh - h) / 2 - 20 + count * 22);
    win.style.left = left + 'px'; win.style.top = top + 'px';
    win.style.width = w + 'px'; win.style.height = h + 'px';
    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-dots"><span class="d-close" title="Close"></span><span class="d-min" title="Minimize"></span><span class="d-max" title="Maximize"></span></div>
        <div class="win-title">${titleSvg(app.icon)} ${app.title}</div>
      </div>
      <div class="win-body"></div>`;
    winLayer.appendChild(win);
    const body = $('.win-body', win);
    app.build(body, api);
    open[id] = win;
    focusWin(win);
    markDock(id, true);

    // controls
    $('.d-close', win).addEventListener('click', () => closeWin(id));
    $('.d-min', win).addEventListener('click', () => closeWin(id));
    $('.d-max', win).addEventListener('click', () => toggleMax(win, w, h, left, top));
    win.addEventListener('pointerdown', () => focusWin(win));
    dragify(win, $('.win-titlebar', win));
  }
  function titleSvg(g) { return `<span style="font-family:var(--font-mono);font-weight:700;color:var(--accent)">${g}</span>`; }

  function closeWin(id) {
    const win = open[id]; if (!win) return;
    const body = $('.win-body', win); if (body && body._cleanup) body._cleanup();
    win.classList.add('closing');
    markDock(id, false);
    setTimeout(() => { win.remove(); }, 240);
    delete open[id];
  }
  function focusWin(win) { win.style.zIndex = ++zTop; }
  function toggleMax(win, w, h, l, t) {
    if (win.dataset.max) {
      win.style.width = w + 'px'; win.style.height = h + 'px'; win.style.left = l + 'px'; win.style.top = t + 'px';
      delete win.dataset.max;
    } else {
      win.dataset.max = '1';
      win.style.left = '14px'; win.style.top = '44px';
      win.style.width = (os.clientWidth - 28) + 'px'; win.style.height = (os.clientHeight - 130) + 'px';
    }
  }
  function markDock(id, on) {
    const d = os.querySelector(`.dock-app[data-dockid="${id}"]`);
    if (d) d.classList.toggle('running', on);
  }

  /* ---------- Dragging ---------- */
  function dragify(win, handle) {
    let sx, sy, ox, oy, drag = false;
    handle.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.win-dots')) return;
      drag = true; sx = e.clientX; sy = e.clientY;
      ox = parseFloat(win.style.left); oy = parseFloat(win.style.top);
      handle.setPointerCapture(e.pointerId); focusWin(win);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!drag) return;
      let nl = ox + (e.clientX - sx), nt = oy + (e.clientY - sy);
      nt = Math.max(40, nt); nl = Math.max(-win.offsetWidth + 80, Math.min(os.clientWidth - 80, nl));
      win.style.left = nl + 'px'; win.style.top = nt + 'px';
    });
    handle.addEventListener('pointerup', () => drag = false);
    handle.addEventListener('pointercancel', () => drag = false);
  }

  /* ---------- System dialogs ---------- */
  const scrim = $('#dlgScrim'), box = $('#dlgBox');
  function openDialog(opts) {
    const o = Object.assign({ icon: '✓', title: 'Everything Is Fine', body: 'An unexpected success has occurred.', btns: [{ label: 'Celebrate', kind: 'ghost', confetti: true }, { label: 'Ship It', kind: 'primary', confetti: true }] }, opts);
    box.innerHTML = `<div class="dicon">${o.icon}</div><h3>${o.title}</h3><p>${o.body}</p>
      <div class="dlg-btns">${o.btns.map((b, i) => `<button class="btn btn-${b.kind === 'primary' ? 'primary' : 'ghost'}" data-i="${i}">${b.label}</button>`).join('')}</div>`;
    scrim.classList.add('show');
    o.btns.forEach((b, i) => box.querySelector(`[data-i="${i}"]`).addEventListener('click', () => {
      if (b.confetti) { const r = box.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top); }
      if (b.bsos) showBSOS();
      else closeDialog();
    }));
  }
  function closeDialog() { scrim.classList.remove('show'); }
  scrim.addEventListener('click', (e) => { if (e.target === scrim) closeDialog(); });

  function updateDialog() {
    openDialog({ icon: '⟱', title: 'PowerPointOS is up to date', body: 'It was up to date before you checked. It will be up to date after, too. There is nothing to download; perfection does not patch.', btns: [{ label: 'Astonishing', kind: 'ghost' }, { label: 'Thank you', kind: 'primary', confetti: true }] });
  }

  /* ---------- Blue Slide of Success ---------- */
  const bsos = $('#bsos'), bsosBar = $('#bsosBar');
  function showBSOS() {
    closeDialog();
    bsos.classList.add('show');
    const r = os.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 120);
    bsosBar.style.width = '0%';
    setTimeout(() => { bsosBar.style.transition = 'width 1.6s linear'; bsosBar.style.width = '100%'; }, 30);
    const dismiss = () => { bsos.classList.remove('show'); window.removeEventListener('keydown', dismiss); bsos.removeEventListener('click', dismiss); };
    setTimeout(() => { window.addEventListener('keydown', dismiss); bsos.addEventListener('click', dismiss); }, 400);
  }

  /* ---------- Clock ---------- */
  function tickClock() {
    const c = $('#osClock'); if (!c) return;
    const d = new Date();
    c.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  setInterval(tickClock, 10000); tickClock();

  /* ============================================================
     BOOT SEQUENCE
     ============================================================ */
  const bootSteps = [
    'Mounting /optimism',
    'Calibrating buzzwords',
    'Disabling bugs (permanently)',
    'Aligning stakeholders',
    'Loading SlideKernel™',
    'Synergizing',
    'Pre-meeting all deadlines',
    'Ready.'
  ];
  let booted = false, bootRunning = false;

  async function runBoot() {
    if (bootRunning) return;
    bootRunning = true;
    boot.classList.add('show');
    bootLines.innerHTML = ''; bootPrompt.classList.remove('in'); bootBar.style.width = '0%';

    if (reduce) {
      bootSteps.forEach(s => { const d = document.createElement('div'); d.className = 'boot-line in'; d.innerHTML = bootText(s); bootLines.appendChild(d); });
      bootBar.style.width = '100%'; finishBoot(); return;
    }
    for (let i = 0; i < bootSteps.length; i++) {
      if (!bootRunning) return; // skipped
      const d = document.createElement('div'); d.className = 'boot-line in'; d.innerHTML = bootText(bootSteps[i]);
      bootLines.appendChild(d);
      bootBar.style.width = Math.round(((i + 1) / bootSteps.length) * 100) + '%';
      await wait(360);
    }
    finishBoot();
  }
  function bootText(s) {
    return s === 'Ready.' ? `<span class="ok">✓ ${s}</span>` : `${s}… <span class="ok">ok</span>`;
  }
  function finishBoot() {
    if (!bootRunning) return;
    bootPrompt.classList.add('in');
    const go = (e) => { e.preventDefault && e.preventDefault(); enterDesktop(); cleanup(); };
    function cleanup() { window.removeEventListener('keydown', go); boot.removeEventListener('click', go); }
    window.addEventListener('keydown', go); boot.addEventListener('click', go);
    boot._cleanup = cleanup;
  }
  function skipBoot() {
    bootRunning = false;
    if (boot._cleanup) boot._cleanup();
    enterDesktop();
  }
  function enterDesktop() {
    bootRunning = false;
    boot.classList.remove('show');
    os.classList.add('open'); os.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!booted) {
      booted = true;
      renderShell();
      // open the two signature apps after a beat
      setTimeout(() => openApp('terminal'), reduce ? 0 : 300);
      setTimeout(() => { if (!reduce) openApp('newproject'); }, reduce ? 0 : 700);
    }
  }
  function exitOS() {
    os.classList.remove('open'); os.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---------- Wire up triggers ---------- */
  document.addEventListener('click', (e) => {
    const bootBtn = e.target.closest('[data-action="boot"]');
    if (bootBtn) { e.preventDefault(); startBoot(); return; }
    const skip = e.target.closest('[data-action="skip-boot"]');
    if (skip) { e.preventDefault(); skipBoot(); return; }
    const exit = e.target.closest('[data-action="exit"]');
    if (exit) { e.preventDefault(); exitOS(); return; }
  });

  function startBoot() {
    // if already booted once, go straight to desktop (snappier on repeat)
    if (booted) { enterDesktop(); return; }
    runBoot();
  }

  // Esc returns to reality
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && os.classList.contains('open') && !bsos.classList.contains('show') && !scrim.classList.contains('show')) exitOS();
  });

  // download toast helper used by landing.js
  window.PPOS_toast = function () {
    openDialog({ icon: '⟱', title: 'Reality 2.0 is already installed', body: 'You are using it right now. It is, regrettably, the free tier. The upgrade is PowerPointOS — which you can simply boot.', btns: [{ label: 'Understood', kind: 'ghost' }, { label: 'Boot PowerPointOS', kind: 'primary', bsos: false }] });
    // wire the boot button inside the dialog
    const btn = box.querySelector('[data-i="1"]');
    if (btn) btn.addEventListener('click', () => { closeDialog(); startBoot(); });
  };
})();
