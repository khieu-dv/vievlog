import * as Phaser from "phaser";

export class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload(): void {
        // Load Town
        this.load.image("TilesTown", "/assets/tilesets/tuxmon-sample-32px-extruded.png");
        this.load.tilemapTiledJSON("town", "/assets/tilemaps/town.json");

        // Load Route1
        this.load.tilemapTiledJSON("route1", "/assets/tilemaps/route1.json");

        // Load atlas
        this.load.atlas("currentPlayer", "/assets/atlas/atlas.png", "/assets/atlas/atlas.json");
        this.load.atlas("players", "/assets/images/players/players.png", "/assets/atlas/players.json");
    }

    create(): void {
        this.add.text(20, 20, "Loading game...");

        this.scene.start("playGame", { map: 'town', playerTexturePosition: 'front' });

        // Create the player's walking animations from the texture currentPlayer
        this.anims.create({
            key: "misa-left-walk",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-left-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "misa-right-walk",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-right-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "misa-front-walk",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-front-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: "misa-back-walk",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-back-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // onlinePlayer animations
        this.anims.create({
            key: "onlinePlayer-left-walk", 
            frames: this.anims.generateFrameNames("players", {
                start: 0,
                end: 3,
                zeroPad: 3,
                prefix: "bob_left_walk.",
                suffix: ".png"
            }), 
            frameRate: 10, 
            repeat: -1
        });
        
        this.anims.create({
            key: "onlinePlayer-right-walk", 
            frames: this.anims.generateFrameNames("players", {
                start: 0,
                end: 3,
                zeroPad: 3,
                prefix: "bob_right_walk.",
                suffix: ".png"
            }), 
            frameRate: 10, 
            repeat: -1
        });
        
        this.anims.create({
            key: "onlinePlayer-front-walk", 
            frames: this.anims.generateFrameNames("players", {
                start: 0,
                end: 3,
                zeroPad: 3,
                prefix: "bob_front_walk.",
                suffix: ".png"
            }), 
            frameRate: 10, 
            repeat: -1
        });
        
        this.anims.create({
            key: "onlinePlayer-back-walk", 
            frames: this.anims.generateFrameNames("players", {
                start: 0,
                end: 3,
                zeroPad: 3,
                prefix: "bob_back_walk.",
                suffix: ".png"
            }), 
            frameRate: 10, 
            repeat: -1
        });
    }
}