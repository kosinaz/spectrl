import Simple from '../lib/rot/scheduler/simple.js';
import {Engine, RNG} from '../lib/rot/index.js';
import BacktrackerMaze from './backtrackermaze.js';
import Hero from './hero.js';
import Actor from './actor.js';
import DividedMaze from '../lib/rot/map/dividedmaze.js';

/**
 * Represent the ingame world.
 *
 * @export
 * @class World
 */
export default class World {
  /**
   * Creates an instance of World.
   *
   * @param {Scene} scene
   * @memberof World
   */
  constructor(scene) {
    this.scene = scene;
    this.map = new Map();
    this.scheduler = new Simple();
    this.engine = new Engine(this.scheduler);
  }

  /**
   * Creates the content of the world.
   *
   * @memberof World
   */
  create() {
    this.maze = new BacktrackerMaze(
        [3, 3, 3, 3, 3, 3],
        [0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2],
    );
    this.createChambers(19, 13);
    this.createGates(19, 13);
    this.hero = new Hero(this, '45,30,2,1,2,2');
    this.actors = [];
    this.actors.push(new Actor(this, '47,30,2,1,2,2'));
    this.engine.start();
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof World
   */
  update() {
    this.scene.update();
  }

  /**
   * Creates the maze and generates chambers for each of the nodes.
   *
   * @param {number} width
   * @param {number} height
   * @memberof World
   */
  createChambers(width, height) {
    this.maze.nodes.forEach((node, position) => {
      const p = position.split(',');
      const i = +p[0];
      const j = +p[1];
      new DividedMaze(width, height).create((x, y, value) => {
        const char = ['A', 'B', 'C'][+p[4]];
        x += i * width - i;
        y += j * height - j;
        this.map.set(`${x},${y},${position.substr(4)}`, value ? char : '.');
      });
      if (position === '0,0,0,0,0,0' || position === '2,2,2,2,2,2') {
        const p = position.split(',');
        const i = +p[0];
        const j = +p[1];
        for (let x = 1; x < width - 1; x += 1) {
          for (let y = 1; y < height - 1; y += 1) {
            const xi = i * width - i;
            const yj = j * height - j;
            this.map.set(`${x + xi},${y + yj},${position.substr(4)}`, '.');
          }
        }
      }
    });
    this.map.set('9,6,0,0,0,0', '^');
  }

  /**
   * Creates the connections between the chambers.
   *
   * @param {number} width
   * @param {number} height
   * @memberof World
   */
  createGates(width, height) {
    this.maze.nodes.forEach((node, position) =>
      node.forEach(({dimension, direction}) => {
        const p = position.split(',');
        const i = +p[0];
        const j = +p[1];
        let x = i * width - i;
        let y = j * height - j;
        if (dimension === 0) {
          x += direction * width - direction;
          y += RNG.getUniformInt(0, (height - 3) / 2) * 2 + 1;
          this.map.set(`${x},${y},${position.substr(4)}`, '.');
        } else if (dimension === 1) {
          x += RNG.getUniformInt(0, (width - 3) / 2) * 2 + 1;
          y += direction * height - direction;
          this.map.set(`${x},${y},${position.substr(4)}`, '.');
        } else if (dimension === 2) {
          x += RNG.getUniformInt(0, (width - 7) / 6) * 2 + 1;
          x += ((+p[2] % 2) ^ direction) * ((width - 1) / 3 * 2);
          y += RNG.getUniformInt(0, (height - 7) / 6) * 2 + 1;
          y += (height - 1) / 3;
          this.map.set(
              `${x},${y},${position.substr(4)}`,
              ['>', '<'][direction],
          );
          this.map.set(
              `${x},${y},${+p[2]+(direction ? 1 : -1)},${p[3]},${p[4]},${p[5]}`,
              ['<', '>'][direction],
          );
        } else if (dimension === 3) {
          x += RNG.getUniformInt(0, (width - 7) / 6) * 2 + 1;
          x += ((+p[3] % 2) ^ direction) * ((width - 1) / 3 * 2);
          y += RNG.getUniformInt(0, (height - 7) / 6) * 2 + 1;
          y += ((+p[3] % 2) ^ direction) * ((height - 1) / 3 * 2);
          this.map.set(
              `${x},${y},${position.substr(4)}`,
              ['}', '{'][direction],
          );
          this.map.set(
              `${x},${y},${p[2]},${+p[3]+(direction ? 1 : -1)},${p[4]},${p[5]}`,
              ['{', '}'][direction],
          );
        } else if (dimension === 4) {
          x += RNG.getUniformInt(0, (width - 7) / 6) * 2 + 1;
          x += (width - 1) / 3;
          y += RNG.getUniformInt(0, (height - 7) / 6) * 2 + 1;
          y += ((+p[4] % 2) ^ direction) * ((height - 1) / 3 * 2);
          this.map.set(
              `${x},${y},${position.substr(4)}`,
              [']', '['][direction],
          );
          this.map.set(
              `${x},${y},${p[2]},${p[3]},${+p[4]+(direction ? 1 : -1)},${p[5]}`,
              ['[', ']'][direction],
          );
        } else if (dimension === 5) {
          x += RNG.getUniformInt(0, (width - 7) / 6) * 2 + 1;
          x += (1^(+p[5] % 2) ^ direction) * ((width - 1) / 3 * 2);
          y += RNG.getUniformInt(0, (height - 7) / 6) * 2 + 1;
          y += ((+p[5] % 2) ^ direction) * ((height - 1) / 3 * 2);
          this.map.set(
              `${x},${y},${position.substr(4)}`,
              [')', '('][direction],
          );
          this.map.set(
              `${x},${y},${p[2]},${p[3]},${p[4]},${+p[5]+(direction ? 1 : -1)}`,
              ['(', ')'][direction],
          );
        }
      }));
  }
}
