import {RNG} from '../lib/rot/index.js';

/**
 * Recursive backtracker maze.
 * See http://www.astrolog.org/labyrnth/algrithm.htm.
 *
 * @export
 * @class BacktrackerMaze
 */
export default class BacktrackerMaze {
  /**
   * Creates an instance of BacktrackerMaze.
   *
   * @param {number[]} size The size of the maze.
   * @param {number[]} entrance The start position.
   * @param {number[]} exit The end position.
   * @memberof BacktrackerMaze
   */
  constructor(size, entrance, exit) {
    /* Create a property to store the size of the maze. */
    this.size = size;

    /* Create a property to store the end position. */
    this.exit = exit;

    /* Create a collection of keyed data items to store the collection of
    connected neighbours of each node at the coordinates of their position. */
    this.nodes = new Map([[entrance.toString(), []]]);

    /* Start connecting the nodes. */
    this.connect(entrance);
  }

  /**
   * Connects the given node to the neighboring nodes randomly.
   *
   * @param {number[]} node The node that needs to be connected.
   * @memberof BacktrackerMaze
   */
  connect(node) {
    /* If the series of node connections reached the exit node. */
    if (node.toString() === this.exit.toString()) {
      /* Return, as the exit should be connected to only one neighbour. */
      return;
    }

    /* In 25% of the connection attempts. */
    if (!RNG.getUniformInt(0, 3) && this.nodes.size > 5) {
      /* Return to prevent long sections without junctions. */
      return;
    }

    /* Create a collection of neighboring nodes. */
    const neighbours = [];

    /* For every dimensions of the node. */
    for (let i = 0; i < node.length; i += 1) {
      /* Add the previous neighbor in the current dimension to the list of
      connections. If the neighbour would be out of the map's lower bounds,
      store the current node's position, it will be skipped during the check
      for already connected nodes anyways. */
      neighbours.push({
        position: node.map((v, j) => i === j && v > 0 ? v - 1 : v),
        dimension: i,
        direction: 0,
      });

      /* Add the next neighbor in the current dimension to the list of
      neighbours. If the neighbour would be out of the map's upper bounds,
      store the current node's position, it will be skipped during the check
      for already connected nodes anyways. */
      neighbours.push({
        position: node.map((v, j) =>
          i === j && v < this.size[i] - 1 ? v + 1 : v),
        dimension: i,
        direction: 1,
      });
    }

    /* Shuffle the list of neighbours, then connect them in random order. */
    RNG.shuffle(neighbours).forEach((neighbour) => {
      /* If the current neighbour is already connected to the maze, either
      because another node connected it previosuly or because this is the edge
      of the map, and this neighbour would have been out of bounds. */
      if (this.nodes.has(neighbour.position.toString())) {
        /* Return, as this neighbour should not be connected to the maze. */
        return;
      }

      /* Push the dimension and direction of connection to this node's list of
      connections. */
      this.nodes.get(node.toString()).push(neighbour);

      /* Add the neighbour's position to the collection of nodes with this node
      as the first connected node of the new node. */
      this.nodes.set(neighbour.position.toString(), []);

      /* Continue the process with the new node. */
      this.connect(neighbour.position);
    });
  }
}
