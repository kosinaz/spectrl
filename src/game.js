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

let started = false;
let screen = '';
let selected = 0;
menu();

window.addEventListener('keydown', (e) => {
  if (screen === 'menu') {
    display.draw(2, 12, ' ');
    display.draw(2, 14, ' ');
    display.draw(2, 16, ' ');
    if (e.keyCode === 40 && selected < 2) {
      selected += 1;
    } else if (e.keyCode === 38 && selected > 0) {
      selected -= 1;
    } else if (e.keyCode === 13) {
      if (selected === 0) {
        start();
      } else if (selected === 1) {
        help();
      } else if (selected === 2) {
        credits();
      }
      return;
    }
    display.draw(2, 12 + selected * 2, '>');
  } else if (screen === 'help' || screen === 'credits') {
    menu();
  }
});
window.addEventListener('mousedown', (e) => {
  const x = display.eventToPosition(e)[0];
  const y = display.eventToPosition(e)[1];
  if (x > 2) {
    if (x < 8 && y === 12) {
      start();
    } else if (x < 7 && y === 14) {
      help();
    } else if (x < 10 && y === 16) {
      credits();
    }
  }
});

/**
 * Displays the menu.
 *
 */
function menu() {
  screen = 'menu';
  selected = 0;
  display.clear();
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
          . >Start        *    ,,**//**,.                       .
          .              //*   *,,,*/*,.                        .
          .  Help       /**        ,,,,.                        .
          .             /**      ,,,,*****,                     .
          .  Credits    /**, .**/((//(((*,,///*,                .
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
          . Made for the     .,,,,..   * .,.,.   , *. .,        .
          .                .,**,..       .,,.    . *   *        .
          . TEXT ONLY JAM  *  ,..       .,**,.                  .
          .                            *  ,. ..                 .
          `);
}

/**
 * Starts the game.
 *
 */
function start() {
  //music.play();
  screen = 'game';
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

/**
 * Displays help.
 *
 */
function help() {
  screen = 'help';
  display.clear();
  display.drawText(25, 1, 'Help');
  display.drawText(3, 12, 'Start');
  display.drawText(3, 14, 'Help');
  display.drawText(3, 16, 'Credits');
  display.drawText(12, 3, `Desription

    As Arakhon, the despised ciblityian
    dragonspawn, your goal is to reach 
    Aribaia, the highest plane of Spect.
    In addition to width, height, and depth, 
    the world of Spect also has the dimensions 
    of the color spectrum, the substantial 
    structure, and the substantial surface. 
    Therefore everything and everyone in this 
    world has a different structure, surface, 
    and color, but deep inside, they are still 
    the same. So keep in mind, animate or 
    inanimate, some of them will help you, 
    some of them will hurt you, based on which 
    plane they are on.

    The game is rendered in two dimensions, 
    width, and height. It displays the 
    different levels of depth with 
    brightnesses, the color with hues, the 
    structure with characters, and the surface 
    with typefaces. Lowercase characters are 
    living beings, uppercase characters are 
    impassable obstacles, and the dot 
    represents the floor.

    Controls
    
    Move/attack with mouse/arrow/num/wasd.
    Move upstairs/downstairs with enter.
    Mute/unmute the music with minus.`);
}

/**
 * Starts the game.
 *
 */
function credits() {
  screen = 'credits';
  display.clear();
  display.drawText(23, 1, 'Credits');
  display.drawText(3, 12, 'Start');
  display.drawText(3, 14, 'Help');
  display.drawText(3, 16, 'Credits');
  display.drawText(12, 3, `Code and ASCII art

    Zoltan Kosina 
    Licensed under the Unlicense
  

    Code Toolkit

    rot.js ©2012-2019 Ondrej Zara
    Licensed under the BSD 3-Clause 
    "New" or "Revised" License
  

    Music

    Unprepared ©2019 Joshua McLean 
    (mrjoshuamclean.com)
    Licensed under Creative Commons 
    Attribution 4.0 International`);
}
