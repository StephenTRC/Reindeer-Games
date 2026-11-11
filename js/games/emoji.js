/* Emoji Carols — the room shouts the carol, song or movie; the host awards it. */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var ROUNDS = 10, FULL = 300, HINTED = 200, SECONDS = 30;

  RG.register('emoji', {
    title: 'Emoji Carols', icon: '🎤', accent: '#ffd166',
    tagline: 'Name the carol, song or movie hiding in the emoji.',
    meta: ['Whole room', '10 min'],
    mount: function (stage) {
      var deck, n, tally, hinted, revealed, timer = 0, left = 0;

      function intro() {
        stage.replaceChildren(h('div', { class: 'panel intro' },
          h('p', { class: 'eyebrow' }, 'How it works'),
          h('h2', null, 'Shout it out'),
          h('ol', { class: 'steps' },
            h('li', null, 'A string of emoji goes up. It’s a carol, a Christmas song, or a Christmas movie.'),
            h('li', null, 'First team to shout the right title wins ', h('b', null, FULL + ' points'), '.'),
            h('li', null, 'Stuck? Take the hint and it’s worth ', h('b', null, HINTED), '.')),
          h('p', { class: 'muted' }, 'Host keys: H hint · Space reveal · 1–4 award a team · N nobody'),
          h('button', { class: 'btn btn--big', type: 'button', onclick: start }, 'Start · ' + ROUNDS + ' rounds')));
      }
      function start() {
        deck = RG.shuffle(window.RG_DATA.emoji).slice(0, ROUNDS);
        n = 0; tally = {};
        round();
      }
      function stopTimer() { clearInterval(timer); timer = 0; }

      function round() {
        stopTimer();
        hinted = false; revealed = false; left = SECONDS;
        var item = deck[n];
        var bar = h('div', { class: 'timebar' }, h('span', { style: { '--f': 1 } }));
        var worth = h('span', { class: 'worth' }, FULL + ' pts');
        var hintEl = h('p', { class: 'emoji-hint' }, ' ');
        var answer = h('p', { class: 'emoji-answer', hidden: true }, item.answer);
        var actions = h('div', { class: 'row' });
        var award = h('div', { class: 'awardrow', hidden: true });

        function paintActions() {
          actions.replaceChildren(
            h('button', { class: 'btn btn--ghost', type: 'button', disabled: hinted || revealed, onclick: hint }, 'Hint'),
            h('button', { class: 'btn', type: 'button', disabled: revealed, onclick: reveal }, 'Reveal answer'));
        }
        function hint() {
          if (hinted || revealed) return;
          hinted = true; hintEl.textContent = 'It’s a ' + item.cat.toLowerCase();
          worth.textContent = HINTED + ' pts'; RG.sfx.tick(); paintActions();
        }
        function reveal() {
          if (revealed) return;
          revealed = true; stopTimer();
          answer.hidden = false; RG.sfx.reveal(); paintActions();
          award.hidden = false;
          RG.fill(award, h('span', { class: 'awardrow-label' }, 'Who got it?'),
            RG.teams().map(function (t, i) {
              return h('button', { class: 'teambtn', type: 'button', style: { '--team': t.color }, onclick: function () { give(t); } },
                h('kbd', null, i + 1), t.name);
            }),
            h('button', { class: 'btn btn--ghost', type: 'button', onclick: function () { give(null); } }, 'Nobody'));
        }
        function give(t) {
          if (t) {
            var pts = hinted ? HINTED : FULL;
            tally[t.id] = (tally[t.id] || 0) + pts;
            RG.award(t.id, pts); RG.sfx.ding();
          }
          n++;
          if (n >= deck.length) { stopTimer(); current = null; RG.summary(stage, 'Emoji Carols', tally, start); }
          else round();
        }
        current = { hint: hint, reveal: reveal, give: give, isRevealed: function () { return revealed; } };

        paintActions();
        stage.replaceChildren(h('div', { class: 'quiz' },
          h('div', { class: 'quiz-head' }, h('span', { class: 'pill' }, 'Round ' + (n + 1) + ' of ' + deck.length), worth),
          bar,
          h('div', { class: 'emoji-card' },
            h('p', { class: 'emoji-big', 'aria-label': 'Emoji puzzle' }, item.emoji),
            hintEl, answer),
          actions, award));

        timer = setInterval(function () {
          left -= 0.1;
          bar.firstChild.style.setProperty('--f', Math.max(0, left / SECONDS));
          if (left <= 0) { stopTimer(); RG.sfx.buzz(); bar.classList.add('out'); }
        }, 100);
      }

      var current = null;
      function onKey(e) {
        if (!current || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        if (document.querySelector('dialog[open]')) return;
        var k = e.key.toLowerCase();
        if (k === 'h') current.hint();
        else if (k === ' ') { e.preventDefault(); current.reveal(); }
        else if (current.isRevealed() && k === 'n') current.give(null);
        else if (current.isRevealed() && /^[1-4]$/.test(k) && RG.teams()[k - 1]) current.give(RG.teams()[k - 1]);
      }
      document.addEventListener('keydown', onKey);
      intro();
      return function () { stopTimer(); current = null; document.removeEventListener('keydown', onKey); };
    }
  });
})();
