import Scene from './scene.js';

/**
 * Represents the scene that displays the credits.
 *
 * @export
 * @class CreditsScene
 * @extends {Scene}
 */
export default class CreditsScene extends Scene {
  /**
   * Opens the credits scene.
   *
   * @memberof CreditsScene
   */
  start() {
    super.start();
    this.game.display.drawText(23, 1, 'Credits');
    this.game.display.drawText(1, 3, `Code and ASCII art

      original content made by Zoltan Kosina 
      Licensed under the Unlicense
    

      Code Toolkit

      rot.js ©2012-2019 Ondrej Zara
      Licensed under the BSD 3-Clause "New" or "Revised"
    

      Music

      Unprepared ©2019 Joshua McLean (mrjoshuamclean.com)
      Licensed under Creative Commons Attribution 4.0 
      International
      
      
      Font
      
      Free and free for personal use from dafont.com
      /smalltypewriting-medium.font
      /sv-basic-manual.font
      /typori.font
      
      







      >Back`);
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
      if (this.eventX > 1 && this.eventX < 6 && this.eventY === 37) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
