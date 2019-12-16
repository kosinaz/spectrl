import {Display} from '../lib/rot/index.js';
import DividedMaze from '../lib/rot/map/dividedmaze.js';

const WIDTH = 65;
const HEIGHT = 33;
const QUARTERWIDTH = 17;
const QUARTERHEIGHT = 9;
const display = new Display({
  width: WIDTH,
  height: HEIGHT,
});
document.body.appendChild(display.getContainer());

const maze = new DividedMaze(QUARTERWIDTH, QUARTERHEIGHT, {
  rooms: [
    {
      minHeight: 3,
      maxHeight: 3,
      minWidth: 3,
      maxWidth: 3,
    },
  ],
});
const map = new Map();
maze.create((x, y, value) => {
  if (value) {
    map.set(`${x},${y}`, 'A');
  } else {
    map.set(`${x},${y}`, '.');
  }
});

// for (let i = 0; i < 4; i += 1) {
//   for (let j = 0; j < 4; j += 1) {
//     for (
//       let x = 1 + i * (QUARTERWIDTH - 1);
//       x < (i + 1) * (QUARTERWIDTH - 1);
//       x += 1
//     ) {
//       for (
//         let y = 1 + j * (QUARTERHEIGHT - 1);
//         y < (j + 1) * (QUARTERHEIGHT - 1);
//         y += 1
//       ) {
//         map.set(`${x},${y}`, '.');
//       }
//     }
//   }
// }

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x, y, map.get(`${x},${y}`), 'gray');
  }
}
