import AStar from '../lib/rot/path/astar.js';

/**
 * Represents a character that has an act function continuosly called by the
 * engine.
 *
 * @export
 * @class Actor
 */
export default class Actor {
  /**
   * Creates an instance of Actor.
   *
   * @param {number[]} position The coordinates of the actor's start position.
   * @param {Map} map
   * @param {Scheduler} scheduler
   * @memberof Actor
   */
  constructor(position, map, scheduler) {
    this.position = position;
    this.char = ['a', 'b', 'c'][position[4]];
    this.map = map;
    scheduler.add(this, true);
  }

  /**
   * The function that determines the actor's next action. Called by the engine.
   *
   * @memberof Actor
   */
  act() {

  }

  /**
   * The x coordinate of the actor;
   *
   * @readonly
   * @memberof Actor
   */
  get x() {
    return this.position[0];
  }

  /**
   * The y coordinate of the actor;
   *
   * @readonly
   * @memberof Actor
   */
  get y() {
    return this.position[1];
  }

  /**
   * The z coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get z() {
    return this.position[2];
  }

  /**
   * The a coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get a() {
    return this.position[3];
  }

  /**
   * The b coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get b() {
    return this.position[4];
  }

  /**
   * The c coordinate of the actor.
   *
   * @readonly
   * @memberof Actor
   */
  get c() {
    return this.position[5];
  }

  /**
   * Set the x coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set x(n) {
    this.position[0] = n;
  }

  /**
   * Set the y coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set y(n) {
    this.position[1] = n;
  }

  /**
   * Set the z coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set z(n) {
    this.position[2] = n;
  }

  /**
   * Set the a coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set a(n) {
    this.position[3] = n;
  }

  /**
   * Set the b coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set b(n) {
    this.position[4] = n;
  }

  /**
   * Set the c coordinate of the actor.
   *
   * @param {number} n
   * @memberof Actor
   */
  set c(n) {
    this.position[5] = n;
  }

  /**
   * Moves the actor towards the target.
   *
   * @return {boolean} Returns true if the action was successful.
   * @memberof Actor
   */
  moveToTarget() {
    if (!this.target) {
      return false;
    }
    if (!this.isPassable(this.target[0], this.target[1])) {
      return false;
    }
    this.path = [];
    new AStar(this.target[0], this.target[1], this.isPassable.bind(this))
        .compute(this.position[0], this.position[1], (x, y) =>
          this.path.push([x, y]),
        );
    if (this.path.length < 2) {
      return false;
    }
    this.position[0] = this.path[1][0];
    this.position[1] = this.path[1][1];
    return true;
  }

  /**
   * Returns true if the specified x,y position on the current z,a,b,c position
   * of the actor is passable by the actor;
   *
   * @param {number} x The x coordinate of the actor's position.
   * @param {number} y The y coordinate of the actor's position.
   * @return {boolean} Returns true if the specified position is passable.
   * @memberof Actor
   */
  isPassable(x, y) {
    const char =
      this.map.get(`${x},${y},${this.z},${this.a},${this.b},${this.c}`);
    return char !== 'A' && char !== 'B' && char !== 'C' && char !== undefined;
  }

  /**
   * Returns true if the specified x,y position on the current z,a,b,c position
   * of the actor is transparent for the actor;
   *
   * @param {number} x The x coordinate of the actor's position.
   * @param {number} y The y coordinate of the actor's position.
   * @return {boolean} Returns true if the specified position is transparent.
   * @memberof Actor
   */
  isTransparent(x, y) {
    const char =
      this.map.get(`${x},${y},${this.z},${this.a},${this.b},${this.c}`);
    return char !== 'A' && char !== 'B' && char !== 'C' && char !== undefined;
  }
}
