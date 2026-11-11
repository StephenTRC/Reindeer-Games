/* Reindeer Dash — one racer per team mashes their key (or taps their pad). */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var KEYS = ['q', 'p', 'z', 'm'];

  RG.register('dash', {
    title: 'Reindeer Dash', icon: '🦌', accent: '#ff5a5f',
    tagline: 'Mash your key. First reindeer across the line wins.',
    meta: ['Head to head', '1 min'],
    mount: function (stage) {
      var teams = RG.teams();
      var freeze = false;          // Freeze mode: stop mashing on the red light
      var phase = 'setup';         // setup | countdown | racing | done
      var racers = [], light = 'green', lightSince = 0, startedAt = 0, goal = 60;
      var timers = [];
      function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
      function clearTimers() { timers.forEach(clearTimeout); timers = []; }

      var lightEl = h('div', { class: 'dash-light', 'data-light': 'off' }, 'Ready');
      var modeBtn = h('button', { class: 'btn btn--ghost', type: 'button', 'aria-pressed': 'false', onclick: toggleMode }, 'Freeze mode: off');
      var startBtn = h('button', { class: 'btn btn--big', type: 'button', onclick: startRace }, 'Start race');
      var hint = h('p', { class: 'dash-hint' });
      var track = h('div', { class: 'track' });
      var pads = h('div', { class: 'pads' });
      var overlay = h('div', { class: 'stage-overlay', hidden: true });

      stage.append(h('div', { class: 'dash' },
        h('div', { class: 'dash-top' }, lightEl, hint, h('div', { class: 'row' }, modeBtn, startBtn)),
        h('div', { class: 'track-wrap' }, track),
        pads),
        overlay);

      function paintHint() {
        hint.textContent = freeze
          ? 'Freeze mode: mash on green, hands off on red. Move on red and your reindeer slides back.'
          : 'Send one racer per team to the keyboard. Mash your key as fast as you can.';
      }
      function toggleMode() {
        if (phase === 'countdown' || phase === 'racing') return;
        freeze = !freeze;
        modeBtn.textContent = 'Freeze mode: ' + (freeze ? 'on' : 'off');
        modeBtn.setAttribute('aria-pressed', String(freeze));
        paintHint();
      }

      function build() {
        track.replaceChildren(); pads.replaceChildren();
        racers = teams.map(function (t, i) {
          var runner = h('div', { class: 'runner', html: RG.art.reindeerSide(t.color) });
          var lane = h('div', { class: 'lane', style: { '--team': t.color, '--p': 0 } },
            h('div', { class: 'lane-label' }, h('kbd', null, KEYS[i].toUpperCase()), h('span', null, t.name)),
            h('div', { class: 'lane-run' }, runner, h('div', { class: 'finish', 'aria-hidden': 'true' })));
          track.appendChild(lane);
          var r = { team: t, i: i, lane: lane, runner: runner, progress: 0, time: null, lastBuzz: 0 };
          pads.appendChild(h('button', {
            class: 'pad', type: 'button', style: { '--team': t.color },
            'aria-label': 'Run: ' + t.name,
            onpointerdown: function (e) { e.preventDefault(); step(r); }
          }, t.name, h('small', null, 'tap or press ' + KEYS[i].toUpperCase())));
          return r;
        });
      }

      function setLight(l) {
        light = l; lightSince = performance.now();
        lightEl.dataset.light = l;
        lightEl.textContent = l === 'green' ? 'Go!' : l === 'yellow' ? 'Careful…' : 'Freeze!';
      }
      function cycleLight() {
        if (phase !== 'racing') return;
        setLight('green');
        later(function () {
          if (phase !== 'racing') return;
          setLight('yellow');
          later(function () {
            if (phase !== 'racing') return;
            setLight('red'); RG.sfx.tick();
            later(cycleLight, 1100 + Math.random() * 1000);
          }, 450);
        }, 1400 + Math.random() * 1900);
      }

      function startRace() {
        if (phase === 'countdown' || phase === 'racing') return;
        clearTimers();
        overlay.hidden = true; overlay.replaceChildren();
        goal = freeze ? 50 : 60;
        racers.forEach(function (r) {
          r.progress = 0; r.time = null;
          r.lane.style.setProperty('--p', 0);
          r.runner.classList.remove('slip', 'done');
        });
        phase = 'countdown';
        startBtn.disabled = true; modeBtn.disabled = true;
        lightEl.dataset.light = 'off';
        [3, 2, 1].forEach(function (n, k) {
          later(function () { lightEl.textContent = n; RG.sfx.tick(); }, k * 800);
        });
        later(function () {
          phase = 'racing'; startedAt = performance.now();
          RG.sfx.go();
          if (freeze) cycleLight();
          else { lightEl.dataset.light = 'green'; lightEl.textContent = 'Go!'; }
        }, 2400);
      }

      function step(r) {
        if (phase !== 'racing' || r.time != null) return;
        var now = performance.now();
        if (freeze && light === 'red' && now - lightSince > 140) {
          r.progress = Math.max(0, r.progress - 5);
          r.runner.classList.remove('slip'); void r.runner.offsetWidth; r.runner.classList.add('slip');
          if (now - r.lastBuzz > 400) { RG.sfx.buzz(); r.lastBuzz = now; }
        } else {
          r.progress++;
          r.runner.classList.toggle('stride');
          RG.sfx.step();
        }
        r.lane.style.setProperty('--p', Math.min(1, r.progress / goal));
        if (r.progress >= goal) finish(r, now);
      }

      function finish(r, now) {
        r.time = (now - startedAt) / 1000;
        r.runner.classList.add('done');
        var done = racers.filter(function (x) { return x.time != null; }).length;
        if (done === 1) { RG.sfx.win(); later(endRace, 6000); }   // everyone else gets 6 more seconds
        if (done === racers.length) endRace();
      }

      function endRace() {
        if (phase !== 'racing') return;
        phase = 'done'; clearTimers();
        startBtn.disabled = false; modeBtn.disabled = false;
        startBtn.textContent = 'Race again';
        lightEl.dataset.light = 'off'; lightEl.textContent = 'Finish!';
        // Lower key = better: finishers by time, everyone else by how far they got.
        function key(r) { return r.time != null ? r.time : 1e6 - r.progress; }
        var ranked = racers.slice().sort(function (a, b) { return key(a) - key(b); });
        var rows = ranked.map(function (r) {
          var beaten = racers.filter(function (o) { return key(o) > key(r); }).length;
          var pts = beaten * 100;
          if (pts) RG.award(r.team.id, pts, { quiet: true });
          return h('li', { style: { '--team': r.team.color }, class: beaten === racers.length - 1 ? 'is-top' : '' },
            h('span', { class: 'rank-name' }, r.team.name),
            h('span', { class: 'rank-detail' }, r.time != null ? r.time.toFixed(2) + ' s' : 'did not finish'),
            h('span', { class: 'rank-pts' }, '+' + pts));
        });
        overlay.replaceChildren(h('div', { class: 'panel' },
          h('p', { class: 'eyebrow' }, 'Photo finish'),
          h('h2', null, ranked[0].team.name + ' wins!'),
          h('ol', { class: 'ranklist' }, rows),
          h('p', { class: 'muted' }, '100 points for every team you beat. Swap racers and go again.'),
          h('div', { class: 'row' },
            h('button', { class: 'btn', type: 'button', onclick: startRace }, 'Race again'),
            h('a', { class: 'btn btn--ghost', href: '#/' }, 'Back to all games'))));
        overlay.hidden = false;
        RG.confetti();
      }

      function onKey(e) {
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        var i = KEYS.indexOf(e.key.toLowerCase());
        if (i < 0 || !racers[i]) return;
        if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
        e.preventDefault();
        step(racers[i]);
      }
      function lineup() { return RG.teams().map(function (t) { return t.name + t.color; }).join('|'); }
      var builtFor = lineup();
      function onTeams() {            // teams renamed/added in the editor (not just a score change): rebuild if idle
        if (phase === 'countdown' || phase === 'racing' || lineup() === builtFor) return;
        builtFor = lineup(); teams = RG.teams();
        overlay.hidden = true; build();
      }

      build(); paintHint();
      document.addEventListener('keydown', onKey);
      document.addEventListener('rg:teams', onTeams);
      return function () {
        phase = 'gone'; clearTimers();
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('rg:teams', onTeams);
      };
    }
  });
})();
