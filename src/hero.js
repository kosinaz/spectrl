import {RNG} from '../lib/rot/index.js';
import Actor from './actor.js';
import PreciseShadowcasting from '../lib/rot/fov/precise-shadowcasting.js';
import AStar from '../lib/rot/path/astar.js';

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
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Hero
   */
  constructor(world, position) {
    super(world, position);
    this.char = '@';
    this.gold = 0;
    this.trade = 0;
    this.explored = new Set();
    this.fov = new Set();
    this.ps = new PreciseShadowcasting(this.isPassable.bind(this));
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Hero
   */
  act() {
    this.fov = new Set();
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      this.fov.add(`${x},${y}`);
      const position = this.getPosition(x, y);
      if (!this.explored.has(position)) {
        this.explored.add(position);
        const char = this.world.map.get(position);
        if (!RNG.getUniformInt(0, 250) && char === '.') {
          this.world.actors.push(new Actor(this.world, position));
        }
      }
    });
    this.world.update();
    this.world.engine.lock();
    if (this.target) {
      setTimeout(this.moveToTargetAndUnlock.bind(this), 100);
    }
  }

  /**
   * Moves the hero towards the target.
   *
   * @memberof Hero
   */
  moveToTargetAndUnlock() {
    if (!this.target) {
      return;
    }
    if (!this.isPassable(this.target[0], this.target[1])) {
      return;
    }
    this.path = [];
    new AStar(this.target[0], this.target[1], this.isPassable.bind(this))
        .compute(this.x, this.y, (x, y) => this.path.push([x, y]));
    if (this.path.length < 2) {
      return;
    }
    const actor = this.world.actors.find((actor) =>
      actor.isAt(this.getPosition(this.path[1][0], this.path[1][1])),
    );
    if (actor) {
      if (actor.team === 0) {
        actor.weaken(this.damage + RNG.getUniformInt(0, 1));
        this.target = null;
      } else if (actor.team === 1) {
        this.trade = 5;
        this.target = null;
        actor.kill();
      } else if (actor.team === 2) {
        this.gift = 5;
        this.health += 1;
        this.target = null;
        actor.kill();
      }
    } else {
      this.x = this.path[1][0];
      this.y = this.path[1][1];
    }
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      const actor = this.world.actors.find((actor) =>
        actor.isAt(this.getPosition(x, y)));
      if (actor) {
        actor.target = [this.world.hero.x, this.world.hero.y];
      }
    });
    this.world.engine.unlock();
  }

  /**
   * Opens the game over screen.
   *
   * @memberof Actor
   */
  kill() {
    this.died = true;
  }
}
