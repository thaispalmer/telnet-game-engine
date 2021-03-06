const Display = require('../server/screen/display').default;

const bg = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const fg = [
  [0, 0, 0, 2, 2, 2, 8, 0],
  [0, 0, 0, 2, 2, 2, 2, 2],
  [0, 0, 2, 8, 2, 1, 8, 0],
  [0, 0, 2, 8, 8, 2, 2, 8],
  [0, 0, 0, 2, 8, 8, 8, 0],
  [0, 2, 2, 4, 7, 7, 4, 0],
  [8, 0, 7, 7, 7, 7, 5, 8],
  [0, 0, 2, 0, 0, 0, 2, 0],
];

const buffer = [bg, fg];

const display = new Display();
display.buffer = buffer;
console.log(display.screen);