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
    this.selected = 0;
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
    if (this.world.hero.died) {
      this.switchTo(this.game.failScene);
      return;
    }
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
          const red = this.world.hero.a === 0 ? 'f' : '8';
          const green = this.world.hero.a === 1 ? 'f' : '8';
          const blue = this.world.hero.a === 2 ? 'f' : '8';
          color = `#${red}${green}${blue}`;
          const bgbrightness = ['a', '8', '6'][this.world.hero.z];
          const bgred = this.world.hero.a === 0 ? bgbrightness : '0';
          const bggreen = this.world.hero.a === 1 ? bgbrightness : '0';
          const bgblue = this.world.hero.a === 2 ? bgbrightness : '0';
          bg = `#${bgred}${bggreen}${bgblue}`;
          this.game.display.setOptions({
            fontFamily: ['ba', 'sm', 'ty'][this.world.hero.c],
          });
          const actor = this.world.actors.find((actor) => actor.isAt(position));
          if (actor) {
            color = ('#fff');
            char = actor.char;
          }
          if (this.world.hero.isAt(position)) {
            color = ('#fff');
            char = '@';
          }
        }
        this.game.display.draw(+p[0], +p[1] + 1, char, color, bg);
      }
    });
    this.game.display.drawText(
        45, 0, `Music: ${this.music.muted ? 'off' : 'on'}`,
    );
    this.game.display.drawText(0, 0, `Health: ${this.world.hero.health}`);
    this.game.display.drawText(12, 0, `Damage: ${this.world.hero.damage}`);
    this.game.display.drawText(24, 0, `Gold: ${this.world.hero.gold}`);
    if (this.world.hero.trade) {
      const item = ['', '', '', '', '', 'health'][this.world.hero.trade];
      const gold = 3;
      if (this.world.hero.gold < gold) {
        this.game.display.drawText(
            0, 38, 'You don\'t have enough gold to trade with me.',
        );
        this.world.hero.trade = 0;
        return;
      }
      this.game.display.drawText(
          0, 38, `Do you want a ${item} potion for ${gold} gold?`,
      );
      if (this.selected) {
        this.game.display.drawText(48, 38, 'Yes >No');
      } else {
        this.game.display.drawText(47, 38, '>Yes  No');
      }
    } else if (this.world.hero.gift) {
      this.game.display.drawText(
          0, 38, 'Here, have this health potion and take care my friend!',
      );
      this.world.hero.gift = 0;
    }
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    const char = this.world.map.get(this.world.hero.position);
    if (event.type === 'mouseup') {
      this.world.hero.target = null;
    } else if (event.type === 'mousedown') {
      if (this.eventX > 45 && this.eventY === 0) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      }
      if (this.world.hero.trade) {
        if ([48, 49, 50].includes(this.eventX) && this.eventY === 38) {
          this.world.hero.gold -= 3;
          this.world.hero.health += 1;
          this.world.hero.trade = 0;
        }
        this.world.hero.trade = 0;
        this.update();
        return;
      }
      if (this.world.hero.isAtXY(this.eventX, this.eventY - 1)) {
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
          this.switchTo(this.game.winScene);
          return;
        }
      }
      this.world.hero.target = [this.eventX, this.eventY - 1];
      this.world.hero.moveToTargetAndUnlock();
    } else if (event.type === 'keydown') {
      if (this.world.hero.trade) {
        if (event.keyCode === 37) {
          this.selected = 0;
        } else if (event.keyCode === 39) {
          this.selected = 1;
        } else if (event.keyCode === 13) {
          if (!this.selected) {
            this.world.hero.gold -= 3;
            this.world.hero.health += 1;
          }
          this.world.hero.trade = 0;
        }
        this.update();
        return;
      }
      let x = this.world.hero.x;
      let y = this.world.hero.y;
      if (event.keyCode === 77) {
        this.music.muted = !this.music.muted;
        this.update();
        return;
      } else if (event.keyCode === 13) {
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
          this.switchTo(this.game.winScene);
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
