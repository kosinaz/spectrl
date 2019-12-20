import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class FailScene
 * @extends {Scene}
 */
export default class FailScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof FailScene
   */
  start() {
    super.start();
    this.game.display.setOptions({
      color: '#fff',
      fontFamily: 'ty',
    });
    this.game.display.drawText(
        0,
        0,
        ` .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                    Arakhon died!                    .
          .                                                     .
          .                      GAME OVER                      .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     .
          .                                                     . 
          .                                                     . 
          .                                                     . 
          .>Back to main                                        .
          .                                                     .
            `);
    this.game.display.setOptions({
      bg: '#000',
    });
  }

  /**
   * Handles the keydown and mousedown events of this scene.
   *
   * @param {Event} event
   * @memberof Scene
   */
  handleEvent(event) {
    super.handleEvent(event);
    if (event.type === 'keydown') {
      if (event.keyCode === 13) {
        this.switchTo(this.game.menuScene);
      }
    } else if (event.type === 'mousedown') {
      if (this.eventX > 1 && this.eventX < 14 && this.eventY === 37) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
