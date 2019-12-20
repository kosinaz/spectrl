import Scene from './scene.js';

/**
 * Represents the scene that displays the help.
 *
 * @export
 * @class HelpScene
 * @extends {Scene}
 */
export default class HelpScene extends Scene {
  /**
   * Opens the help scene.
   *
   * @memberof HelpScene
   */
  start() {
    super.start();
    this.game.display.drawText(25, 1, 'Help');
    this.game.display.drawText(1, 3, `Desription

      As Arakhon, the despised ciblityian dragonspawn, your 
      goal is to reach Aribaia, the highest plane of Spect.

      In addition to width, height, and depth, the world of 
      Spect also has the dimensions of the color spectrum, 
      the substantial structure, and the substantial 
      surface. 
      Therefore everything and everyone in this world has 
      a different structure, surface, and color, but deep 
      inside, they are still the same. So keep in mind, 
      animate or inanimate, some of them will help you, 
      some of them will hurt you, based on which plane 
      they are on.

      The game is rendered in two dimensions, width, and 
      height. It displays the different levels of depth 
      with brightnesses, the color with hues, the structure 
      with characters, and the surface with typefaces. 
      Lowercase characters are living beings, uppercase 
      characters are impassable obstacles, and the dot 
      represents the floor.

      
      Controls
      
      Move/attack with mouse/arrow/num/wasd.
      Move upstairs/downstairs with enter.
      Mute/unmute the music with minus.
      

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
      if (this.eventX > 1 && this.eventX < 6 && this.eventY === 35) {
        this.switchTo(this.game.menuScene);
      }
    }
  }
}
