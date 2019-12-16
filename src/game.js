import {Display} from '../lib/rot/index.js';
import DividedMaze from '../lib/rot/map/dividedmaze.js';

const WIDTH = 81;
const HEIGHT = 41;
const QUARTERWIDTH = 21;
const QUARTERHEIGHT = 11;
const display = new Display({
  width: WIDTH,
  height: HEIGHT,
});
document.body.appendChild(display.getContainer());


const map = new Map();

for (let i = 0; i < WIDTH; i += QUARTERWIDTH - 1) {
  for (let j = 0; j < HEIGHT; j += QUARTERHEIGHT - 1) {
    const maze = new DividedMaze(QUARTERWIDTH, QUARTERHEIGHT);
    maze.create((x, y, value) => {
      if (value) {
        map.set(`${i + x},${j + y}`, 'A');
      } else {
        map.set(`${i + x},${j + y}`, '.');
      }
    });
  }
}

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x, y, map.get(`${x},${y}`), 'gray');
  }
}
