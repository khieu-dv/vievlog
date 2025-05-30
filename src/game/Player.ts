import * as Phaser from "phaser";
import { room } from '../lib/SocketServer';
import { GameConfig } from "../lib/game";

export default class Player extends Phaser.GameObjects.Sprite {
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    public container: { oldPosition?: { x: number; y: number } } = {};
    public speed: number = 150;
    public canChangeMap: boolean = true;
    public playerNickname: Phaser.GameObjects.Text;
    public spacebar: Phaser.Input.Keyboard.Key;
    public debugKey: Phaser.Input.Keyboard.Key;
    private map: Phaser.Tilemaps.Tilemap;
    private playerTexturePosition?: string;
    private mapName: string;

    // Mobile control states
    public mobileControls = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
        debug: false
    };

    // Track previous mobile control states for movement ended detection
    public wasMobileControlPressed = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
        debug: false
    };

    constructor(config: GameConfig & { map?: Phaser.Tilemaps.Tilemap; mapName?: string }) {
        super(config.scene, config.x, config.y, config.key || 'player');

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);
        
        if (config.worldLayer) {
            this.scene.physics.add.collider(this, config.worldLayer);
        }

        // Get playerTexturePosition from scene data
        const sceneData = this.scene.scene.settings.data as any;
        this.setTexture("currentPlayer", `misa-${sceneData?.playerTexturePosition || 'front'}`);

        // Register cursors for player movement
        this.cursors = this.scene.input.keyboard!.createCursorKeys();

        // Player Offset
        if (this.body && 'setOffset' in this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setOffset(0, 24);
            body.setCollideWorldBounds(true);
        }

        // Set depth (z-index)
        this.setDepth(5);

        // Store map reference
        this.map = config.map || (this.scene as any).map;
        
        // Store map name
        this.mapName = config.mapName || 'defaultMap';

        // Player nickname text
        this.playerNickname = this.scene.add.text(
            (this.x - this.width * 1.4), 
            (this.y - (this.height / 2)), 
            'Player'
        );

        // Add key inputs
        this.spacebar = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.debugKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Setup mobile control listeners
        this.setupMobileControls();

        // Initialize previous state tracking
        this.container.oldPosition = { x: this.x, y: this.y };
    }

    setupMobileControls(): void {
        // Listen for custom mobile control events
        this.scene.events.on('mobileControl', (control: string, state: boolean) => {
            switch(control) {
                case 'up':
                    this.mobileControls.up = state;
                    break;
                case 'down':
                    this.mobileControls.down = state;
                    break;
                case 'left':
                    this.mobileControls.left = state;
                    break;
                case 'right':
                    this.mobileControls.right = state;
                    break;
                case 'space':
                    this.mobileControls.space = state;
                    break;
                case 'debug':
                    this.mobileControls.debug = state;
                    break;
            }
        });

        // Also listen for keyboard events on the scene
        this.scene.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'ArrowUp':
                    this.mobileControls.up = true;
                    break;
                case 'ArrowDown':
                    this.mobileControls.down = true;
                    break;
                case 'ArrowLeft':
                    this.mobileControls.left = true;
                    break;
                case 'ArrowRight':
                    this.mobileControls.right = true;
                    break;
                case 'Space':
                    this.mobileControls.space = true;
                    break;
                case 'KeyD':
                    this.mobileControls.debug = true;
                    break;
            }
        });

        this.scene.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'ArrowUp':
                    this.mobileControls.up = false;
                    break;
                case 'ArrowDown':
                    this.mobileControls.down = false;
                    break;
                case 'ArrowLeft':
                    this.mobileControls.left = false;
                    break;
                case 'ArrowRight':
                    this.mobileControls.right = false;
                    break;
                case 'Space':
                    this.mobileControls.space = false;
                    break;
                case 'KeyD':
                    this.mobileControls.debug = false;
                    break;
            }
        });
    }

    update(time: number, delta: number): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        const prevVelocity = body.velocity.clone();

        // Show player nickname above player
        this.showPlayerNickname();

        // Player door interaction
        this.doorInteraction();

        // Player world interaction
        this.worldInteraction();

        // Stop any previous movement from the last frame
        body.setVelocity(0);

        // Check movement from both cursors and mobile controls
        const isLeftPressed = this.cursors.left.isDown || this.mobileControls.left;
        const isRightPressed = this.cursors.right.isDown || this.mobileControls.right;
        const isUpPressed = this.cursors.up.isDown || this.mobileControls.up;
        const isDownPressed = this.cursors.down.isDown || this.mobileControls.down;

        // Horizontal movement
        if (isLeftPressed) {
            body.setVelocityX(-this.speed);
        } else if (isRightPressed) {
            body.setVelocityX(this.speed);
        }

        // Vertical movement
        if (isUpPressed) {
            body.setVelocityY(-this.speed);
        } else if (isDownPressed) {
            body.setVelocityY(this.speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        body.velocity.normalize().scale(this.speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (isLeftPressed) {
            this.anims.play("misa-left-walk", true);
        } else if (isRightPressed) {
            this.anims.play("misa-right-walk", true);
        } else if (isUpPressed) {
            this.anims.play("misa-back-walk", true);
        } else if (isDownPressed) {
            this.anims.play("misa-front-walk", true);
        } else {
            this.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this.setTexture("currentPlayer", "misa-left");
            else if (prevVelocity.x > 0) this.setTexture("currentPlayer", "misa-right");
            else if (prevVelocity.y < 0) this.setTexture("currentPlayer", "misa-back");
            else if (prevVelocity.y > 0) this.setTexture("currentPlayer", "misa-front");
        }
    }

    showPlayerNickname(): void {
        this.playerNickname.x = this.x - (this.playerNickname.width / 2);
        this.playerNickname.y = this.y - (this.height / 2);
    }

    isMoved(): boolean {
        if (this.container.oldPosition && 
            (this.container.oldPosition.x !== this.x || this.container.oldPosition.y !== this.y)) {
            this.container.oldPosition = { x: this.x, y: this.y };
            return true;
        } else {
            this.container.oldPosition = { x: this.x, y: this.y };
            return false;
        }
    }


    doorInteraction(): void {
        if (!this.map) return;
        
        const isSpacePressed = this.spacebar.isDown || this.mobileControls.space;
        
        this.map.findObject("Doors", (obj: any) => {
            if ((this.y >= obj.y && this.y <= (obj.y + obj.height)) && 
                (this.x >= obj.x && this.x <= (obj.x + obj.width))) {
                console.log('Player is by ' + obj.name);
                if (isSpacePressed) {
                    console.log('Door is open!');
                }
            }
            return false;
        });
    }

    worldInteraction(): void {
        if (!this.map) return;
        
        this.map.findObject("Worlds", (world: any) => {
            if ((this.y >= world.y && this.y <= (world.y + world.height)) && 
                (this.x >= world.x && this.x <= (world.x + world.width))) {
                console.log('Player is by world entry: ' + world.name);

                // Get playerTexturePosition from Worlds object property
                let playerTexturePosition: any;
                if (world.properties) {
                    playerTexturePosition = world.properties.find((property: any) => 
                        property.name === 'playerTexturePosition'
                    );
                }
                if (playerTexturePosition) {
                    this.playerTexturePosition = playerTexturePosition.value;
                }

                // Load new level (tiles map)
                this.scene.registry.destroy();
                this.scene.scene.restart({
                    map: world.name, 
                    playerTexturePosition: this.playerTexturePosition
                });

                room.then((room: any) => room.send("PLAYER_CHANGED_MAP", {
                    map: world.name
                }));
            }
            return false;
        });
    }

    destroy(): void {
        // Clean up mobile control listeners
        this.scene.events.off('mobileControl');
        super.destroy();
        if (this.playerNickname) {
            this.playerNickname.destroy();
        }
    }
}