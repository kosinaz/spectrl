import Map from "./map.js";
import RNG from "../rng.js";
import { Room as RoomClass, Corridor } from "./features.js";
/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
export default class DividedMaze extends Map {
    constructor(width, height, options) {
        super(width, height);
        this._stack = [];
        this._map = [];
        this._rooms = [];
        this._corridors = [];
        this._doors = [];
        this._options = {
            roomWidth: [1, 5],
            roomHeight: [1, 5],
        };
        Object.assign(this._options, options);
        this._map = [];
        this._doors = [];
        this._corridors = [];
        this._rooms = [];
    }
    create(callback) {
        let w = this._width;
        let h = this._height;
        this._map = [];
        for (let i = 0; i < w; i++) {
            this._map.push([]);
            for (let j = 0; j < h; j++) {
                let border = (i == 0 || j == 0 || i + 1 == w || j + 1 == h);
                this._map[i].push(border ? 1 : 0);
            }
        }
        this._stack = [
            [1, 1, w - 2, h - 2]
        ];
        this._rooms = [];
        this._corridors = [];
        if (this._width > this._options.roomWidth[0] * 2 + 1 &&
            this._height > this._options.roomHeight[0] * 2 + 1) {
            this._process();
        }
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                callback(i, j, this._map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    getRooms() {
        return this._rooms;
    }
    getCorridors() {
        return this._corridors;
    }
    _process() {
        while (this._stack.length) {
            let room = this._stack.shift(); /* [left, top, right, bottom] */
            this._partitionRoom(room);
        }
    }
    _partitionRoom(room) {
        let availX = [];
        let availY = [];
        let doors = [];
        let minW = this._options.roomWidth[0];
        let minH = this._options.roomHeight[0];
        for (let i = room[0]; i <= room[2]; i++) {
            if (i < 1 || i > this._width - 3) {
                continue;
            }
            let top = this._map[i][room[1] - 1];
            let bottom = this._map[i][room[3] + 1];
            if (!top) {
                doors.push([i, room[1] - 1]);
            }
            if (!bottom) {
                doors.push([i, room[3] + 1]);
            }
            if (top &&
                bottom &&
                !(i % 2) &&
                i >= room[0] + minW &&
                i <= room[2] - minW) {
                availX.push(i);
            }
        }
        for (let j = room[1]; j <= room[3]; j++) {
            if (j < 1 || j > this._height - 3) {
                continue;
            }
            let left = this._map[room[0] - 1][j];
            let right = this._map[room[2] + 1][j];
            if (!left) {
                doors.push([room[0] - 1, j]);
            }
            if (!right) {
                doors.push([room[2] + 1, j]);
            }
            if (left &&
                right &&
                !(j % 2) &&
                j >= room[1] + minH &&
                j <= room[3] - minH) {
                availY.push(j);
            }
        }
        if (!availX.length || !availY.length) {
            if (room[0] === room[2] || room[1] === room[3]) {
                this._corridors.push(new Corridor(room[0], room[1], room[2], room[3]));
            }
            else {
                let newRoom = new RoomClass(room[0], room[1], room[2], room[3]);
                doors.forEach(door => newRoom.addDoor(door[0], door[1]));
                this._rooms.push(newRoom);
            }
            return;
        }
        let x = RNG.getItem(availX);
        let y = RNG.getItem(availY);
        this._map[x][y] = 1;
        let walls = [];
        let w = [];
        walls.push(w); /* left part */
        for (let i = room[0]; i < x; i++) {
            this._map[i][y] = 1;
            if (i % 2)
                w.push([i, y]);
        }
        w = [];
        walls.push(w); /* right part */
        for (let i = x + 1; i <= room[2]; i++) {
            this._map[i][y] = 1;
            if (i % 2)
                w.push([i, y]);
        }
        w = [];
        walls.push(w); /* top part */
        for (let j = room[1]; j < y; j++) {
            this._map[x][j] = 1;
            if (j % 2)
                w.push([x, j]);
        }
        w = [];
        walls.push(w); /* bottom part */
        for (let j = y + 1; j <= room[3]; j++) {
            this._map[x][j] = 1;
            if (j % 2)
                w.push([x, j]);
        }
        let solid = RNG.getItem(walls);
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];
            if (w == solid) {
                continue;
            }
            let hole = RNG.getItem(w);
            this._map[hole[0]][hole[1]] = 0;
            this._doors.push(hole);
        }
        this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
        this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
        this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
        this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
    }
}
