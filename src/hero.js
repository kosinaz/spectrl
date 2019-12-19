import {RNG} from '../lib/rot/index.js';
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
   * @param {World} world The world of the actor.
   * @param {string} position The actor's position as a comma separated string.
   * @memberof Hero
   */
  constructor(world, position) {
    super(world, position);
    this.char = '@';
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
    this.ps.compute(this.x, this.y, 11, (x, y) => {
      this.fov.add(`${x},${y}`);
      const position = this.getPosition(x, y);
      if (!this.explored.has(position)) {
        this.explored.add(position);
        const char = this.world.map.get(position);
        if (!RNG.getUniformInt(0, 100) && char === '.') {
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
    if (this.moveToTarget()) {
      this.world.engine.unlock();
    }
  }

  /**
 * Displays the victory screen.
 *
 */
  win() {
    this.won = true;
    this.display.clear();
    this.display.drawText(
        0,
        0,
        ` .%#*,,****//**,,,,,,,............................     .
          .#**//*,,,,*,,,*,,.................CONGRATULATIONS!   .
          .(*//*,**/***,.,,,,,,,,.............                  .
          .*,*/,,,,**//*,..,*****/**,,...Arakhon ascended to the.
          .*/**/**,***/,,,,,,****(#,,,......highest existense!  .
          .,/,****,****,,,...,///****,....................      .
          .,/*,*******/*...,...///**,.........................  .
          .,**,*,*****/**,...,,///*,...... ......................
          .,,**,*,,***///*/***////*..........     ...............
          .,,**,,,,,,*///(/////****..............          ......
          .,,**,.,,,,,*///(((/////**,...............            .
          .,.,*,,.,,,,,,,**((///(//****.....     .....          .
          .,.,*,,..,,,,,,,*/(//////////*,......       ....      .
          .,..,,,..,,.....*//////**(((/*,.......           ...  .
          .,..,,,,..,,....,((///***/((//*,.   ....            ...
          .,...,,,,.......*((///*,,*((((/...     ..             .
          ......,,,...**,*/(((/**,,,/(#(*....                   .
          ......,,,,///////((((/*,,*/##/,......                 .
          ......,,,////////(((//*,**(((/,   ....                .
          ........,///**((((((/////(((//.*.   ...               .
          ........./(/*/((/(///////////**..*     ..             .
          .........,((*/((/(/*,*/////***/.*.. ,    ..           .
          ........,*//**//(//*,,//////*////*.**                 .
          ......,*//**,.*//(/*,,*////*,*///**** *               .
          ......//(/*,..**/((*,,*/(//**..,///****               .
          .....,/(/*,....*///*,,./(//*,.....****, *             .
          .... ./*,,,.....*/*,,..,((**,..... ***.*              .
          ....  ,..*......//*,... */***,......****              .
          ....   ........*(/,,... ,*/***.......//**.      .     .
          . ..   .......*//*,,....*/**,,  .... ,**,.*..//,      .
          . ..   .......*//*,....,*//*,.    ...  ,******        .
          . ..    ......,/,..,*..**//*,.     ...                .
          . ..    .......*. .*   ,,,,...      ...               .
          .  .     .......,      * /. ,.        ..              .
          .  .     .......         ,  *           ..            . 
          .  .      ......                          .           .
          .  .      ......                                      .
          .  .      ......                                      .
          `);
  }
}
