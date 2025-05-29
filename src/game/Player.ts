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
    private map: Phaser.Tilemaps.Tilemap;
    private playerTexturePosition?: string;
    private mapName: string; // Thêm property để lưu tên map

    constructor(config: GameConfig & { map?: Phaser.Tilemaps.Tilemap }) {
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
        
        // Store map name - lấy từ GameConfig thay vì truyền Tilemap
        this.mapName = (config as any).mapName || 'defaultMap';

        // Player nickname text
        this.playerNickname = this.scene.add.text(
            (this.x - this.width * 1.4), 
            (this.y - (this.height / 2)), 
            'Player'
        );

        // Add spacebar input
        this.spacebar = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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

        // Horizontal movement
        if (this.cursors.left.isDown) {
            body.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown) {
            body.setVelocityX(this.speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            body.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown) {
            body.setVelocityY(this.speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        body.velocity.normalize().scale(this.speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.anims.play("misa-left-walk", true);
        } else if (this.cursors.right.isDown) {
            this.anims.play("misa-right-walk", true);
        } else if (this.cursors.up.isDown) {
            this.anims.play("misa-back-walk", true);
        } else if (this.cursors.down.isDown) {
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
        
        this.map.findObject("Doors", (obj: any) => {
            if ((this.y >= obj.y && this.y <= (obj.y + obj.height)) && 
                (this.x >= obj.x && this.x <= (obj.x + obj.width))) {
                console.log('Player is by ' + obj.name);
                if (this.spacebar.isDown) {
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
                // Optionally, remove specific event listeners here if needed, e.g.:
                // this.scene.events.off('eventName');
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
}