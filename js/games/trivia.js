/* Advent Trivia — 25 numbered doors. Teams take turns opening one; any team can answer
   what's behind it. Which question (and how many points) hides behind each door is
   shuffled every game, so nobody knows what they're picking. */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var SAVE = 'trc-reindeer-games-advent-v1';
  var VALUES = [100, 100, 200, 200, 300];   // by position in each category: easiest first
  var DOORS = ['#e5383f', '#1f9d6b', '#1987a0', '#d99a1e'];

  RG.register('trivia', {
    title: 'Advent Trivia', icon: '⭐', accent: '#c79bff',
    tagline: 'Open a door and answer what’s hiding behind it.',
    meta: ['Whole room', '20 min'],
    mount: function (stage) {
      var cats = window.RG_DATA.trivia;
      var all = [];
      cats.forEach(function (c, ci) { c.qs.forEach(function (q, qi) { all.push(ci + '-' + qi); }); });
      var total = all.length;

      function newBoard() { return { doors: RG.shuffle(all), used: {}, turn: 0, tally: {} }; }
      function loadBoard() {
        try {
          var s = JSON.parse(localStorage.getItem(SAVE));
          if (s && Array.isArray(s.doors) && s.doors.length === total && s.used) return s;
        } catch (e) { /* start fresh */ }
        return newBoard();
      }
      function persist() { try { localStorage.setItem(SAVE, JSON.stringify(board)); } catch (e) { /* not fatal */ } }

      var board = loadBoard();
      var overlay = h('div', { class: 'stage-overlay', hidden: true });
      var wrap = h('div', { class: 'trivia' });
      stage.append(wrap, overlay);

      function usedCount() { return Object.keys(board.used).length; }
      function picker() { var t = RG.teams(); return t[board.turn % t.length]; }

      function paint() {
        var p = picker();
        wrap.replaceChildren(
          h('div', { class: 'quiz-head' },
            h('span', { class: 'pill pill--team', style: { '--team': p.color } }, p.name + ', open a door'),
            h('span', { class: 'row' },
              h('span', { class: 'muted' }, usedCount() + ' of ' + total + ' opened'),
              h('button', { class: 'btn btn--ghost btn--small', type: 'button', onclick: rules }, 'How to play'),
              usedCount() ? h('button', { class: 'btn btn--ghost btn--small', type: 'button', onclick: finish }, 'End game') : null)),
          h('div', { class: 'doors' }, board.doors.map(function (_, i) {
            var who = board.used[i];
            var winner = who && who !== 'none' ? RG.team(who) : null;
            return h('button', {
              class: 'door' + (who ? ' is-open' : ''), type: 'button', disabled: !!who,
              style: { '--door': DOORS[(i + Math.floor(i / 5)) % DOORS.length], '--team': winner ? winner.color : null },
              'aria-label': 'Door ' + (i + 1) + (who ? ', already opened' : ''),
              onclick: function () { ask(i); }
            }, who ? (winner ? winner.name : '❄') : i + 1);
          })));
      }

      function ask(i) {
        var parts = board.doors[i].split('-'), col = Number(parts[0]), row = Number(parts[1]);
        var q = cats[col].qs[row], value = VALUES[row] || 100;
        var answer = h('p', { class: 'q-answer', hidden: true }, q.a);
        var award = h('div', { class: 'awardrow', hidden: true });
        var showBtn = h('button', { class: 'btn btn--big', type: 'button', onclick: show }, 'Show answer');
        function show() {
          answer.hidden = false; showBtn.hidden = true; award.hidden = false; RG.sfx.reveal();
          RG.fill(award, h('span', { class: 'awardrow-label' }, 'Who got it?'),
            RG.teams().map(function (t) {
              return h('button', { class: 'teambtn', type: 'button', style: { '--team': t.color }, onclick: function () { settle(t); } }, t.name);
            }),
            h('button', { class: 'btn btn--ghost', type: 'button', onclick: function () { settle(null); } }, 'Nobody'));
        }
        function settle(t) {
          board.used[i] = t ? t.id : 'none';
          if (t) { board.tally[t.id] = (board.tally[t.id] || 0) + value; RG.award(t.id, value); RG.sfx.ding(); }
          board.turn++;
          persist();
          overlay.hidden = true;
          if (usedCount() >= total) finish(); else paint();
        }
        overlay.replaceChildren(h('div', { class: 'panel qcard' },
          h('p', { class: 'eyebrow' }, 'Door ' + (i + 1) + ' · ' + cats[col].name),
          h('p', { class: 'worth' }, value + ' points'),
          h('h2', { class: 'q-text' }, q.q),
          answer, showBtn, award,
          h('button', { class: 'linkbtn', type: 'button', onclick: function () { overlay.hidden = true; } }, 'Close this door without scoring')));
        overlay.hidden = false;
        RG.sfx.tick();
      }

      function rules() {
        overlay.replaceChildren(h('div', { class: 'panel intro' },
          h('p', { class: 'eyebrow' }, 'How it works'),
          h('h2', null, 'Open a door'),
          h('ol', { class: 'steps' },
            h('li', null, 'Teams take turns picking a door. Nobody knows what’s behind it.'),
            h('li', null, 'Each door hides a question worth ', h('b', null, '100, 200 or 300 points'), '.'),
            h('li', null, 'Any team can answer — first hand up. Show the answer and tap the team that got it.'),
            h('li', null, 'No penalty for a wrong guess.')),
          h('p', { class: 'muted' }, 'Categories: ' + cats.map(function (c) { return c.name; }).join(' · ')),
          h('button', { class: 'btn btn--big', type: 'button', onclick: function () { overlay.hidden = true; } }, 'Got it')));
        overlay.hidden = false;
      }
      function fresh() {
        board = newBoard();
        persist(); overlay.hidden = true; stage.replaceChildren(wrap, overlay); paint();
      }
      function finish() {
        var tally = board.tally;
        try { localStorage.removeItem(SAVE); } catch (e) { /* not fatal */ }
        board = newBoard();
        RG.summary(stage, 'Advent Trivia', tally, fresh);
      }

      paint();
      if (!usedCount()) rules();
      return null;
    }
  });
})();
