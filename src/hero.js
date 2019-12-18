import {DIRS, KEYS} from '../lib/rot/index.js';
import Actor from './actor.js';
import PreciseShadowcasting from '../lib/rot/fov/precise-shadowcasting.js';

/**
 * Represents an actor that can be controlled by the player.
 *
 * @export
 * @class Hero
 * @extends {Actor}
 */
export default class Hero extends Actor {
  /**
   * Creates an instance of Hero.
   *
   * @param {number[]} position The coordinates of the actor's start position.
   * @param {Map} map
   * @param {Scheduler} scheduler
   * @param {Engine} engine
   * @param {Display} display
   * @memberof Hero
   */
  constructor(position, map, scheduler, engine, display) {
    super(position, map, scheduler);
    this.char = '@';
    this.explored = new Set();
    this.fov = new PreciseShadowcasting(this.isTransparent.bind(this));
    this.engine = engine;
    this.display = display;
    this.keys = {};
    this.keys[KEYS.VK_K] = 0;
    this.keys[KEYS.VK_UP] = 0;
    this.keys[KEYS.VK_NUMPAD8] = 0;
    this.keys[KEYS.VK_U] = 1;
    this.keys[KEYS.VK_NUMPAD9] = 1;
    this.keys[KEYS.VK_L] = 2;
    this.keys[KEYS.VK_RIGHT] = 2;
    this.keys[KEYS.VK_NUMPAD6] = 2;
    this.keys[KEYS.VK_N] = 3;
    this.keys[KEYS.VK_NUMPAD3] = 3;
    this.keys[KEYS.VK_J] = 4;
    this.keys[KEYS.VK_DOWN] = 4;
    this.keys[KEYS.VK_NUMPAD2] = 4;
    this.keys[KEYS.VK_B] = 5;
    this.keys[KEYS.VK_NUMPAD1] = 5;
    this.keys[KEYS.VK_H] = 6;
    this.keys[KEYS.VK_LEFT] = 6;
    this.keys[KEYS.VK_NUMPAD4] = 6;
    this.keys[KEYS.VK_Y] = 7;
    this.keys[KEYS.VK_NUMPAD7] = 7;
    this.keys[KEYS.VK_PERIOD] = -1;
    this.keys[KEYS.VK_CLEAR] = -1;
    this.keys[KEYS.VK_NUMPAD5] = -1;
    this.mouseDown = false;
    window.addEventListener('keydown', this);
    window.addEventListener('mousedown', this);
    window.addEventListener('mouseup', this);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Hero
   */
  act() {
    this.explored.forEach((position) => {
      const p = position.split(',');
      if (
        +p[2] === this.z &&
        +p[3] === this.a &&
        +p[4] === this.b &&
        +p[5] === this.c
      ) {
        this.display.draw(+p[0], +p[1], this.map.get(position), '#444', '#000');
      }
    });
    const brightness = ['a', '8', '6'][this.z];
    const red = this.a === 0 ? brightness : '0';
    const green = this.a === 1 ? brightness : '0';
    const blue = this.a === 2 ? brightness : '0';
    const color = `#${red}${green}${blue}`;
    this.display.setOptions({
      fontFamily: ['ba', 'sm', 'ty'][this.c],
    });
    this.fov.compute(this.x, this.y, 11, (x, y) => {
      const position = `${x},${y},${this.z},${this.a},${this.b},${this.c}`;
      const char = this.map.get(position);
      this.explored.add(position);
      this.display.draw(x, y, char, '#fff', color);
    });
    this.display.draw(this.x, this.y, '@', '#fff', color);
    this.engine.lock();
    if (this.mouseDown && this.target) {
      setTimeout(this.moveToTargetAndUnlock.bind(this), 100);
    }
  }

  /**
   * Performs an action based on the user input.
   *
   * @param {Event} e The user event.
   * @memberof Hero
   */
  handleEvent(e) {
    if (e.type === 'mouseup') {
      this.target = null;
      this.mouseDown = false;
      return;
    }
    if (e.type === 'mousedown') {
      this.target = [
        this.display.eventToPosition(e)[0],
        this.display.eventToPosition(e)[1],
      ];
      this.mouseDown = true;
    }
    if (e.type === 'keydown') {
      if (this.keys[e.keyCode] === undefined) {
        if (e.keyCode === 13) {
          const char = this.map.get(this.position.toString());
          if (char === '<') {
            this.z += 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === '>') {
            this.z -= 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === '{') {
            this.a += 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === '}') {
            this.a -= 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === '[') {
            this.b += 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === ']') {
            this.b -= 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === '(') {
            this.c += 1;
            this.display.clear();
            this.engine.unlock();
            return;
          } else if (char === ')') {
            this.c -= 1;
            this.display.clear();
            this.engine.unlock();
            return;
          }
        } else {
          return;
        }
      } else {
        this.target = [
          this.position[0] + DIRS[8][this.keys[e.keyCode]][0],
          this.position[1] + DIRS[8][this.keys[e.keyCode]][1],
        ];
      }
    }
    this.moveToTargetAndUnlock();
  }

  /**
   * Moves the hero towards the target.
   *
   * @memberof Hero
   */
  moveToTargetAndUnlock() {
    if (this.moveToTarget()) {
      this.engine.unlock();
    }
  };
}
