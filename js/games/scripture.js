/* Scripture or Tradition? — every team votes on each statement, then the text settles it. */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var ROUNDS = 10, POINTS = 100;
  var LABEL = { scripture: 'In the Bible', tradition: 'Just tradition' };

  RG.register('scripture', {
    title: 'Scripture or Tradition?', icon: '📖', accent: '#4fb3c9',
    tagline: 'Is it in the Bible, or just on the Christmas card?',
    meta: ['Whole room', '10 min'],
    mount: function (stage) {
      var deck, n, tally, votes, revealed;

      function intro() {
        stage.replaceChildren(h('div', { class: 'panel intro' },
          h('p', { class: 'eyebrow' }, 'How it works'),
          h('h2', null, 'What does the text actually say?'),
          h('ol', { class: 'steps' },
            h('li', null, 'A statement about the Christmas story goes up.'),
            h('li', null, 'Each team decides: is it ', h('b', null, 'in the Bible'), ', or is it ', h('b', null, 'just tradition'), '?'),
            h('li', null, 'Lock in every team’s vote, then reveal. Each team that’s right gets ', h('b', null, POINTS + ' points'), '.')),
          h('p', { class: 'muted' }, 'Want them moving? Left side of the room is “In the Bible,” right side is “Just tradition.”'),
          h('button', { class: 'btn btn--big', type: 'button', onclick: start }, 'Start · ' + ROUNDS + ' statements')));
      }
      function start() {
        deck = RG.shuffle(window.RG_DATA.scripture).slice(0, ROUNDS);
        n = 0; tally = {};
        round();
      }

      function round() {
        votes = {}; revealed = false;
        var item = deck[n];
        var zones = {
          scripture: h('div', { class: 'zone zone--scripture' }, h('h3', null, '📖 ' + LABEL.scripture), h('div', { class: 'zone-teams' })),
          tradition: h('div', { class: 'zone zone--tradition' }, h('h3', null, '🎄 ' + LABEL.tradition), h('div', { class: 'zone-teams' }))
        };
        var voters = h('div', { class: 'voters' });
        var verdict = h('div', { class: 'verdict', hidden: true });
        var revealBtn = h('button', { class: 'btn btn--big', type: 'button', onclick: reveal }, 'Reveal');

        function paint() {
          zones.scripture.lastChild.replaceChildren();
          zones.tradition.lastChild.replaceChildren();
          voters.replaceChildren();
          RG.teams().forEach(function (t) {
            var v = votes[t.id];
            if (v) {
              zones[v].lastChild.appendChild(h('button', {
                class: 'votechip', type: 'button', style: { '--team': t.color }, disabled: revealed,
                title: 'Take back this vote', onclick: function () { delete votes[t.id]; paint(); }
              }, t.name));
            } else if (!revealed) {
              voters.appendChild(h('div', { class: 'voter', style: { '--team': t.color } },
                h('button', { type: 'button', 'aria-label': t.name + ' votes in the Bible', onclick: function () { votes[t.id] = 'scripture'; RG.sfx.tick(); paint(); } }, '◀'),
                h('span', null, t.name),
                h('button', { type: 'button', 'aria-label': t.name + ' votes just tradition', onclick: function () { votes[t.id] = 'tradition'; RG.sfx.tick(); paint(); } }, '▶')));
            }
          });
          if (!revealed && !voters.firstChild) voters.appendChild(h('p', { class: 'muted' }, 'All votes are in.'));
        }

        function reveal() {
          if (revealed) return;
          revealed = true;
          zones[item.answer].classList.add('is-right');
          zones[item.answer === 'scripture' ? 'tradition' : 'scripture'].classList.add('is-wrong');
          var winners = RG.teams().filter(function (t) { return votes[t.id] === item.answer; });
          winners.forEach(function (t) {
            tally[t.id] = (tally[t.id] || 0) + POINTS;
            RG.award(t.id, POINTS, { quiet: true });
          });
          if (winners.length) RG.sfx.ding(); else RG.sfx.buzz();
          var last = n === deck.length - 1;
          verdict.replaceChildren(
            h('p', { class: 'verdict-call' }, item.answer === 'scripture' ? '📖 It’s in the Bible.' : '🎄 That’s tradition, not the text.'),
            h('p', { class: 'verdict-why' }, item.why, ' ', h('cite', null, item.ref)),
            h('p', { class: 'verdict-pts' }, winners.length
              ? '+' + POINTS + ' to ' + winners.map(function (t) { return t.name; }).join(', ')
              : 'No points this round.'),
            h('button', {
              class: 'btn btn--big', type: 'button',
              onclick: function () { n++; if (last) RG.summary(stage, 'Scripture or Tradition?', tally, start); else round(); }
            }, last ? 'See the results' : 'Next statement'));
          verdict.hidden = false; revealBtn.hidden = true; voters.hidden = true;
          paint();
        }

        paint();
        stage.replaceChildren(h('div', { class: 'quiz sot' },
          h('div', { class: 'quiz-head' }, h('span', { class: 'pill' }, 'Statement ' + (n + 1) + ' of ' + deck.length),
            h('span', { class: 'worth' }, POINTS + ' pts each')),
          h('blockquote', { class: 'statement' }, item.text),
          h('div', { class: 'zones' }, zones.scripture, zones.tradition),
          voters, revealBtn, verdict));
      }

      intro();
      return null;
    }
  });
})();
