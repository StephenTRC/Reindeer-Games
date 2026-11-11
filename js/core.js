/* Reindeer Games — shared core: teams, scores, sound, snow, routing.
   Plain script (no modules, no build step) so the site also runs by
   double-clicking index.html. Everything hangs off window.RG. */
(function () {
  'use strict';

  var STORE_KEY = 'trc-reindeer-games-v1';
  var PRESETS = [
    { name: 'Dasher', color: '#ff5a5f' },
    { name: 'Dancer', color: '#3ddc97' },
    { name: 'Prancer', color: '#ffd166' },
    { name: 'Vixen', color: '#c79bff' }
  ];

  /* ---------- tiny DOM helper ---------- */
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'style') {
          Object.keys(v).forEach(function (p) {
            if (p.indexOf('--') === 0) el.style.setProperty(p, v[p]);
            else el.style[p] = v[p];
          });
        } else if (k === 'html') el.innerHTML = v; // only ever used with our own static markup
        else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) kid.forEach(function (k) { append(el, k); });
    else el.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  /* Replace an element's children; unlike el.replaceChildren this accepts arrays. */
  function fill(el) {
    el.replaceChildren();
    for (var i = 1; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- saved state ---------- */
  function freshTeams(n) {
    return PRESETS.slice(0, n).map(function (p, i) {
      return { id: 't' + i, name: p.name, color: p.color, score: 0 };
    });
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && Array.isArray(s.teams) && s.teams.length >= 2) return s;
    } catch (e) { /* storage blocked or empty: start fresh */ }
    return null;
  }
  var state = load() || { teams: freshTeams(4), sound: true };
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* fine: scores just won't survive a reload */ }
  }

  function teams() { return state.teams; }
  function team(id) {
    for (var i = 0; i < state.teams.length; i++) if (state.teams[i].id === id) return state.teams[i];
    return null;
  }
  function teamsChanged() {
    save();
    document.querySelectorAll('.scorebar').forEach(renderScorebar);
    document.dispatchEvent(new CustomEvent('rg:teams'));
  }
  function setTeamCount(n) {
    while (state.teams.length > n) state.teams.pop();
    while (state.teams.length < n) {
      var p = PRESETS[state.teams.length];
      state.teams.push({ id: 't' + state.teams.length, name: p.name, color: p.color, score: 0 });
    }
    teamsChanged();
  }
  function award(id, pts, opts) {
    var t = team(id);
    if (!t || !pts) return;
    t.score = Math.max(0, t.score + pts);
    teamsChanged();
    if (!opts || !opts.quiet) toast((pts > 0 ? '+' : '') + pts + ' ' + t.name, t.color);
    var chip = document.querySelector('.scorebar [data-team="' + id + '"]');
    if (chip) { chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump'); }
  }

  /* ---------- score bar (shown in every game) ---------- */
  function renderScorebar(el) {
    el.replaceChildren();
    var top = Math.max.apply(null, state.teams.map(function (t) { return t.score; }));
    state.teams.forEach(function (t) {
      el.appendChild(h('div', {
        class: 'teamchip' + (t.score === top && top > 0 ? ' is-leading' : ''),
        'data-team': t.id, style: { '--team': t.color }
      },
        h('span', { class: 'teamchip-name' }, t.name),
        h('span', { class: 'teamchip-score' }, t.score)));
    });
  }
  function scorebar() {
    var el = h('div', { class: 'scorebar', 'aria-label': 'Team scores' });
    renderScorebar(el);
    return el;
  }

  /* ---------- toasts ---------- */
  function toast(msg, color) {
    var box = $('#toasts');
    var t = h('div', { class: 'toast', style: { '--team': color || '#fff' } }, msg);
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 1600);
    setTimeout(function () { t.remove(); }, 2100);
  }

  /* ---------- sound (synthesised, no audio files) ---------- */
  var actx = null;
  function audio() {
    if (!state.sound) return null;
    if (!actx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      actx = new A();
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur, type, delay, vol) {
    var a = audio();
    if (!a) return;
    var t0 = a.currentTime + (delay || 0);
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }
  var sfx = {
    tick: function () { tone(660, 0.12, 'triangle'); },
    go: function () { tone(990, 0.4, 'triangle', 0, 0.2); },
    step: function () { tone(300 + Math.random() * 80, 0.04, 'square', 0, 0.03); },
    pop: function () { tone(880, 0.09, 'sine'); tone(1320, 0.12, 'sine', 0.05); },
    star: function () { [1047, 1319, 1568].forEach(function (f, i) { tone(f, 0.16, 'sine', i * 0.05); }); },
    ding: function () { tone(1047, 0.18, 'sine'); tone(1568, 0.4, 'sine', 0.1); },
    buzz: function () { tone(150, 0.3, 'sawtooth', 0, 0.12); tone(110, 0.3, 'sawtooth', 0.02, 0.12); },
    reveal: function () { tone(523, 0.12, 'triangle'); tone(784, 0.22, 'triangle', 0.09); },
    win: function () { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, 0.24, 'triangle', i * 0.11, 0.18); }); }
  };

  /* ---------- confetti ---------- */
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = h('canvas', { class: 'confetti', 'aria-hidden': 'true' });
    document.body.appendChild(c);
    var W = c.width = innerWidth, H = c.height = innerHeight, ctx = c.getContext('2d');
    var cols = ['#ff5a5f', '#3ddc97', '#ffd166', '#ffffff', '#4fb3c9'];
    var bits = [];
    for (var i = 0; i < 160; i++) {
      bits.push({
        x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35,
        vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 3,
        s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        c: cols[i % cols.length]
      });
    }
    var start = performance.now();
    (function frame(now) {
      var age = now - start;
      ctx.clearRect(0, 0, W, H);
      bits.forEach(function (b) {
        b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.vx *= 0.99; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.globalAlpha = Math.max(0, 1 - age / 2600);
        ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      });
      if (age < 2600) requestAnimationFrame(frame); else c.remove();
    })(start);
  }

  /* ---------- snowfall backdrop ---------- */
  function startSnow() {
    var c = $('#snow'), ctx = c.getContext('2d');
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W, H, flakes = [];
    function size() {
      W = c.width = innerWidth; H = c.height = innerHeight;
      var n = Math.min(170, Math.round(W * H / 11000));
      flakes = [];
      for (var i = 0; i < n; i++) {
        flakes.push({
          x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 2.6,
          v: 14 + Math.random() * 36, sway: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6
        });
      }
      draw(0);
    }
    function draw(dt) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.v * dt; f.sway += dt; f.x += Math.sin(f.sway) * 12 * dt;
        if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        ctx.globalAlpha = f.a;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill();
      }
    }
    var last = 0;
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!document.hidden) draw(dt);
      requestAnimationFrame(loop);
    }
    addEventListener('resize', size);
    size();
    if (!still) requestAnimationFrame(function (t) { last = t; loop(t); });
  }

  /* ---------- team editor ---------- */
  function openTeams() {
    var dlg = $('#teams-dialog');
    renderTeamEditor();
    if (!dlg.open) dlg.showModal();
  }
  function renderTeamEditor() {
    var list = $('#teams-list');
    list.replaceChildren();
    document.querySelectorAll('.teamcount button').forEach(function (b) {
      b.classList.toggle('on', Number(b.dataset.count) === state.teams.length);
    });
    state.teams.forEach(function (t) {
      var score = h('output', { class: 'teamrow-score' }, t.score);
      function bump(d) { return function () { t.score = Math.max(0, t.score + d); score.textContent = t.score; teamsChanged(); }; }
      list.appendChild(h('div', { class: 'teamrow', style: { '--team': t.color } },
        h('span', { class: 'teamrow-dot', 'aria-hidden': 'true' }),
        h('input', {
          type: 'text', maxlength: '16', value: t.name, 'aria-label': 'Team name',
          oninput: function (e) { t.name = e.target.value.trim() || 'Team'; teamsChanged(); }
        }),
        h('button', { type: 'button', class: 'stepper', 'aria-label': 'Take 100 points from ' + t.name, onclick: bump(-100) }, '−'),
        score,
        h('button', { type: 'button', class: 'stepper', 'aria-label': 'Give 100 points to ' + t.name, onclick: bump(100) }, '+')));
    });
  }

  /* ---------- routing ---------- */
  var games = {}, order = [], cleanup = null, homeRenderer = null;
  function register(id, def) { def.id = id; games[id] = def; order.push(id); }
  function go(id) { location.hash = id ? '#/' + id : '#/'; }
  function render() {
    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    var id = location.hash.replace(/^#\/?/, '');
    var app = $('#app');
    app.replaceChildren();
    window.scrollTo(0, 0);
    var g = games[id];
    if (!g) {
      document.body.dataset.view = 'home';
      document.title = 'Reindeer Games · Three Rivers Church Students';
      if (homeRenderer) homeRenderer(app);
      return;
    }
    document.body.dataset.view = 'game';
    document.title = g.title + ' · Reindeer Games';
    var stage = h('div', { class: 'stage' });
    app.appendChild(h('section', { class: 'game game--' + id, style: { '--accent': g.accent } },
      h('div', { class: 'gamebar' },
        h('a', { class: 'backlink', href: '#/' }, h('span', { 'aria-hidden': 'true' }, '←'), ' All games'),
        h('h1', { class: 'gamebar-title' }, h('span', { 'aria-hidden': 'true' }, g.icon + ' '), g.title),
        scorebar()),
      stage));
    cleanup = g.mount(stage) || null;
  }

  /* Shared end-of-game panel: what each team earned in this game. */
  function summary(stage, title, tally, onAgain) {
    var rows = teams().map(function (t) { return { t: t, pts: tally[t.id] || 0 }; })
      .sort(function (a, b) { return b.pts - a.pts; });
    var best = rows[0].pts;
    stage.replaceChildren(h('div', { class: 'panel summary' },
      h('p', { class: 'eyebrow' }, 'That’s a wrap'),
      h('h2', null, title),
      h('ol', { class: 'ranklist' }, rows.map(function (r) {
        return h('li', { class: r.pts === best && best > 0 ? 'is-top' : '', style: { '--team': r.t.color } },
          h('span', { class: 'rank-name' }, r.t.name),
          h('span', { class: 'rank-pts' }, '+' + r.pts));
      })),
      h('p', { class: 'muted' }, 'Points are already on the scoreboard.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn--ghost', type: 'button', onclick: onAgain }, 'Play again'),
        h('a', { class: 'btn', href: '#/' }, 'Back to all games'))));
    if (best > 0) { sfx.win(); confetti(); }
  }

  /* ---------- boot ---------- */
  function boot() {
    startSnow();
    var soundBtn = $('#btn-sound');
    function paintSound() {
      soundBtn.setAttribute('aria-pressed', String(state.sound));
      soundBtn.firstElementChild.textContent = state.sound ? '🔔' : '🔕';
    }
    paintSound();
    soundBtn.addEventListener('click', function () {
      state.sound = !state.sound; save(); paintSound();
      if (state.sound) sfx.ding();
    });
    $('#btn-teams').addEventListener('click', openTeams);
    $('#btn-full').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    });
    document.querySelectorAll('.teamcount button').forEach(function (b) {
      b.addEventListener('click', function () { setTeamCount(Number(b.dataset.count)); renderTeamEditor(); });
    });
    $('#btn-reset-scores').addEventListener('click', function () {
      if (!confirm('Reset every team’s score to 0?')) return;
      state.teams.forEach(function (t) { t.score = 0; });
      teamsChanged(); renderTeamEditor();
    });
    addEventListener('hashchange', render);
    render();
  }

  window.RG = {
    h: h, $: $, fill: fill, shuffle: shuffle,
    teams: teams, team: team, award: award, openTeams: openTeams,
    scorebar: scorebar, toast: toast, sfx: sfx, confetti: confetti, summary: summary,
    register: register, games: games, order: order, go: go, rerender: render,
    setHome: function (fn) { homeRenderer = fn; },
    boot: boot
  };
})();
