/* Advent Trivia — five categories, five questions each, hidden behind 25 doors.
   Within a category the first two questions are worth 100, the next two 200, the last 300.
   Edit freely; keep five per category (25 doors), easiest first. */
window.RG_DATA = window.RG_DATA || {};
window.RG_DATA.trivia = [
  { name: 'The First Christmas', qs: [
    { q: 'In what town was Jesus born?', a: 'Bethlehem (Luke 2:4–7)' },
    { q: 'Which angel told Mary she would have a son?', a: 'Gabriel (Luke 1:26–31)' },
    { q: 'Matthew says Jesus would be called “Immanuel.” What does that name mean?', a: '“God with us” (Matthew 1:23)' },
    { q: 'Which Roman emperor’s decree sent Joseph and Mary to Bethlehem?', a: 'Caesar Augustus (Luke 2:1)' },
    { q: 'Which Old Testament prophet foretold that the ruler of Israel would come from Bethlehem?', a: 'Micah (Micah 5:2, quoted in Matthew 2:6)' }
  ] },
  { name: 'Carols & Songs', qs: [
    { q: 'In “Jingle Bells,” what kind of sleigh are they riding in?', a: 'A one-horse open sleigh' },
    { q: 'In “The Twelve Days of Christmas,” what is given on the fifth day?', a: 'Five golden rings' },
    { q: 'In “Frosty the Snowman,” what brought Frosty to life?', a: 'An old silk hat' },
    { q: '“Silent Night” was first written in what language?', a: 'German (“Stille Nacht,” Austria, 1818)' },
    { q: 'Isaac Watts based “Joy to the World” on which Psalm?', a: 'Psalm 98' }
  ] },
  { name: 'Christmas Movies', qs: [
    { q: 'In the movies, what color is the Grinch?', a: 'Green' },
    { q: 'In “Home Alone,” what city is Kevin’s family flying to when they leave him behind?', a: 'Paris' },
    { q: 'In “It’s a Wonderful Life,” what happens every time a bell rings?', a: 'An angel gets its wings' },
    { q: 'In “A Charlie Brown Christmas,” which character recites the Christmas story from Luke 2?', a: 'Linus' },
    { q: 'In “Elf,” what are the four main food groups for elves?', a: 'Candy, candy canes, candy corns, and syrup' }
  ] },
  { name: 'Traditions', qs: [
    { q: 'What do people traditionally hang by the fireplace on Christmas Eve?', a: 'Stockings' },
    { q: 'What plant are people supposed to kiss under?', a: 'Mistletoe' },
    { q: 'The Christmas tree tradition comes from which country?', a: 'Germany' },
    { q: 'What red-and-green Christmas plant is native to Mexico?', a: 'The poinsettia' },
    { q: 'Santa Claus traces back to which 4th-century bishop?', a: 'Nicholas of Myra (Saint Nicholas)' }
  ] },
  { name: 'Reindeer Facts', qs: [
    { q: 'In “’Twas the Night Before Christmas,” how many reindeer pull the sleigh?', a: 'Eight' },
    { q: 'Which of those eight reindeer has a name that starts with B?', a: 'Blitzen' },
    { q: 'In North America, wild reindeer go by what other name?', a: 'Caribou' },
    { q: 'Reindeer are the only deer where both males and females grow what?', a: 'Antlers' },
    { q: 'The 1823 poem first called two reindeer “Dunder and Blixem.” Those are Dutch words for what?', a: 'Thunder and lightning' }
  ] }
];
