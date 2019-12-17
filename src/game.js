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

for (let i = 0; i < 3; i += 1) {
  for (let j = 0; j < 3; j += 1) {
    for (let k = 0; k < 3; k += 1) {
      for (let l = 0; l < 3; l += 1) {
        new DividedMaze(CHAMBERWIDTH, CHAMBERHEIGHT).create((x, y, value) => {
          x += i * CHAMBERWIDTH - i;
          y += j * CHAMBERHEIGHT - j;
          map.set(`${x},${y},${k},${l}`, value ? 'A' : '.');
        });
      }
    }
  }
}

for (let i = 0; i < 3; i += 1) {
  for (let j = 0; j < 3; j += 1) {
    for (let k = 0; k < 3; k += 1) {
      for (let l = 0; l < 3; l += 1) {
        maze.nodes.get(`${i},${j},${k},${l},0,0`).forEach(
            ({dimension, direction}) => {
              let x = i * CHAMBERWIDTH - i;
              let y = j * CHAMBERHEIGHT - j;
              if (dimension === 0) {
                x += direction * CHAMBERWIDTH - direction;
                y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 3) / 2) * 2 + 1;
                map.set(`${x},${y},${k},${l}`, '.');
                console.log('x', x, y);
              } else if (dimension === 1) {
                x += RNG.getUniformInt(0, (CHAMBERWIDTH - 3) / 2) * 2 + 1;
                y += direction * CHAMBERHEIGHT - direction;
                map.set(`${x},${y},${k},${l}`, '.');
                console.log('y', x, y);
              } else if (dimension === 2) {
                x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
                x += ((k % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
                y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
                y += (CHAMBERHEIGHT - 1) / 3;
                map.set(`${x},${y},${k},${l}`, ['<', '>'][direction]);
                map.set(
                    `${x},${y},${k},${l + (direction ? 1 : -1)}`,
                    ['>', '<'][direction],
                );
                console.log('z', x, y);
              } else if (dimension === 3) {
                x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
                x += ((l % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
                y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
                y += ((l % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
                map.set(`${x},${y},${k},${l}`, ['{', '}'][direction]);
                map.set(
                    `${x},${y},${k},${l + (direction ? 1 : -1)}`,
                    ['}', '{'][direction],
                );
                console.log('a', x, y);
              }
            });
      }
    }
  }
}

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x, y, map.get(`${x},${y},0,0`), 'gray');
  }
}

for (let x = 0; x < WIDTH; x += 1) {
  for (let y = 0; y < HEIGHT; y += 1) {
    display.draw(x + WIDTH + 5, y, map.get(`${x},${y},0,1`), 'gray');
  }
}
