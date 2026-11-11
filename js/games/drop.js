/* Present Drop — each team sends one player to catch presents for 30 seconds. */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var W = 1280, H = 720, ROUND = 30, GROUND = 664;
  var WRAP = ['#ff5a5f', '#3ddc97', '#4fb3c9', '#c79bff', '#ff9f43'];

  RG.register('drop', {
    title: 'Present Drop', icon: '🎁', accent: '#3ddc97',
    tagline: 'Catch the presents, grab the stars, dodge the coal.',
    meta: ['One at a time', '5 min'],
    mount: function (stage) {
      var teams = RG.teams().slice();
      var canvas = h('canvas', { class: 'drop-canvas', width: W, height: H, 'aria-label': 'Present Drop play area' });
      var ctx = canvas.getContext('2d');
      var overlay = h('div', { class: 'stage-overlay' });
      stage.appendChild(h('div', { class: 'drop' }, canvas, overlay));

      var alive = true, raf = 0, timers = [];
      var turn = 0, scores = {}, phase = 'ready';   // ready | countdown | play | between | final
      var px = W / 2, keys = {}, items = [], floaters = [], score = 0, timeLeft = ROUND, spawnIn = 0, shake = 0, count = 0;
      var stars = [];
      for (var i = 0; i < 70; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.6 + 0.4 });

      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function current() { return teams[turn]; }

      /* ---------- overlays ---------- */
      function show() { overlay.hidden = false; overlay.replaceChildren.apply(overlay, arguments); }
      function showReady() {
        phase = 'ready';
        var t = current();
        show(h('div', { class: 'panel', style: { '--team': t.color } },
          h('p', { class: 'eyebrow' }, 'Turn ' + (turn + 1) + ' of ' + teams.length),
          h('h2', null, h('span', { class: 'teamname' }, t.name), ', you’re up'),
          h('p', null, 'Pick one catcher. You have ' + ROUND + ' seconds.'),
          h('ul', { class: 'legend' },
            h('li', null, h('b', null, '+10'), ' present'),
            h('li', null, h('b', null, '+25'), ' gold star'),
            h('li', null, h('b', null, '−15'), ' lump of coal')),
          h('p', { class: 'muted' }, 'Move with the ← → keys, the mouse, or a finger.'),
          h('button', { class: 'btn btn--big', type: 'button', onclick: startTurn }, 'Start')));
      }
      function startTurn() {
        overlay.hidden = true;
        items = []; floaters = []; score = 0; timeLeft = ROUND; spawnIn = 0.4; px = W / 2; keys = {};
        phase = 'countdown'; count = 3; RG.sfx.tick();
        later(function () { count = 2; RG.sfx.tick(); }, 700);
        later(function () { count = 1; RG.sfx.tick(); }, 1400);
        later(function () { count = 0; phase = 'play'; RG.sfx.go(); }, 2100);
      }
      function endTurn() {
        phase = 'between';
        var t = current();
        scores[t.id] = score;
        RG.sfx.ding();
        var last = turn === teams.length - 1;
        show(h('div', { class: 'panel', style: { '--team': t.color } },
          h('p', { class: 'eyebrow' }, 'Time!'),
          h('h2', null, h('span', { class: 'teamname' }, t.name), ' scored ' + score),
          h('button', {
            class: 'btn btn--big', type: 'button',
            onclick: function () { if (last) showFinal(); else { turn++; showReady(); } }
          }, last ? 'See the results' : 'Next team')));
      }
      function showFinal() {
        phase = 'final';
        var ranked = teams.slice().sort(function (a, b) { return scores[b.id] - scores[a.id]; });
        var rows = ranked.map(function (t) {
          var beaten = teams.filter(function (o) { return scores[o.id] < scores[t.id]; }).length;
          var pts = beaten * 100;
          if (pts) RG.award(t.id, pts, { quiet: true });
          return h('li', { style: { '--team': t.color }, class: beaten === teams.length - 1 ? 'is-top' : '' },
            h('span', { class: 'rank-name' }, t.name),
            h('span', { class: 'rank-detail' }, scores[t.id] + ' caught'),
            h('span', { class: 'rank-pts' }, '+' + pts));
        });
        show(h('div', { class: 'panel' },
          h('p', { class: 'eyebrow' }, 'Final tally'),
          h('h2', null, ranked[0].name + ' takes it!'),
          h('ol', { class: 'ranklist' }, rows),
          h('p', { class: 'muted' }, '100 points for every team you beat.'),
          h('div', { class: 'row' },
            h('button', { class: 'btn btn--ghost', type: 'button', onclick: function () { turn = 0; scores = {}; teams = RG.teams().slice(); showReady(); } }, 'Play again'),
            h('a', { class: 'btn', href: '#/' }, 'Back to all games'))));
        RG.sfx.win(); RG.confetti();
      }

      /* ---------- simulation ---------- */
      function spawn() {
        var elapsed = ROUND - timeLeft, roll = Math.random();
        var type = roll < 0.66 ? 'gift' : roll < 0.9 ? 'coal' : 'star';
        items.push({
          type: type, x: 70 + Math.random() * (W - 140), y: -40,
          vy: (250 + elapsed * 9) * (type === 'star' ? 1.25 : 0.85 + Math.random() * 0.3),
          rot: (Math.random() - 0.5) * 0.6, vr: (Math.random() - 0.5) * 1.6,
          color: WRAP[Math.floor(Math.random() * WRAP.length)]
        });
      }
      function update(dt) {
        if (phase !== 'play') return;
        var dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        px = Math.max(100, Math.min(W - 100, px + dir * 950 * dt));
        timeLeft -= dt;
        spawnIn -= dt;
        if (spawnIn <= 0) { spawn(); spawnIn = Math.max(0.3, 0.75 - (ROUND - timeLeft) * 0.016); }
        var sleighTop = GROUND - 78;
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.y += it.vy * dt; it.rot += it.vr * dt;
          if (it.y > sleighTop - 10 && it.y < sleighTop + 46 && Math.abs(it.x - px) < 104) {
            var pts = it.type === 'gift' ? 10 : it.type === 'star' ? 25 : -15;
            score = Math.max(0, score + pts);
            floaters.push({ x: it.x, y: sleighTop - 20, t: 0, text: (pts > 0 ? '+' : '−') + Math.abs(pts), bad: pts < 0 });
            if (it.type === 'coal') { shake = 0.3; RG.sfx.buzz(); }
            else if (it.type === 'star') RG.sfx.star(); else RG.sfx.pop();
            items.splice(i, 1);
          } else if (it.y > H + 60) items.splice(i, 1);
        }
        if (timeLeft <= 0) { timeLeft = 0; endTurn(); }
      }

      /* ---------- drawing ---------- */
      function rr(x, y, w, hh, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + hh, r); ctx.arcTo(x + w, y + hh, x, y + hh, r);
        ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
      }
      function drawGift(it) {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.fillStyle = it.color; rr(-30, -26, 60, 54, 8); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(-6, -26, 12, 54); ctx.fillRect(-30, -5, 60, 11);
        ctx.beginPath(); ctx.arc(-10, -31, 9, 0, 6.2832); ctx.arc(10, -31, 9, 0, 6.2832); ctx.fill();
        ctx.restore();
      }
      function drawStar(it) {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 26; ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        for (var k = 0; k < 10; k++) {
          var rad = k % 2 ? 15 : 34, a = -Math.PI / 2 + k * Math.PI / 5;
          ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
      function drawCoal(it) {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.fillStyle = '#1c2227'; ctx.strokeStyle = '#5d6b75'; ctx.lineWidth = 3;
        ctx.beginPath();
        [[-28, -8], [-12, -27], [14, -24], [30, -4], [22, 22], [-6, 28], [-26, 14]].forEach(function (p, k) {
          if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
        });
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5d6b75';
        ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(6, -16); ctx.lineTo(-2, -4); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      function drawSleigh(color) {
        var y = GROUND;
        ctx.save(); ctx.translate(px, y);
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-100, 0); ctx.lineTo(86, 0); ctx.quadraticCurveTo(118, 0, 114, -34); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-60, -22); ctx.moveTo(50, 0); ctx.lineTo(50, -22); ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-104, -78); ctx.quadraticCurveTo(-112, -20, -70, -20); ctx.lineTo(70, -20);
        ctx.quadraticCurveTo(104, -22, 104, -62); ctx.lineTo(88, -62); ctx.quadraticCurveTo(84, -50, 60, -50);
        ctx.lineTo(-60, -50); ctx.quadraticCurveTo(-80, -52, -84, -78); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.9)'; rr(-112, -88, 36, 14, 7); ctx.fill(); rr(82, -72, 28, 13, 6); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(-70, -34, 140, 8, 4); ctx.fill();
        ctx.restore();
      }
      function draw() {
        ctx.save();
        if (shake > 0) ctx.translate((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16);
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#051a22'); sky.addColorStop(1, '#125066');
        ctx.fillStyle = sky; ctx.fillRect(-20, -20, W + 40, H + 40);
        ctx.fillStyle = '#fff';
        stars.forEach(function (s) { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill(); });
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#eaf7fb';
        ctx.beginPath(); ctx.moveTo(-20, GROUND + 6);
        ctx.bezierCurveTo(W * 0.3, GROUND - 14, W * 0.7, GROUND + 22, W + 20, GROUND);
        ctx.lineTo(W + 20, H + 20); ctx.lineTo(-20, H + 20); ctx.closePath(); ctx.fill();

        var t = current();
        items.forEach(function (it) { (it.type === 'gift' ? drawGift : it.type === 'star' ? drawStar : drawCoal)(it); });
        drawSleigh(t.color);

        ctx.textAlign = 'center'; ctx.font = '700 44px Fredoka, sans-serif';
        floaters.forEach(function (f) {
          ctx.globalAlpha = Math.max(0, 1 - f.t / 0.8);
          ctx.fillStyle = f.bad ? '#ff8a8e' : '#ffffff';
          ctx.fillText(f.text, f.x, f.y - f.t * 90);
        });
        ctx.globalAlpha = 1;

        // HUD: team, time bar, score
        ctx.textBaseline = 'middle';
        ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(52, 52, 14, 0, 6.2832); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = '600 38px Fredoka, sans-serif';
        ctx.fillText(t.name, 78, 54);
        ctx.textAlign = 'right'; ctx.font = '700 64px Fredoka, sans-serif';
        ctx.fillText(String(score), W - 44, 58);
        ctx.fillStyle = 'rgba(255,255,255,.18)'; rr(W / 2 - 220, 40, 440, 24, 12); ctx.fill();
        var frac = Math.max(0, timeLeft / ROUND);
        if (frac > 0) { ctx.fillStyle = frac < 0.2 ? '#ff5a5f' : '#ffd166'; rr(W / 2 - 220, 40, Math.max(24, 440 * frac), 24, 12); ctx.fill(); }
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '600 26px Fredoka, sans-serif';
        ctx.fillText(Math.ceil(timeLeft) + ' s', W / 2, 90);

        if (phase === 'countdown') {
          ctx.font = '700 260px Fredoka, sans-serif'; ctx.fillStyle = '#fff';
          ctx.fillText(String(count), W / 2, H / 2 - 20);
        }
        ctx.textBaseline = 'alphabetic';
        ctx.restore();
      }

      var last = performance.now();
      function loop(now) {
        if (!alive) return;
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        update(dt);
        floaters.forEach(function (f) { f.t += dt; });
        floaters = floaters.filter(function (f) { return f.t < 0.8; });
        if (shake > 0) shake -= dt;
        draw();
        raf = requestAnimationFrame(loop);
      }

      /* ---------- input ---------- */
      function keySide(e) {
        var k = e.key.toLowerCase();
        return k === 'arrowleft' || k === 'a' ? 'left' : k === 'arrowright' || k === 'd' ? 'right' : null;
      }
      function onDown(e) { var s = keySide(e); if (s && phase === 'play') { keys[s] = true; e.preventDefault(); } }
      function onUp(e) { var s = keySide(e); if (s) keys[s] = false; }
      function onPointer(e) {
        if (phase !== 'play') return;
        var r = canvas.getBoundingClientRect();
        px = Math.max(100, Math.min(W - 100, (e.clientX - r.left) / r.width * W));
      }
      document.addEventListener('keydown', onDown);
      document.addEventListener('keyup', onUp);
      canvas.addEventListener('pointermove', onPointer);
      canvas.addEventListener('pointerdown', onPointer);

      showReady();
      raf = requestAnimationFrame(loop);
      return function () {
        alive = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout);
        document.removeEventListener('keydown', onDown);
        document.removeEventListener('keyup', onUp);
      };
    }
  });
})();
