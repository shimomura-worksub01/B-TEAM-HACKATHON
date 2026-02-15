import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import MainMenu from './scenes/MainMenu.js';
import MainGame from './scenes/Game.js';
import { GAME_WIDTH, GAME_HEIGHT, GAME_BG_COLOR } from './config/constants.js';

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: GAME_BG_COLOR,
    parent: 'phaser-example',
    scene: [Boot, Preloader, MainMenu, MainGame],
    physics: {
        default: 'arcade',
        arcade: { debug: false },
    },
};

let game = new Phaser.Game(config);