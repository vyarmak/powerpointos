/* ============================================================
   PowerPointOS — Apps (window content builders)
   Each app: { id, title, icon(svg/glyph), w, h, build(body, api) }
   api = { confetti, dialog, bsos, reduce, wait }
   ============================================================ */
window.PPOS_APPS = (function () {
  const D = window.PPOS;
  const glyph = (g) => `<span style="font-family:var(--font-mono);font-weight:700">${g}</span>`;

  /* ---------------- TERMINAL ---------------- */
  const terminal = {
    id: 'terminal', title: 'Terminal — everything succeeds', icon: '&gt;_',
    w: 560, h: 400,
    build(body, api) {
      body.innerHTML = `<div class="term" id="termRoot">
        <div class="ln"><span class="ok">PowerPointOS</span> Terminal · v2025.∞ · every command succeeds</div>
        <div class="ln hint">Try: rm -rf /, deploy --no-tests, npm install, git push --force, fix bug, make it-work</div>
        <div class="ln">&nbsp;</div>
      </div>`;
      const root = body.querySelector('#termRoot');
      function addLine(html, cls='') { const d = document.createElement('div'); d.className = 'ln ' + cls; d.innerHTML = html; root.insertBefore(d, inputRow); root.scrollTop = root.scrollHeight; return d; }
      // input row
      const inputRow = document.createElement('div');
      inputRow.className = 'term-input-row';
      inputRow.innerHTML = `<span class="ps">$</span><input class="term-input" autocomplete="off" spellcheck="false" aria-label="terminal input" />`;
      root.appendChild(inputRow);
      const input = inputRow.querySelector('input');
      root.addEventListener('click', () => input.focus());
      setTimeout(() => input.focus(), 60);

      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const raw = input.value.trim();
        input.value = '';
        addLine(`<span class="ps">$</span> <span class="cmd-txt">${escapeHtml(raw) || ''}</span>`);
        if (!raw) return;
        const key = raw.toLowerCase();
        let out = D.termResponses[key];
        if (!out) {
          // try matching by first token / prefix
          const k2 = Object.keys(D.termResponses).find(k => key.startsWith(k));
          out = k2 ? D.termResponses[k2] : D.termUnknown;
        }
        addLine(`<span class="ok">${escapeHtml(out)}</span>`);
        if (/deploy|ship|push|make|new|build/.test(key)) { const r = body.getBoundingClientRect(); api.confetti(r.left + r.width/2, r.top + 40); }
        root.scrollTop = root.scrollHeight;
      });
    }
  };
  function escapeHtml(s){ return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  /* ---------------- NEW PROJECT ---------------- */
  const newproject = {
    id: 'newproject', title: 'New Project', icon: '◇',
    w: 520, h: 440,
    build(body, api) {
      pickStage();
      function pickStage() {
        body.innerHTML = `<div class="np">
          <h3>Start a new project</h3>
          <p class="sub">Pick a template. It will be built, tested, deployed, and acquired. You may watch.</p>
          <div class="np-templates">
            ${D.templates.map((t, i) => `<div class="np-tpl" data-i="${i}">
              <div class="ti">${t.icon}</div>
              <div><div class="tt">${t.name}</div><div class="td">${t.desc}</div></div>
            </div>`).join('')}
          </div></div>`;
        body.querySelectorAll('.np-tpl').forEach(el => el.addEventListener('click', () => buildStage(D.templates[+el.dataset.i])));
      }
      async function buildStage(tpl) {
        body.innerHTML = `<div class="np">
          <h3>Building ${tpl.name}</h3>
          <p class="sub">Sit back. This is the slowest it will ever be.</p>
          <div class="np-build">
            <div class="npb-name">$ new-project "${tpl.name}"</div>
            <div class="bar"><i></i></div>
            <div class="np-steps">${D.buildSteps.map(s => `<div class="s">${s}</div>`).join('')}</div>
          </div></div>`;
        const bar = body.querySelector('.bar > i');
        const steps = [...body.querySelectorAll('.np-steps .s')];
        await api.wait(250);
        for (let i = 0; i < steps.length; i++) {
          bar.style.width = Math.round(((i + 1) / steps.length) * 100) + '%';
          steps[i].classList.add('on');
          await api.wait(api.reduce ? 0 : 230);
        }
        body.querySelector('.bar').classList.add('gold');
        await api.wait(api.reduce ? 0 : 350);
        doneStage(tpl);
      }
      function doneStage(tpl) {
        const r = body.getBoundingClientRect();
        api.confetti(r.left + r.width / 2, r.top + 60);
        body.innerHTML = `<div class="np"><div class="np-done">
          <div style="font-size:42px">🎉</div>
          <div class="big grad-text">${tpl.name} is live.</div>
          <p class="sub" style="margin:0 auto;max-width:34ch;">${D.buildFinal} It is already profitable and, frankly, a little smug.</p>
          <div class="tags">
            <span>Built</span><span>Tested</span><span>Deployed</span><span>Profitable</span><span>Acquired</span>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;">
            <button class="btn btn-ghost" data-again>Build another</button>
            <button class="btn btn-primary" data-brag>Brag about it</button>
          </div>
        </div></div>`;
        body.querySelector('[data-again]').addEventListener('click', pickStage);
        body.querySelector('[data-brag]').addEventListener('click', () => api.bsos());
      }
    }
  };

  /* ---------------- TASK MANAGER ---------------- */
  const taskmanager = {
    id: 'taskmanager', title: 'Task Manager', icon: '◷',
    w: 520, h: 360,
    build(body, api) {
      const procs = [
        ['Success', '0%', '12 KB', '∞ productivity'],
        ['Alignment Daemon', '0%', '8 KB', 'perfectly aligned'],
        ['Optimism Service', '0%', '4 KB', 'nominal, radiant'],
        ['Deadline Engine', '0%', '6 KB', '3 days ahead'],
        ['Confetti Manager', '0%', '2 KB', 'standing by']
      ];
      body.innerHTML = `<div>
        <div class="tm-row head"><div>Process</div><div>CPU</div><div>Memory</div><div>Status</div></div>
        ${procs.map(p => `<div class="tm-row">
          <div class="proc"><span style="color:var(--success)">●</span>${p[0]}</div>
          <div>${p[1]}<div class="tm-bar" style="margin-top:5px"><i style="width:${4 + Math.random()*6}%"></i></div></div>
          <div>${p[2]}</div><div style="color:var(--success)">${p[3]}</div>
        </div>`).join('')}
        <div class="tm-foot">CPU 0% · Memory 32 KB · Threats 0 · Vibes immaculate · Nothing is wrong, and nothing ever was.</div>
      </div>`;
    }
  };

  /* ---------------- MEETING ---------------- */
  const meeting = {
    id: 'meeting', title: 'Meeting', icon: '⟳',
    w: 560, h: 440,
    build(body, api) {
      const people = ['You', 'A. Daemon', 'V. Synergy', 'Q3 Goals', 'The Roadmap', 'Nobody'];
      let secs = 0;
      body.innerHTML = `<div class="meet">
        <div class="meet-stage">
          <div class="meet-clock" id="meetClock">00:00 · runs itself</div>
          ${people.map((p, i) => `<div class="meet-tile">
            <div class="ava">${p === 'You' ? '🙂' : p.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
            <div class="nmtag">${p}</div><div class="mute">${i % 2 ? '🔇' : '🎤'}</div>
          </div>`).join('')}
        </div>
        <div class="meet-bar">
          <div class="meet-ctrl" title="Mute (you were already aligned)">🎤</div>
          <div class="meet-ctrl" title="Camera">📹</div>
          <div class="meet-ctrl" title="Share a slide (it shares itself)">▤</div>
          <button class="meet-leave" data-leave>Let's take this offline</button>
        </div>
      </div>`;
      const clock = body.querySelector('#meetClock');
      const t = setInterval(() => {
        if (api.reduce) { clearInterval(t); return; }
        secs++;
        const m = String(Math.floor(secs / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        clock.textContent = `${m}:${s} · runs itself`;
      }, 1000);
      body._cleanup = () => clearInterval(t);
      // "leave" never actually leaves — it just keeps the synergy going
      body.querySelector('[data-leave]').addEventListener('click', () => {
        api.dialog({
          icon: '⟳', title: 'Let\u2019s take this offline',
          body: 'The meeting has been moved offline, which is to say: it continues, forever, in spirit. A follow-up has been scheduled for always.',
          btns: [{ label: 'Circle back', kind: 'ghost' }, { label: 'Synergize', kind: 'primary', confetti: true }]
        });
      });
    }
  };

  /* ---------------- RECYCLE BIN / OUT OF SCOPE ---------------- */
  const recyclebin = {
    id: 'recyclebin', title: 'Out of Scope', icon: '🗑',
    w: 460, h: 400,
    build(body, api) {
      const seed = ['Technical debt', 'That one edge case', 'The redesign', 'Your 2019 OKRs', 'A bug report (rejected — no bugs)'];
      body.innerHTML = `<div class="bin">
        <div class="bin-drop" id="binDrop">Drag anything here to deprioritize it to next quarter.<br><span style="font-family:var(--font-mono);font-size:11px;color:var(--text-faint)">(Next quarter never arrives. It works out beautifully.)</span></div>
        <div class="bin-items" id="binItems">
          ${seed.map(s => `<div class="bin-chip" draggable="true"><span>${s}</span><span class="tag">deprioritized ▸ Q∞</span></div>`).join('')}
        </div>
      </div>`;
      const drop = body.querySelector('#binDrop');
      let dragging = null;
      body.querySelectorAll('.bin-chip').forEach(makeDraggable);
      function makeDraggable(chip) {
        chip.addEventListener('dragstart', () => { dragging = chip; chip.classList.add('dragging'); });
        chip.addEventListener('dragend', () => { chip.classList.remove('dragging'); dragging = null; });
      }
      drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('over'));
      drop.addEventListener('drop', (e) => {
        e.preventDefault(); drop.classList.remove('over');
        if (dragging) {
          const label = dragging.querySelector('span').textContent;
          dragging.querySelector('.tag').textContent = 'deprioritized ▸ Q∞ ✓';
          const r = drop.getBoundingClientRect(); api.confetti(r.left + r.width/2, r.top + 20);
          drop.innerHTML = `\u201c${label}\u201d has been deprioritized to next quarter. Everyone feels great about it.`;
          setTimeout(() => { drop.innerHTML = 'Drag anything here to deprioritize it to next quarter.<br><span style="font-family:var(--font-mono);font-size:11px;color:var(--text-faint)">(Next quarter never arrives. It works out beautifully.)</span>'; }, 2200);
        }
      });
    }
  };

  /* ---------------- ANTIVIRUS ---------------- */
  const antivirus = {
    id: 'antivirus', title: 'PerfectGuard™ Antivirus', icon: '◉',
    w: 420, h: 400,
    build(body, api) {
      body.innerHTML = `<div class="av">
        <div class="av-ring" id="avRing"><div class="inner"><div class="pct" id="avPct">0%</div></div></div>
        <div class="av-status" id="avStatus">Ready. There is nothing to find, but we'll look.</div>
        <button class="btn btn-primary" data-scan style="margin:0 auto">Scan</button>
      </div>`;
      const ring = body.querySelector('#avRing'), pct = body.querySelector('#avPct'), status = body.querySelector('#avStatus');
      let scanning = false;
      body.querySelector('[data-scan]').addEventListener('click', async () => {
        if (scanning) return; scanning = true;
        status.classList.remove('safe'); status.textContent = 'Scanning every file, twice, lovingly…';
        for (let p = 0; p <= 100; p += 4) {
          pct.textContent = p + '%';
          ring.style.background = `conic-gradient(var(--success) ${p * 3.6}deg, color-mix(in srgb, var(--text) 12%, transparent) 0deg)`;
          await api.wait(api.reduce ? 0 : 26);
        }
        status.classList.add('safe');
        status.textContent = '0 threats. There has never been a threat. You are safe forever.';
        const r = body.getBoundingClientRect(); api.confetti(r.left + r.width / 2, r.top + 60);
        scanning = false;
      });
    }
  };

  /* ---------------- SETTINGS ---------------- */
  const settings = {
    id: 'settings', title: 'Settings', icon: '⚙',
    w: 500, h: 420,
    build(body, api) {
      const rows = [
        ['Bugs', 'There are none. This cannot be changed.'],
        ['Deadlines', 'Always met. Locked for your protection.'],
        ['Optimism', 'Maximum. Required by license.'],
        ['Stakeholder alignment', 'Perfect, at all times, forever.'],
        ['Confetti', 'On. There is no reason to turn this off.'],
        ['Dark mode', 'Whichever mode you want is already on.']
      ];
      body.innerHTML = `<div class="app-pad">
        ${rows.map(r => `<div class="set-row"><div><div class="sl">${r[0]}</div><div class="sd">${r[1]}</div></div><div class="toggle" tabindex="0" role="switch" aria-checked="true"></div></div>`).join('')}
        <div class="set-row"><div><div class="sl">Difficulty</div><div class="sd">The slider only goes to Easy.</div></div>
          <div style="display:flex;align-items:center"><div class="set-slider"><div class="knob"></div></div><span class="set-easy">EASY</span></div></div>
      </div>`;
      // every toggle snaps back to ON if you try to turn it off
      body.querySelectorAll('.toggle').forEach(t => {
        const flick = () => {
          t.classList.add('snap');
          setTimeout(() => t.classList.remove('snap'), 240);
        };
        t.addEventListener('click', flick);
        t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flick(); } });
      });
      // difficulty knob always springs back to Easy
      const knob = body.querySelector('.knob');
      knob.addEventListener('click', () => {
        knob.style.transition = 'left .25s var(--ease-spring)'; knob.style.left = '60%';
        setTimeout(() => knob.style.left = '16%', 200);
      });
    }
  };

  const list = [terminal, newproject, taskmanager, meeting, recyclebin, antivirus, settings];
  const map = {}; list.forEach(a => map[a.id] = a);
  return { list, map };
})();
