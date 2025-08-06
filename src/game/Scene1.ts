import * as Phaser from "phaser";

export class Scene1 extends Phaser.Scene {
    private progressBar!: Phaser.GameObjects.Graphics;
    private percentText!: Phaser.GameObjects.Text;

    constructor() {
        super("bootGame");
    }

    preload(): void {
        console.log('Scene1 preload() started');
        
        // Create loading progress bar
        this.createLoadingScreen();
        
        // Load atlas with error handling
        this.load.on('loaderror', (file: any) => {
            console.error('Failed to load file:', file.key, file.url);
        });

        this.load.on('filecomplete', (key: string) => {
            console.log('Successfully loaded:', key);
        });

        // Update progress bar during loading
        this.load.on('progress', (value: number) => {
            this.updateLoadingProgress(value);
        });

        // Load Town
        this.load.image("TilesTown", "/assets/tilesets/tuxmon-sample-32px-extruded.png");
        this.load.tilemapTiledJSON("town", "/assets/tilemaps/town.json");

        // Load Route1
        this.load.tilemapTiledJSON("route1", "/assets/tilemaps/route1.json");

        // Preload common maps for smoother transitions
        this.preloadCommonMaps();

        this.load.atlas("currentPlayer", "/assets/atlas/atlas.png", "/assets/atlas/atlas.json");
        this.load.atlas("players", "/assets/atlas/players.png", "/assets/atlas/players.json");
        
        console.log('Scene1 preload() finished setting up loads');
    }

    preloadCommonMaps(): void {
        // Add any additional maps that should be preloaded for smoother transitions
        // This reduces loading time when switching between maps
        console.log('Preloading common maps for smoother transitions');
        
        // Add more maps here if needed in the future
        // Example: this.load.tilemapTiledJSON("forest", "/assets/tilemaps/forest.json");
    }

    createLoadingScreen(): void {
        // Create loading background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x222222);
        graphics.fillRect(0, 0, 800, 450);

        // Create loading text
        const loadingText = this.add.text(400, 200, 'Loading Game...', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        loadingText.setOrigin(0.5);

        // Create progress bar background
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x333333);
        progressBox.fillRect(250, 270, 300, 20);

        // Create progress bar
        this.progressBar = this.add.graphics();
    }

    updateLoadingProgress(value: number): void {
        // Update progress bar
        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00);
        this.progressBar.fillRect(250, 270, 300 * value, 20);

        // Update percentage text
        const percentage = Math.round(value * 100);
        if (this.percentText) {
            this.percentText.setText(`${percentage}%`);
        } else {
            this.percentText = this.add.text(400, 280, `${percentage}%`, {
                fontSize: '16px',
                color: '#ffffff'
            });
            this.percentText.setOrigin(0.5);
        }
    }

    create(): void {
        console.log('Scene1 create() called - assets loaded successfully');
        
        // Smooth transition to game scene
        this.tweens.add({
            targets: [this.progressBar, this.percentText],
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                try {
                    this.scene.start("playGame", { map: 'town', playerTexturePosition: 'front' });
                } catch (error) {
                    console.error('Error starting playGame scene:', error);
                    this.add.text(20, 50, 'Error: ' + error, { color: '#ff0000' });
                }
            }
        });

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

        // Ninja combat animations (using existing frames with faster speed for combat effect)
        this.anims.create({
            key: "misa-attack-left",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-left-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 20, // Faster for attack
            repeat: 0 // Play once
        });

        this.anims.create({
            key: "misa-attack-right",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-right-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "misa-attack-front",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-front-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "misa-attack-back",
            frames: this.anims.generateFrameNames("currentPlayer", {
                prefix: "misa-back-walk.",
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 20,
            repeat: 0
        });
    }
}