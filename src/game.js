import {Display, RNG, Engine} from '../lib/rot/index.js';
import DividedMaze from '../lib/rot/map/dividedmaze.js';
import BacktrackerMaze from './backtrackermaze.js';
import Simple from '../lib/rot/scheduler/simple.js';
import Hero from './hero.js';

const WIDTH = 55;
const HEIGHT = 37;
const CHAMBERWIDTH = 19;
const CHAMBERHEIGHT = 13;
const display = new Display({
  width: WIDTH,
  height: HEIGHT,
  forceSquareRatio: true,
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
  if (position === '0,0,0,0,0,0' || position === '2,2,2,2,2,2') {
    const p = position.split(',');
    const i = +p[0];
    const j = +p[1];
    for (let x = 1; x < CHAMBERWIDTH - 1; x += 1) {
      for (let y = 1; y < CHAMBERHEIGHT - 1; y += 1) {
        const xi = i * CHAMBERWIDTH - i;
        const yj = j * CHAMBERHEIGHT - j;
        map.set(`${x + xi},${y + yj},${position.substr(4)}`, '.');
      }
    }
  }
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
      map.set(`${x},${y},${position.substr(4)}`, ['>', '<'][direction]);
      map.set(
          `${x},${y},${+p[2] + (direction ? 1 : -1)},${p[3]},${p[4]},${p[5]}`,
          ['<', '>'][direction],
      );
    } else if (dimension === 3) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += ((+p[3] % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[3] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, ['}', '{'][direction]);
      map.set(
          `${x},${y},${p[2]},${+p[3] + (direction ? 1 : -1)},${p[4]},${p[5]}`,
          ['{', '}'][direction],
      );
    } else if (dimension === 4) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += (CHAMBERWIDTH - 1) / 3;
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[4] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, [']', '['][direction]);
      map.set(
          `${x},${y},${p[2]},${p[3]},${+p[4] + (direction ? 1 : -1)},${p[5]}`,
          ['[', ']'][direction],
      );
    } else if (dimension === 5) {
      x += RNG.getUniformInt(0, (CHAMBERWIDTH - 7) / 6) * 2 + 1;
      x += (1 ^ (+p[5] % 2) ^ direction) * ((CHAMBERWIDTH - 1) / 3 * 2);
      y += RNG.getUniformInt(0, (CHAMBERHEIGHT - 7) / 6) * 2 + 1;
      y += ((+p[5] % 2) ^ direction) * ((CHAMBERHEIGHT - 1) / 3 * 2);
      map.set(`${x},${y},${position.substr(4)}`, [')', '('][direction]);
      map.set(
          `${x},${y},${p[2]},${p[3]},${p[4]},${+p[5] + (direction ? 1 : -1)}`,
          ['(', ')'][direction],
      );
    }
  }));

map.set('9,6,0,0,0,0', '^');

display.drawText(
    0,
    0,
    ` .                                                     .
      .          ###  ###  ###  ###  ###  ##   #            .
      .          #    # #  #    #     #   # #  #            .
      .          ###  ###  ###  #     #   ##   #            .
      .            #  #    #    #     #   # #  #            .
      .          ###  #    ###  ###   #   # #  ###          .
      .                                                     .
      .                 Arakhon's Ascension                 .
      .                                                     .
      .                         .,..                        .
      .                       ,*  .,.                       .
      .                      *,%#,,*.                       .   
      .  Start        *    ,,**//**,.                       .
      .              //*   *,,,*/*,.                        .
      .  Credits    /**        ,,,,.                        .
      .             /**      ,,,,*****,                     .
      .             /**, .**/((//(((*,,///*,                .
      .             /*,,**,/##(((##(*,,*///*,.              .
      .             **,,,,,*#((/((((*....,***,       */     .
      .             .,..,,.,/(/**///,..  .**,.       (/*    .
      .               ...    .,*,,*,,..   *,.         **.   .
      .                       */****.,,, ,*,.        ,**.   .
      .                       ,/****,.,,.     , */ / ***,   .
      .                       ,****,,,,,,,,.,*/////*/**.    .
      .                      **********,,.,,****///**,.     .
      .                     ////***********/*,.,,,,,..      .
      .                    ////*,******,.******.            .
      .                   .*/*,,,,,,***,../**,..            .
      .                   .**,.....,,**,...,*....           .
      .                    ,,..    .,,,,..  ...,,..         .
      .                    */*.     .,,,..    .,*.          .
      .                     ((*     .*/*.     .,*..         .
      .                     */*.   *.,/,.    .,**,.         .
      .                  .,,,,..   * .,.,.   , *. .,        .
      .                .,**,..       .,,.    . *   *        .
      .                *  ,..       .,**,.                  .
      .                            *  ,. ..                 .
      `);

let started = false;
window.addEventListener('keydown', start);
window.addEventListener('mousedown', start);

/**
 * Starts the game.
 *
 */
function start() {
  if (started) {
    return;
  }
  started = true;
  display.clear();
  const scheduler = new Simple();
  const engine = new Engine(scheduler);
  new Hero([45, 30, 2, 2, 2, 2], map, scheduler, engine, display);
  engine.start();
}
