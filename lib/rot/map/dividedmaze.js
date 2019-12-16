import Map from './map.js';
import RNG from '../rng.js';

/**
 * Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 *
 * @export
 * @class DividedMaze
 * @extends {Map}
 */
export default class DividedMaze extends Map {
  /**
   * Creates an instance of DividedMaze.
   * @memberof DividedMaze
   */
  constructor(...args) {
    /* Create the DividedMaze just like a regular Map. */
    super(...args);

    /* Create a special collection to uniquely store each cell's position that
    holds a wall segment. */
    this._walls = new Set();

    /* Decrease the width to an odd number. */
    this._width -= this._width % 2 ? 0 : 1;

    /* Decrease the height to an odd number. */
    this._height -= this._height % 2 ? 0 : 1;
  }

  /**
   * Creates the content of the map.
   *
   * @param {function(number, number, number): void} callback The callback
   * function that processes the position (arg0: x, arg1: y) and type (arg2: 0:
   * empty space, 1: wall) of every cell in the created map.
   * @return {DividedMaze} The reference of the just created map.
   * @memberof DividedMaze
   */
  create(callback) {
    /* Iterate through all the x coordinates within the map. */
    for (let x = 0; x < this._width; x += 1) {
      /* Set the cell of the top row including the corners as a wall. */
      this._walls.add(`${x},0`);

      /* Set the cell of the bottom row including the corners as a wall. */
      this._walls.add(`${x},${this._height - 1}`);
    }

    /* Iterate through all the y coordinates within the map except the first
    and last one. */
    for (let y = 1; y < this._height - 1; y += 1) {
      /* Set the cell of the left column as a wall. */
      this._walls.add(`0,${y}`);

      /* Set the cell of the right column as a wall. */
      this._walls.add(`${this._width - 1},${y}`);
    }

    /* Divide the whole internal part of the map into two rooms, then continue
    to divide the newly created rooms while possible. */
    this._divideRoom(1, 1, this._width - 2, this._height - 2);

    /* Iterate through all the x coordinates within the map. */
    for (let x = 0; x < this._width; x += 1) {
      /* Iterate through all the y coordinates within the map. */
      for (let y = 0; y < this._height; y += 1) {
        /* Call the callback function with the x and y coordinate, and with the
        value 1, if the cell at the given position holds a wall, and with the
        value 0, if it doesn't. */
        callback(x, y, this._walls.has(`${x},${y}`) ? 1 : 0);
      }
    }

    /* Return the reference of the just created map. */
    return this;
  }

  /**
   * Divides a room defined by the coordinates of its top left and bottom right
   * corner into two with a wall containing a single door and queues the two
   * newly created rooms for further divisions.
   *
   * @param {number} x1 The x coordinate of the room's top left corner.
   * @param {number} y1 The y coordinate of the room's top left corner.
   * @param {number} x2 The x coordinate of the room's bottom right corner.
   * @param {number} y2 The y coordinate of the room's bottom right corner.
   * @memberof DividedMaze
   */
  _divideRoom(x1, y1, x2, y2) {
    /* The number of available vertically dividing wall positions based on the
    premise that every second wall segment of the top and bottom wall can be a
    door. */
    const xn = (x2 - x1) / 2 - 1;

    /* The number of available horizontally dividing wall positions based on the
    premise that every second wall segment of the left and right wall can be a
    door. */
    const yn = (y2 - y1) / 2 - 1;

    /* If no vertically or horizontally dividing wall positions are available,
    that means the room is a one-cell wide corridor. */
    if (xn < 2 || yn < 2) {
      /* Return as there is no need to divide corridors. */
      return;
    }

    /* Determine the x coordinate of the dividing wall by randomly picking the
    index of a vertically dividing wall position, multiplied by two considering
    the possible doors between the wall positions, increased by the x
    coordinate of the room's top left corner, and also increased by one to
    shift it from the column of doors to the column of walls. */
    const wallX = RNG.getUniformInt(0, xn) * 2 + x1 + 1;

    /* Determine the y coordinate of the dividing wall by randomly picking the
    index of a horizontally dividing wall position, multiplied by two
    considering the walls between the door positions, increased by the y
    coordinate of the room's top left corner, and also increased by one to
    shift it from the row of doors to the row of walls. */
    const wallY = RNG.getUniformInt(0, yn) * 2 + y1 + 1;

    /* If the room is shaped as horizontal rectangle, create a vertical wall. */
    if (xn > yn) {
      /* Randomly create a door on the top or bottom neighboring cell of the
      not created horizontal wall. */
      const doorY = wallY - 1 + RNG.getUniformInt(0, 1) * 2;

      /* Iterate through the top segment of the wall. */
      for (let y = y1; y < doorY; y += 1) {
        /* Create the wall. */
        this._walls.add(`${wallX},${y}`);
      }

      /* Iterate through the bottom segment of the wall. */
      for (let y = doorY + 1; y <= y2; y += 1) {
        /* Create the wall. */
        this._walls.add(`${wallX},${y}`);
      }

      /* Continue to divide the newly created room on the left. */
      this._divideRoom(x1, y1, wallX - 1, y2);

      /* Continue to divide the newly created room on the right. */
      this._divideRoom(wallX + 1, y1, x2, y2);

    /* If the room is shaped as a vertical rectangle or a square, create a
    horizontal wall. */
    } else {
      /* Randomly create a door on the left or right neighboring cell of the
      not created vertical wall. */
      const doorX = wallX - 1 + RNG.getUniformInt(0, 1) * 2;

      /* Iterate through the left segment of the wall. */
      for (let x = x1; x < doorX; x += 1) {
        /* Create the wall. */
        this._walls.add(`${x},${wallY}`);
      }

      /* Iterate through the right segment of the wall. */
      for (let x = doorX + 1; x <= x2; x += 1) {
        /* Create the wall. */
        this._walls.add(`${x},${wallY}`);
      }

      /* Continue to divide the newly created room on the top. */
      this._divideRoom(x1, y1, x2, wallY - 1);

      /* Continue to divide the newly created room on the bottom. */
      this._divideRoom(x1, wallY + 1, x2, y2);
    }
  }
}
