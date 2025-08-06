import * as Phaser from "phaser";
import { room } from '../lib/SocketServer';
import { GameConfig } from "../lib/game";

export default class Player extends Phaser.GameObjects.Sprite {
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    public container: { oldPosition?: { x: number; y: number } } = {};
    public speed = 150;
    public canChangeMap = true;
    public playerNickname: Phaser.GameObjects.Text;
    public spacebar: Phaser.Input.Keyboard.Key;
    public debugKey: Phaser.Input.Keyboard.Key;
    private map: Phaser.Tilemaps.Tilemap;
    private playerTexturePosition?: string;
    private mapName: string;

    // Champion Combat System with Gun
    public health = 100;
    public maxHealth = 100;
    public energy = 100;
    public maxEnergy = 100;
    public isAttacking = false;
    public isShooting = false;
    public isBlocking = false;
    public combo = 0;
    public lastAttackTime = 0;
    public lastShootTime = 0;
    public attackCooldown = 300; // milliseconds
    public shootCooldown = 500; // milliseconds
    public shootRange = 200;
    public healthBar!: Phaser.GameObjects.Graphics;
    public energyBar!: Phaser.GameObjects.Graphics;
    private combatText!: Phaser.GameObjects.Text;
    private hitEffect!: Phaser.GameObjects.Graphics;
    private bullets: Phaser.GameObjects.Graphics[] = [];
    public lastFacingDirection = 'down'; // Track player's facing direction

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

    // Mouse control states
    public mouseControls = {
        isMoving: false,
        targetX: 0,
        targetY: 0,
        isDesktop: false,
        wasMoving: false
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

        // Setup mouse controls
        this.setupMouseControls();

        // Initialize previous state tracking
        this.container.oldPosition = { x: this.x, y: this.y };

        // Initialize ninja combat system
        this.initializeCombatSystem();
    }

    initializeCombatSystem(): void {
        // Create health bar
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // Create energy bar
        this.energyBar = this.scene.add.graphics();
        this.updateEnergyBar();

        // Create combat text
        this.combatText = this.scene.add.text(this.x, this.y - 60, '', {
            fontSize: '14px',
            color: '#ffff00',
            fontStyle: 'bold'
        });
        this.combatText.setDepth(10);

        // Create hit effect
        this.hitEffect = this.scene.add.graphics();
        this.hitEffect.setDepth(8);
    }

    updateHealthBar(): void {
        this.healthBar.clear();
        
        // Background
        this.healthBar.fillStyle(0x000000);
        this.healthBar.fillRect(this.x - 32, this.y - 50, 64, 8);
        
        // Health bar
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.6 ? 0x00ff00 : healthPercent > 0.3 ? 0xffff00 : 0xff0000;
        this.healthBar.fillStyle(healthColor);
        this.healthBar.fillRect(this.x - 30, this.y - 48, 60 * healthPercent, 4);
        
        // Border
        this.healthBar.lineStyle(1, 0xffffff);
        this.healthBar.strokeRect(this.x - 32, this.y - 50, 64, 8);
    }

    updateEnergyBar(): void {
        this.energyBar.clear();
        
        // Background
        this.energyBar.fillStyle(0x000000);
        this.energyBar.fillRect(this.x - 32, this.y - 40, 64, 6);
        
        // Energy bar
        const energyPercent = this.energy / this.maxEnergy;
        this.energyBar.fillStyle(0x0080ff);
        this.energyBar.fillRect(this.x - 30, this.y - 38, 60 * energyPercent, 2);
        
        // Border
        this.energyBar.lineStyle(1, 0xffffff);
        this.energyBar.strokeRect(this.x - 32, this.y - 40, 64, 6);
    }

    performAttack(): void {
        // Now attack is gun shooting
        this.shootGun();
    }

    shootGun(): void {
        const currentTime = Date.now();
        
        if (currentTime - this.lastShootTime < this.shootCooldown || this.energy < 5) {
            return;
        }

        this.isShooting = true;
        this.energy -= 5;
        this.combo += 1;
        this.lastShootTime = currentTime;

        // Create gun shot effect
        this.createGunShotEffect();
        
        // Show combat text
        const comboMessages = [
            'Shot!', 'Double Shot!', 'Triple Shot!', 'Quad Shot!', 
            'LEGENDARY MARKSMAN!', 'ULTIMATE SNIPER!'
        ];
        const message = this.combo <= comboMessages.length ? 
            `${comboMessages[this.combo - 1]} x${this.combo}` : 
            `MASTER SHOOTER! x${this.combo}`;
        
        this.showCombatText(message, '#ffff00');

        // Fire bullet towards nearest enemy
        this.fireBullet();

        // Reset shooting state after animation
        this.scene.time.delayedCall(200, () => {
            this.isShooting = false;
        });

        // Reset combo after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (Date.now() - this.lastShootTime > 3000) {
                this.combo = 0;
            }
        });

        // Send shot to other players
        room.then((room: any) => room.send("PLAYER_SHOT", {
            x: this.x,
            y: this.y,
            combo: this.combo
        }));
    }

    fireBullet(): void {
        // Find nearest enemy in range
        const nearestEnemy = this.findNearestEnemy();
        
        if (!nearestEnemy) {
            // Fire in facing direction if no enemy found
            this.fireBulletInDirection();
            return;
        }

        // Calculate direction to enemy
        const angle = Phaser.Math.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
        
        // Create bullet
        const bullet = this.scene.add.graphics();
        bullet.fillStyle(0xffff00, 1);
        bullet.fillCircle(0, 0, 3);
        bullet.setPosition(this.x, this.y);
        bullet.setDepth(7);
        
        this.bullets.push(bullet);

        // Animate bullet towards target
        this.scene.tweens.add({
            targets: bullet,
            x: nearestEnemy.x,
            y: nearestEnemy.y,
            duration: 300,
            onComplete: () => {
                // Check if bullet hit the enemy
                const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, nearestEnemy.x, nearestEnemy.y);
                if (distance < 30 && nearestEnemy.isAlive) {
                    // Hit the enemy
                    const damage = 30 + (this.combo * 5);
                    nearestEnemy.takeDamage(damage);
                    this.createBulletHitEffect(bullet.x, bullet.y);
                }
                
                // Remove bullet
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.destroy();
            }
        });
    }

    fireBulletInDirection(): void {
        // Use the last facing direction for bullet direction
        let targetX = this.x;
        let targetY = this.y;

        switch (this.lastFacingDirection) {
            case 'left':
                targetX = this.x - this.shootRange;
                break;
            case 'right':
                targetX = this.x + this.shootRange;
                break;
            case 'up':
                targetY = this.y - this.shootRange;
                break;
            case 'down':
            default:
                targetY = this.y + this.shootRange;
                break;
        }

        // Create bullet
        const bullet = this.scene.add.graphics();
        bullet.fillStyle(0xffff00, 1);
        bullet.fillCircle(0, 0, 3);
        bullet.setPosition(this.x, this.y);
        bullet.setDepth(7);
        
        this.bullets.push(bullet);

        // Animate bullet
        this.scene.tweens.add({
            targets: bullet,
            x: targetX,
            y: targetY,
            duration: 400,
            onComplete: () => {
                this.bullets = this.bullets.filter(b => b !== bullet);
                bullet.destroy();
            }
        });
    }

    findNearestEnemy(): any {
        // This will be called by Scene2 to provide enemy list
        return null; // Default implementation
    }

    createGunShotEffect(): void {
        // Create muzzle flash effect
        const flash = this.scene.add.graphics();
        flash.setDepth(8);
        
        // Determine muzzle position based on facing direction
        const flashX = this.x + 15;
        const flashY = this.y;

        flash.fillStyle(0xffffff, 0.8);
        flash.fillCircle(flashX, flashY, 8);
        flash.fillStyle(0xffff00, 0.6);
        flash.fillCircle(flashX, flashY, 5);

        // Flash effect
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }

    createBulletHitEffect(x: number, y: number): void {
        const hitEffect = this.scene.add.graphics();
        hitEffect.setDepth(9);
        hitEffect.setPosition(x, y);
        
        // Create spark effect
        hitEffect.fillStyle(0xff4500, 0.8);
        hitEffect.fillCircle(0, 0, 12);
        hitEffect.fillStyle(0xffff00, 0.6);
        hitEffect.fillCircle(0, 0, 8);

        this.scene.tweens.add({
            targets: hitEffect,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            onComplete: () => hitEffect.destroy()
        });
    }

    createAttackEffect(): void {
        // Create slash effect
        const slashEffect = this.scene.add.graphics();
        slashEffect.setDepth(9);
        
        // Random slash direction
        const angle = Math.random() * Math.PI * 2;
        const length = 40;
        const startX = this.x + Math.cos(angle) * 10;
        const startY = this.y + Math.sin(angle) * 10;
        const endX = this.x + Math.cos(angle) * length;
        const endY = this.y + Math.sin(angle) * length;

        slashEffect.lineStyle(3, 0xffffff, 0.8);
        slashEffect.lineBetween(startX, startY, endX, endY);

        // Fade out effect
        this.scene.tweens.add({
            targets: slashEffect,
            alpha: 0,
            duration: 200,
            onComplete: () => slashEffect.destroy()
        });
    }

    showCombatText(text: string, color: string): void {
        this.combatText.setText(text);
        this.combatText.setColor(color);
        this.combatText.setPosition(this.x - this.combatText.width / 2, this.y - 60);
        this.combatText.setAlpha(1);

        // Animate text
        this.scene.tweens.add({
            targets: this.combatText,
            y: this.y - 80,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        });
    }

    takeDamage(damage: number, attacker?: any): void {
        if (this.isBlocking) {
            damage = Math.floor(damage * 0.3); // Reduce damage when blocking
            this.showCombatText('Blocked!', '#00ffff');
        }

        this.health -= damage;
        if (this.health < 0) this.health = 0;

        this.showCombatText(`-${damage}`, '#ff0000');
        this.createHitEffect();

        if (this.health <= 0) {
            this.handleDefeat();
        }
    }

    createHitEffect(): void {
        this.hitEffect.clear();
        this.hitEffect.fillStyle(0xff0000, 0.5);
        this.hitEffect.fillCircle(this.x, this.y, 30);

        this.scene.tweens.add({
            targets: this.hitEffect,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => this.hitEffect.clear()
        });
    }

    handleDefeat(): void {
        this.showCombatText('Defeated!', '#ff0000');
        this.alpha = 0.5;
        
        // Respawn after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            this.health = this.maxHealth;
            this.energy = this.maxEnergy;
            this.alpha = 1;
            this.showCombatText('Respawned!', '#00ff00');
        });
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

    setupMouseControls(): void {
        // Detect if desktop (has mouse and no touch)
        this.mouseControls.isDesktop = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
        
        if (!this.mouseControls.isDesktop) {
            return; // Only enable mouse controls on desktop
        }

        // Listen for mouse clicks on the game canvas
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Get world coordinates from pointer
            const camera = this.scene.cameras.main;
            const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
            
            this.mouseControls.targetX = worldPoint.x;
            this.mouseControls.targetY = worldPoint.y;
            this.mouseControls.isMoving = true;
        });

        // Stop movement when clicking on player
        this.setInteractive();
        this.on('pointerdown', () => {
            this.mouseControls.isMoving = false;
        });
    }

    update(time: number, delta: number): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        const prevVelocity = body.velocity.clone();

        // Update combat system
        this.updateCombatSystem();

        // Show player nickname above player
        this.showPlayerNickname();

        // Player door interaction
        this.doorInteraction();

        // Player world interaction
        this.worldInteraction();

        // Handle combat actions
        this.handleCombatInput();

        // Stop any previous movement from the last frame
        body.setVelocity(0);

        // Handle mouse movement for desktop users
        if (this.mouseControls.isDesktop && this.mouseControls.isMoving) {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y, 
                this.mouseControls.targetX, this.mouseControls.targetY
            );
            
            // Stop if close enough to target
            if (distance < 5) {
                this.mouseControls.isMoving = false;
            } else {
                // Move towards target
                const angle = Phaser.Math.Angle.Between(
                    this.x, this.y,
                    this.mouseControls.targetX, this.mouseControls.targetY
                );
                
                body.setVelocityX(Math.cos(angle) * this.speed);
                body.setVelocityY(Math.sin(angle) * this.speed);
            }
        } else if (!this.mouseControls.isDesktop || !this.mouseControls.isMoving) {
            // Check movement from both cursors and mobile controls (only if not using mouse)
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
        }

        // Update the animation based on movement (mouse or keyboard/mobile)
        const currentVelocity = body.velocity;
        const isMoving = Math.abs(currentVelocity.x) > 0 || Math.abs(currentVelocity.y) > 0;

        if (isMoving) {
            // Determine direction based on velocity (works for both mouse and keyboard movement)
            if (Math.abs(currentVelocity.x) > Math.abs(currentVelocity.y)) {
                // Horizontal movement takes precedence
                if (currentVelocity.x < 0) {
                    this.anims.play("misa-left-walk", true);
                    this.lastFacingDirection = 'left';
                } else {
                    this.anims.play("misa-right-walk", true);
                    this.lastFacingDirection = 'right';
                }
            } else {
                // Vertical movement
                if (currentVelocity.y < 0) {
                    this.anims.play("misa-back-walk", true);
                    this.lastFacingDirection = 'up';
                } else {
                    this.anims.play("misa-front-walk", true);
                    this.lastFacingDirection = 'down';
                }
            }
        } else {
            this.anims.stop();

            // If we were moving, pick an idle frame to use and update facing direction
            if (prevVelocity.x < 0) {
                this.setTexture("currentPlayer", "misa-left");
                this.lastFacingDirection = 'left';
            } else if (prevVelocity.x > 0) {
                this.setTexture("currentPlayer", "misa-right");
                this.lastFacingDirection = 'right';
            } else if (prevVelocity.y < 0) {
                this.setTexture("currentPlayer", "misa-back");
                this.lastFacingDirection = 'up';
            } else if (prevVelocity.y > 0) {
                this.setTexture("currentPlayer", "misa-front");
                this.lastFacingDirection = 'down';
            }
        }

        // Update mouse control state for next frame
        this.mouseControls.wasMoving = this.mouseControls.isMoving;
    }

    updateCombatSystem(): void {
        // Regenerate energy over time
        if (this.energy < this.maxEnergy) {
            this.energy += 0.2;
            if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
        }

        // Update UI bars
        this.updateHealthBar();
        this.updateEnergyBar();
    }

    handleCombatInput(): void {
        const isSpacePressed = this.spacebar.isDown || this.mobileControls.space;
        const isDebugPressed = this.debugKey.isDown || this.mobileControls.debug;

        // Attack when space is pressed
        if (isSpacePressed && !this.isAttacking) {
            this.performAttack();
        }

        // Special ability when debug key is pressed (repurposed as special attack)
        if (isDebugPressed && this.energy >= 30) {
            this.performSpecialAttack();
        }
    }

    performSpecialAttack(): void {
        if (this.energy < 30) return;

        this.energy -= 30;
        this.showCombatText('JUTSU TECHNIQUE!', '#ff8800');

        // Create a more powerful attack effect
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                this.createAttackEffect();
            });
        }

        // Send special attack to other players
        room.then((room: any) => room.send("PLAYER_SPECIAL_ATTACK", {
            x: this.x,
            y: this.y
        }));
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
                if (isSpacePressed) {
                    // Door interaction logic can be added here
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

                // Use smooth map transition instead of abrupt restart
                const scene2 = this.scene as any;
                if (scene2.smoothMapTransition) {
                    scene2.smoothMapTransition(world.name, this.playerTexturePosition);
                } else {
                    // Fallback to old method if smoothMapTransition is not available
                    this.scene.registry.destroy();
                    this.scene.scene.restart({
                        map: world.name, 
                        playerTexturePosition: this.playerTexturePosition
                    });
                }

                room.then((room: any) => room.send("PLAYER_CHANGED_MAP", {
                    map: world.name
                }));
            }
            return false;
        });
    }

    destroy(): void {
        // Clean up mobile control listeners safely
        if (this.scene && this.scene.events) {
            this.scene.events.off('mobileControl');
        }
        
        // Clean up combat UI elements
        if (this.healthBar) this.healthBar.destroy();
        if (this.energyBar) this.energyBar.destroy();
        if (this.combatText) this.combatText.destroy();
        if (this.hitEffect) this.hitEffect.destroy();
        
        if (this.playerNickname) {
            this.playerNickname.destroy();
        }
        
        super.destroy();
    }
}