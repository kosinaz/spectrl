import {Display} from '../lib/rot/index.js';
import MenuScene from './menuScene.js';
import WorldScene from './worldScene.js';
import HelpScene from './helpScene.js';
import CreditsScene from './creditsScene.js';

/**
 * Represent the game core object.
 *
 * @class Game
 */
export default class Game {

}
Game.display = new Display({width: 55, height: 37, forceSquareRatio: true});
document.body.appendChild(Game.display.getContainer());
Game.worldScene = new WorldScene(Game);
Game.helpScene = new HelpScene(Game);
Game.creditsScene = new CreditsScene(Game);
Game.menuScene = new MenuScene(Game);
Game.menuScene.start();
