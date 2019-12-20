import Scene from './scene.js';

/**
 * Represents the scene that displays the menu.
 *
 * @export
 * @class MenuScene
 * @extends {Scene}
 */
export default class MenuScene extends Scene {
  /**
   * Opens the menu scene.
   *
   * @memberof MenuScene
   */
  start() {
    super.start();
    this.selected = 0;
    this.game.display.drawText(
        0,
        0,
        ` .                                                     .
          .          ###  ###  ###  ###  ###  ##   #            .
          .          #    # #  #    #     #   # #  #            .
          .          ###  ###  ###  #     #   ##   #            .
          .            #  #    #    #     #   # #  #            .
          .          ###  #    ###  ###   #   # #  ###          .
          .                                                     .
          .                 Arakhon's Ascension                 .
          .                                                     .
          .                         .,..                        .
          .                       ,*  .,.                       .
          .                      *,%#,,*.                       .   
          . >Start        *    ,,**//**,.                       .
          .              //*   *,,,*/*,.                        .
          .  Help       /**        ,,,,.                        .
          .             /**      ,,,,*****,                     .
          .  Credits    /**, .**/((//(((*,,///*,                .
          .             /*,,**,/##(((##(*,,*///*,.              .
          .             **,,,,,*#((/((((*....,***,       */     .
          .             .,..,,.,/(/**///,..  .**,.       (/*    .
          .               ...    .,*,,*,,..   *,.         **.   .
          .                       */****.,,, ,*,.        ,**.   .
          .                       ,/****,.,,.     , */ / ***,   .
          .                       ,****,,,,,,,,.,*/////*/**.    .
          .                      **********,,.,,****///**,.     .
          .                     ////***********/*,.,,,,,..      .
          .                    ////*,******,.******.            .
          .                   .*/*,,,,,,***,../**,..            .
          .                   .**,.....,,**,...,*....           .
          .                    ,,..    .,,,,..  ...,,..         .
          .                    */*.     .,,,..    .,*.          .
          .                     ((*     .*/*.     .,*..         .
          .                     */*.   *.,/,.    .,**,.         .
          .                  .,,,,..   * .,.,.   , *. .,        .
          .                .,**,..       .,,.    . *   *        .
          . Made for the   *  ,..       .,**,.                  .
          .                            *  ,. ..                 .
          . TEXT ONLY JAM                                       .
          .                                                     .
          `);
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof MenuScene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 40 && this.selected < 2) {
        this.game.display.draw(2, 12 + this.selected * 2, ' ');
        this.selected += 1;
        this.game.display.draw(2, 12 + this.selected * 2, '>');
      } else if (event.keyCode === 38 && this.selected > 0) {
        this.game.display.draw(2, 12 + this.selected * 2, ' ');
        this.selected -= 1;
        this.game.display.draw(2, 12 + this.selected * 2, '>');
      } else if (event.keyCode === 13) {
        if (this.selected === 0) {
          this.switchTo(this.game.worldScene);
        } else if (this.selected === 1) {
          this.switchTo(this.game.helpScene);
        } else if (this.selected === 2) {
          this.switchTo(this.game.creditsScene);
        }
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX > 2) {
        if (this.eventX < 8 && this.eventY === 12) {
          this.switchTo(this.game.worldScene);
        } else if (this.eventX < 7 && this.eventY === 14) {
          this.switchTo(this.game.helpScene);
        } else if (this.eventX < 10 && this.eventY === 16) {
          this.switchTo(this.game.creditsScene);
        }
      }
    }
  }
}
