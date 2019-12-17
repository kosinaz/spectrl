import {Display, RNG} from '../lib/rot/index.js';
import DividedMaze from '../lib/rot/map/dividedmaze.js';
import BacktrackerMaze from './backtrackermaze.js';

const WIDTH = 91;
const HEIGHT = 37;
const CHAMBERWIDTH = 31;
const CHAMBERHEIGHT = 13;
const display = new Display({
  width: WIDTH * 2 + 5,
  height: HEIGHT,
});
document.body.appendChild(display.getContainer());

const map = new Map();
const maze = new BacktrackerMaze(
    [3, 3, 3, 3, 3, 3],
    [0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2],
);

maze.nodes.forEach((node, position) => {
  const p = position.split(',');
  const i = +p[0];
  const j = +p[1];
  new DividedMaze(CHAMBERWIDTH, CHAMBERHEIGHT).create((x, y, value) => {
    const char = ['A', 'B', 'C'][+p[4]];
    x += i * CHAMBERWIDTH - i;
    y += j * CHAMBERHEIGHT - j;
    map.set(`${x},${y},${position.substr(4)}`, value ? char : '.');
  });
});

maze.nodes.forEach((node, position) =>
  node.forEach(({dimension, direction}) => {
    const p = position.split(',');
    const i = +p[0];
    const j = +p[1];
    let x = i * CHAMBERWIDTH - i;
    let y = j * CHAMBERHEIGHT - j;
    if (dimension === 0) {
      x += direction * CHAMBERWIDTH - direction;
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 3) / 2) * 2 + 1;
      map.set(`${x},${y},${position.substr(4)}`, '.');
    } else if (dimension === 1) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 3) / 2) * 2 + 1;
      y += direction * CHAMBERHEIGHT - direction;
      map.set(`${x},${y},${position.substr(4)}`, '.');
    } else if (dimension === 2) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += ((+p[2] % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += (CHAMBERHEIGHT - 1) / 3;
      map.set(`${x},${y},${position.substr(4)}`, ['<', '>'][direction]);
      map.set(
          `${x},${y},${+p[2] + (direction ? 1 : -1)},${p[3]},${p[4]},${p[5]}`,
          ['>', '<'][direction],
      );
    } else if (dimension === 3) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += ((+p[3] % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[3] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, ['{', '}'][direction]);
      map.set(
          `${x},${y},${p[2]},${+p[3] + (direction ? 1 : -1)},${p[4]},${p[5]}`,
          ['}', '{'][direction],
      );
    } else if (dimension === 4) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += (CHAMBERWIDTH - 1) / 3;
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[4] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, ['[', ']'][direction]);
      map.set(
          `${x},${y},${p[2]},${p[3]},${+p[4] + (direction ? 1 : -1)},${p[5]}`,
          [']', '['][direction],
      );
    } else if (dimension === 5) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += (1 ^ (+p[5] % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[5] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, ['(', ')'][direction]);
      map.set(
          `${x},${y},${p[2]},${p[3]},${p[4]},${+p[5] + (direction ? 1 : -1)}`,
          [')', '('][direction],
      );
    }
  }));

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x, y, map.get(`${x},${y},0,0,0,1`), 'gray');
  }
}

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x + WIDTH + 5, y, map.get(`${x},${y},0,0,0,2`), 'gray');
  }
}
