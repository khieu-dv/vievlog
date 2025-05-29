import * as Phaser from "phaser";
import { GameConfig } from "../lib/game";

export default class OnlinePlayer extends Phaser.GameObjects.Sprite {
    public map: string;
    public playerNickname: Phaser.GameObjects.Text;

    constructor(config: GameConfig) {
        super(config.scene, config.x, config.y, config.playerId || 'player');

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);
        
        if (config.worldLayer) {
            this.scene.physics.add.collider(this, config.worldLayer);
        }

        this.setTexture("players", "bob_front.png").setScale(1.9, 2.1);

        this.map = config.map || 'town';
        console.log(`Map of ${config.playerId} is ${this.map}`);

        // Player Offset
        if (this.body && 'setOffset' in this.body) {
            (this.body as Phaser.Physics.Arcade.Body).setOffset(0, 24);
        }

        // Display playerId above player
        this.playerNickname = this.scene.add.text(
            (this.x - 40), 
            (this.y - 25), 
            config.playerId || 'Player'
        );
    }

    isWalking(position: string, x: number, y: number): void {
        // Player
        this.anims.play(`onlinePlayer-${position}-walk`, true);
        this.setPosition(x, y);

        // PlayerId
        this.playerNickname.x = this.x - 40;
        this.playerNickname.y = this.y - 25;
    }

    stopWalking(position: string): void {
        this.anims.stop();
        this.setTexture("players", `bob_${position}.png`);
    }

    destroy(): void {
        super.destroy();
        this.playerNickname.destroy();
    }
}