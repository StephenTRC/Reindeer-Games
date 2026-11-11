# Reindeer Games

Christmas party games for Three Rivers Church Students. One screen (laptop on a
projector or TV), two to four teams, a running scoreboard.

## The games

| Game | What happens | Points |
| --- | --- | --- |
| **Reindeer Dash** | One racer per team mashes a key (`Q`, `P`, `Z`, `M`) or taps a pad. Optional Freeze mode: stop on the red light or slide back. | 100 for every team you beat, per race |
| **Present Drop** | One catcher per team gets 30 seconds to catch presents and stars and dodge coal. | 100 for every team you beat |
| **Emoji Carols** | Name the carol, song or movie from the emoji. First team to shout it wins. | 300, or 200 after a hint |
| **Scripture or Tradition?** | Every team votes: is this detail of the Christmas story in the Bible, or just tradition? The answer comes with the verse. | 100 for each team that's right |
| **Advent Trivia** | 25 doors, each hiding a question. Teams take turns opening one; anyone can answer. | 100, 200 or 300 per door |

Scores are saved in the browser, so a refresh or a closed tab doesn't lose them.
Use **Teams & scores** (top right) to rename teams, change how many are playing,
fix a score by hand, or reset everything.

## Running it

There is no build step and nothing to install.

- **Simplest:** download the repo and double-click `index.html`. It works offline.
- **Hosted:** in the GitHub repo, go to Settings → Pages → *Deploy from a branch*,
  choose the branch and `/ (root)`. The site appears at the URL GitHub shows.
- **Local server:** `python3 -m http.server` in this folder, then open
  `http://localhost:8000`.

Press the full-screen button (top right) once it's on the projector.

## Changing the questions

All content lives in plain lists in `js/data/`:

- `scripture.js` — statements for Scripture or Tradition? (with reference and explanation)
- `emoji.js` — emoji puzzles
- `trivia.js` — Advent Trivia questions (five categories of five)

Edit, save, refresh.

## Layout

```
index.html          page shell
css/style.css       all styling
js/core.js          teams, scores, sound, snow, routing
js/art.js           SVG artwork
js/home.js          home page
js/games/*.js       one file per game
js/data/*.js        questions and puzzles
assets/logo/        Three Rivers Church marks
assets/fonts/       Fredoka and Stint Ultra Condensed (SIL Open Font License)
```

Short Scripture quotations follow the ESV.
