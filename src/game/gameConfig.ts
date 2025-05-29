import * as Phaser from "phaser";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [Scene1, Scene2],
};