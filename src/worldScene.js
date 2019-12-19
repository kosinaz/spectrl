import Scene from './scene.js';
import World from './world.js';

/**
 * Represents the scene that displays the ingame world.
 *
 * @export
 * @class WorldScene
 * @extends {Scene}
 */
export default class WorldScene extends Scene {
  /**
   * Starts the game.
   *
   * @memberof WorldScene
   */
  start() {
    super.start();
    this.music = new Audio('./music/unprepared.ogg');
    this.music.loop = true;
    this.music.play();
    this.world = new World(this);
    this.world.create();
  }

  /**
   * Redraw the world around the hero.
   *
   * @memberof WorldScene
   */
  update() {
    this.game.display.clear();
    this.world.hero.explored.forEach((position) => {
      const p = position.split(',');
      if (
        +p[2] === this.world.hero.z &&
        +p[3] === this.world.hero.a &&
        +p[4] === this.world.hero.b &&
        +p[5] === this.world.hero.c
      ) {
        let char = this.world.map.get(position);
        let color = '#444';
        let bg = '#000';
        if (this.world.hero.fov.has(`${p[0]},${p[1]}`)) {
          color = '#fff';
          const brightness = ['a', '8', '6'][this.world.hero.z];
          const red = this.world.hero.a === 0 ? brightness : '0';
          const green = this.world.hero.a === 1 ? brightness : '0';
          const blue = this.world.hero.a === 2 ? brightness : '0';
          bg = `#${red}${green}${blue}`;
          this.game.display.setOptions({
            fontFamily: ['ba', 'sm', 'ty'][this.world.hero.c],
          });
          const actor = this.world.actors.find((actor) => actor.isAt(position));
          if (actor) {
            char = actor.char;
            actor.target = [this.world.hero.x, this.world.hero.y];
          }
          if (this.world.hero.isAt(position)) {
            char = '@';
          }
        }
        this.game.display.draw(+p[0], +p[1], char, color, bg);
      }
    });
    this.game.display.draw(54, 0, this.music.muted ? '-' : '~', '#fff', '#000');
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'mouseup') {
      this.world.hero.target = null;
    } else if (event.type === 'mousedown') {
      if (this.eventX === 54 && this.eventY === 0) {
        this.music.muted = !this.music.muted;
        const char = this.music.muted ? '-' : '~';
        this.game.display.draw(54, 0, char, '#fff', '#000');
      }
      this.world.hero.target = [this.eventX, this.eventY];
      this.world.hero.moveToTargetAndUnlock();
    } else if (event.type === 'keydown') {
      let x = this.world.hero.x;
      let y = this.world.hero.y;
      if (event.keyCode === 109 || event.keyCode === 189) {
        this.music.muted = !this.music.muted;
        this.display.draw(
            54,
            0,
            this.music.muted ? '-' : '~', '#fff', '#000',
        );
        return;
      } else if (event.keyCode === 13) {
        const char = this.world.map.get(this.world.hero.position);
        if (char === '<') {
          this.world.hero.z += 1;
          this.world.engine.unlock();
          return;
        } else if (char === '>') {
          this.world.hero.z -= 1;
          this.world.engine.unlock();
          return;
        } else if (char === '{') {
          this.world.hero.a += 1;
          this.world.engine.unlock();
          return;
        } else if (char === '}') {
          this.world.hero.a -= 1;
          this.world.engine.unlock();
          return;
        } else if (char === '[') {
          this.world.hero.b += 1;
          this.world.engine.unlock();
          return;
        } else if (char === ']') {
          this.world.hero.b -= 1;
          this.world.engine.unlock();
          return;
        } else if (char === '(') {
          this.world.hero.c += 1;
          this.world.engine.unlock();
          return;
        } else if (char === ')') {
          this.world.hero.c -= 1;
          this.world.engine.unlock();
          return;
        } else if (char === '^') {
          this.win();
        }
      }
      if ([37, 65, 100].includes(event.keyCode)) {
        x -= 1;
      } else if ([38, 87, 104].includes(event.keyCode)) {
        y -= 1;
      } else if ([39, 68, 102].includes(event.keyCode)) {
        x += 1;
      } else if ([40, 83, 98].includes(event.keyCode)) {
        y += 1;
      } else if (event.keyCode === 103) {
        x -= 1;
        y -= 1;
      } else if (event.keyCode === 105) {
        x += 1;
        y -= 1;
      } else if (event.keyCode === 99) {
        x += 1;
        y += 1;
      } else if (event.keyCode === 97) {
        x -= 1;
        y += 1;
      }
      this.world.hero.target = [x, y];
      this.world.hero.moveToTargetAndUnlock();
    }
  }
}
