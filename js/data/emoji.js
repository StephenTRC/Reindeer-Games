/* Emoji Carols — guess the carol, song or movie from the emoji.
   cat is shown as the hint. Edit freely: each game draws 10 at random.
   Stick to older emoji so they show up on any laptop. */
window.RG_DATA = window.RG_DATA || {};
window.RG_DATA.emoji = [
  /* carols & hymns */
  { emoji: '🤫 🌃', answer: 'Silent Night', cat: 'Carol' },
  { emoji: '😄 🌍', answer: 'Joy to the World', cat: 'Carol' },
  { emoji: '👑 👑 👑', answer: 'We Three Kings', cat: 'Carol' },
  { emoji: '😇 🎤 📣', answer: 'Hark! The Herald Angels Sing', cat: 'Carol' },
  { emoji: '🏘️ ⭐ 😴', answer: 'O Little Town of Bethlehem', cat: 'Carol' },
  { emoji: '🚫 🛏️ 👶 🌾', answer: 'Away in a Manger', cat: 'Carol' },
  { emoji: '😇 👂 ⬆️', answer: 'Angels We Have Heard on High', cat: 'Carol' },
  { emoji: '🏃 📣 ⛰️', answer: 'Go Tell It on the Mountain', cat: 'Carol' },
  { emoji: '❓ 👶', answer: 'What Child Is This?', cat: 'Carol' },
  { emoji: '⭐ ✨ 🌃', answer: 'O Holy Night', cat: 'Carol' },
  { emoji: '🐑 👀 🌃', answer: 'While Shepherds Watched Their Flocks', cat: 'Carol' },
  { emoji: '🥁 👦', answer: 'The Little Drummer Boy', cat: 'Carol' },
  /* Christmas songs */
  { emoji: '🛷 🔔 🐴', answer: 'Jingle Bells', cat: 'Christmas song' },
  { emoji: '🔔 🔔 🎸', answer: 'Jingle Bell Rock', cat: 'Christmas song' },
  { emoji: '⛄ 🎩', answer: 'Frosty the Snowman', cat: 'Christmas song' },
  { emoji: '🔴 👃 🦌', answer: 'Rudolph the Red-Nosed Reindeer', cat: 'Christmas song' },
  { emoji: '🎅 ➡️ 🏙️', answer: 'Santa Claus Is Comin’ to Town', cat: 'Christmas song' },
  { emoji: '🏠 🎄', answer: 'I’ll Be Home for Christmas', cat: 'Christmas song' },
  { emoji: '⚪ 🎄', answer: 'White Christmas', cat: 'Christmas song' },
  { emoji: '💙 🎄', answer: 'Blue Christmas', cat: 'Christmas song' },
  { emoji: '🦛 🎁', answer: 'I Want a Hippopotamus for Christmas', cat: 'Christmas song' },
  { emoji: '🦷 🦷 🎁', answer: 'All I Want for Christmas Is My Two Front Teeth', cat: 'Christmas song' },
  { emoji: '👀 👩 💋 🎅', answer: 'I Saw Mommy Kissing Santa Claus', cat: 'Christmas song' },
  { emoji: '❄️ ❄️ ❄️', answer: 'Let It Snow! Let It Snow! Let It Snow!', cat: 'Christmas song' },
  { emoji: '🚶 ❄️ 🌲', answer: 'Winter Wonderland', cat: 'Christmas song' },
  { emoji: '1️⃣ 2️⃣ 📅 🎄', answer: 'The Twelve Days of Christmas', cat: 'Christmas song' },
  { emoji: '🌰 🔥', answer: 'The Christmas Song (Chestnuts Roasting on an Open Fire)', cat: 'Christmas song' },
  { emoji: '👵 🦌 💥', answer: 'Grandma Got Run Over by a Reindeer', cat: 'Christmas song' },
  { emoji: '🎸 🔄 🎄', answer: 'Rockin’ Around the Christmas Tree', cat: 'Christmas song' },
  { emoji: '⬆️ 🏠 🎅', answer: 'Up on the Housetop', cat: 'Christmas song' },
  { emoji: '🎄 🎄 😍', answer: 'O Christmas Tree', cat: 'Christmas song' },
  /* movies */
  { emoji: '🏠 😱 👦', answer: 'Home Alone', cat: 'Movie' },
  { emoji: '🧝 🍝 🍁', answer: 'Elf', cat: 'Movie' },
  { emoji: '💚 😠 🎄', answer: 'How the Grinch Stole Christmas', cat: 'Movie' },
  { emoji: '🚂 ❄️ 🔔', answer: 'The Polar Express', cat: 'Movie' },
  { emoji: '👻 👻 👻 💰', answer: 'A Christmas Carol', cat: 'Movie' },
  { emoji: '😇 🔔 👨', answer: 'It’s a Wonderful Life', cat: 'Movie' },
  { emoji: '🥜 💂', answer: 'The Nutcracker', cat: 'Movie' },
  { emoji: '✨ 3️⃣ 4️⃣ 🛣️', answer: 'Miracle on 34th Street', cat: 'Movie' },
  { emoji: '🎅 📜', answer: 'The Santa Clause', cat: 'Movie' }
];
