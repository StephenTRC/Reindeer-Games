/* Reindeer Games — home page (game picker + scoreboard). */
(function () {
  'use strict';
  var RG = window.RG, h = RG.h;
  var BULBS = ['#ff5a5f', '#ffd166', '#3ddc97', '#4fb3c9', '#ffffff'];

  function lights() {
    var row = h('div', { class: 'lights', 'aria-hidden': 'true' });
    for (var i = 0; i < 28; i++) {
      row.appendChild(h('i', { style: { '--c': BULBS[i % BULBS.length], '--d': (i % 5) * 0.37 + 's', '--drop': (i % 2 ? 10 : 18) + 'px' } }));
    }
    return row;
  }

  function card(g, i) {
    return h('a', { class: 'gamecard', href: '#/' + g.id, style: { '--accent': g.accent, '--i': i } },
      h('span', { class: 'gamecard-num', 'aria-hidden': 'true' }, i + 1),
      h('span', { class: 'gamecard-icon', 'aria-hidden': 'true' }, g.icon),
      h('h3', null, g.title),
      h('p', null, g.tagline),
      h('span', { class: 'gamecard-meta' }, g.meta.map(function (m) { return h('span', null, m); })),
      h('span', { class: 'gamecard-go' }, 'Play ', h('span', { 'aria-hidden': 'true' }, '→')));
  }

  RG.setHome(function (app) {
    var hasScores = RG.teams().some(function (t) { return t.score > 0; });
    app.appendChild(h('div', { class: 'home' },
      lights(),
      h('section', { class: 'hero' },
        h('div', { class: 'hero-copy' },
          h('p', { class: 'eyebrow' }, 'Three Rivers Church Students · Christmas Party'),
          h('h1', { class: 'title' }, h('span', null, 'Reindeer'), h('span', null, 'Games')),
          h('p', { class: 'hero-sub' }, 'Split into teams, pick a game, and may the best reindeer win.')),
        h('div', { class: 'hero-art', html: RG.art.reindeerFace() })),

      h('section', { class: 'scores', 'aria-label': 'Scoreboard' },
        h('h2', null, hasScores ? 'Scoreboard' : 'Tonight’s teams'),
        RG.scorebar(),
        h('button', { class: 'btn btn--ghost btn--small', type: 'button', onclick: RG.openTeams }, 'Edit teams')),

      h('section', { class: 'picker' },
        h('h2', null, 'Pick a game'),
        h('div', { class: 'gamegrid' }, RG.order.map(function (id, i) { return card(RG.games[id], i); }))),

      h('footer', { class: 'homefoot' },
        h('div', { class: 'hills', html: RG.art.hills() }),
        h('blockquote', null,
          '“For unto you is born this day in the city of David a Savior, who is Christ the Lord.”',
          h('cite', null, 'Luke 2:11')))));
  });

  RG.boot();
})();
