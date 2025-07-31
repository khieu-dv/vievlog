import * as Phaser from "phaser";
import { questionDatabase, Question } from "./QuestionDatabase";

export default class EnemyBot extends Phaser.GameObjects.Sprite {
    public health: number = 50;
    public maxHealth: number = 50;
    public isAlive: boolean = true;
    public movementSpeed: number = 80;
    public attackRange: number = 100;
    public lastAttackTime: number = 0;
    public attackCooldown: number = 2000;
    public botName: string;
    public difficulty: 'easy' | 'medium' | 'hard';
    public reward: Question;
    
    private nameText!: Phaser.GameObjects.Text;
    private healthBar!: Phaser.GameObjects.Graphics;
    private hitEffect!: Phaser.GameObjects.Graphics;
    private targetPlayer: any;
    private movementPattern: 'patrol' | 'chase' | 'idle' = 'patrol';
    private patrolPoints: { x: number; y: number }[] = [];
    private currentPatrolIndex: number = 0;
    private patrolDirection: number = 1;

    // English learning themed bot names
    private static botNames = [
        'Grammar Guardian', 'Vocab Villain', 'Spelling Specter', 'Syntax Soldier',
        'Tense Terror', 'Article Archer', 'Pronoun Pirate', 'Adjective Assassin',
        'Verb Viper', 'Noun Ninja', 'Preposition Phantom', 'Conjunction Crusher'
    ];

    constructor(config: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        key: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        worldLayer?: Phaser.Tilemaps.TilemapLayer;
    }) {
        super(config.scene, config.x, config.y, config.key || 'players');

        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);

        // Set difficulty
        this.difficulty = config.difficulty || 'easy';
        
        // Adjust stats based on difficulty
        this.adjustStatsForDifficulty();

        // Set random bot name
        this.botName = EnemyBot.botNames[Math.floor(Math.random() * EnemyBot.botNames.length)];
        
        // Get a question for this bot
        this.reward = questionDatabase.getRandomQuestion(this.difficulty);

        // Set physics properties
        if (this.body && 'setOffset' in this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setOffset(0, 24);
            body.setCollideWorldBounds(true);
        }

        // Add collision with world layer
        if (config.worldLayer) {
            this.scene.physics.add.collider(this, config.worldLayer);
        }

        this.setDepth(5);
        this.setTint(this.getDifficultyColor());

        // Initialize UI elements
        this.initializeUI();
        this.setupPatrolPoints();
        this.setupAnimations();
    }

    private adjustStatsForDifficulty(): void {
        switch (this.difficulty) {
            case 'easy':
                this.health = 30;
                this.maxHealth = 30;
                this.movementSpeed = 60;
                this.attackCooldown = 3000;
                break;
            case 'medium':
                this.health = 50;
                this.maxHealth = 50;
                this.movementSpeed = 80;
                this.attackCooldown = 2000;
                break;
            case 'hard':
                this.health = 80;
                this.maxHealth = 80;
                this.movementSpeed = 100;
                this.attackCooldown = 1500;
                break;
        }
    }

    private getDifficultyColor(): number {
        switch (this.difficulty) {
            case 'easy': return 0x90EE90; // Light green
            case 'medium': return 0xFFA500; // Orange
            case 'hard': return 0xFF4500; // Red-orange
            default: return 0xFFFFFF;
        }
    }

    private initializeUI(): void {
        // Bot name
        this.nameText = this.scene.add.text(this.x, this.y - 70, this.botName, {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.nameText.setOrigin(0.5);
        this.nameText.setDepth(10);

        // Health bar
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // Hit effect
        this.hitEffect = this.scene.add.graphics();
        this.hitEffect.setDepth(8);
    }

    private setupPatrolPoints(): void {
        // Create patrol points around the spawn location
        const patrolRadius = 150;
        const numPoints = 4;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            this.patrolPoints.push({
                x: this.x + Math.cos(angle) * patrolRadius,
                y: this.y + Math.sin(angle) * patrolRadius
            });
        }
    }

    private setupAnimations(): void {
        // Use existing player animations for bots
        this.anims.play("onlinePlayer-front-walk", true);
    }

    updateHealthBar(): void {
        this.healthBar.clear();
        
        // Background
        this.healthBar.fillStyle(0x000000);
        this.healthBar.fillRect(this.x - 25, this.y - 60, 50, 6);
        
        // Health bar
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.6 ? 0x00ff00 : healthPercent > 0.3 ? 0xffff00 : 0xff0000;
        this.healthBar.fillStyle(healthColor);
        this.healthBar.fillRect(this.x - 23, this.y - 58, 46 * healthPercent, 2);
        
        // Border
        this.healthBar.lineStyle(1, 0xffffff);
        this.healthBar.strokeRect(this.x - 25, this.y - 60, 50, 6);
    }

    update(time: number, delta: number, player?: any): void {
        if (!this.isAlive) return;

        // Update UI positions
        this.nameText.setPosition(this.x, this.y - 70);
        this.updateHealthBar();

        // AI Behavior
        this.updateAI(player);
    }

    private updateAI(player?: any): void {
        if (!player) {
            this.patrol();
            return;
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distanceToPlayer <= this.attackRange) {
            this.movementPattern = 'chase';
            this.chasePlayer(player);
            this.tryAttackPlayer(player);
        } else if (distanceToPlayer <= 200) {
            this.movementPattern = 'chase';
            this.chasePlayer(player);
        } else {
            this.movementPattern = 'patrol';
            this.patrol();
        }
    }

    private patrol(): void {
        if (this.patrolPoints.length === 0) return;

        const targetPoint = this.patrolPoints[this.currentPatrolIndex];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPoint.x, targetPoint.y);

        if (distance < 20) {
            // Reached patrol point, move to next
            this.currentPatrolIndex += this.patrolDirection;
            
            if (this.currentPatrolIndex >= this.patrolPoints.length) {
                this.currentPatrolIndex = this.patrolPoints.length - 2;
                this.patrolDirection = -1;
            } else if (this.currentPatrolIndex < 0) {
                this.currentPatrolIndex = 1;
                this.patrolDirection = 1;
            }
        } else {
            // Move towards patrol point
            this.moveTowards(targetPoint.x, targetPoint.y);
        }
    }

    private chasePlayer(player: any): void {
        this.moveTowards(player.x, player.y);
    }

    private moveTowards(targetX: number, targetY: number): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const velocityX = Math.cos(angle) * this.movementSpeed;
        const velocityY = Math.sin(angle) * this.movementSpeed;

        body.setVelocity(velocityX, velocityY);

        // Update animation based on movement
        if (Math.abs(velocityX) > Math.abs(velocityY)) {
            if (velocityX > 0) {
                this.anims.play("onlinePlayer-right-walk", true);
            } else {
                this.anims.play("onlinePlayer-left-walk", true);
            }
        } else {
            if (velocityY > 0) {
                this.anims.play("onlinePlayer-front-walk", true);
            } else {
                this.anims.play("onlinePlayer-back-walk", true);
            }
        }
    }

    private tryAttackPlayer(player: any): void {
        const currentTime = Date.now();
        
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
            this.attackPlayer(player);
            this.lastAttackTime = currentTime;
        }
    }

    private attackPlayer(player: any): void {
        // Deal damage to player
        if (player.takeDamage) {
            const damage = this.difficulty === 'easy' ? 10 : this.difficulty === 'medium' ? 15 : 20;
            player.takeDamage(damage, this);
        }

        // Create attack effect
        this.createAttackEffect();
    }

    private createAttackEffect(): void {
        const attackEffect = this.scene.add.graphics();
        attackEffect.setDepth(9);
        
        attackEffect.lineStyle(2, 0xff0000, 0.8);
        attackEffect.strokeCircle(this.x, this.y, 30);

        this.scene.tweens.add({
            targets: attackEffect,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => attackEffect.destroy()
        });
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }

        // Create hit effect
        this.createHitEffect();
        
        // Flash red briefly
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.setTint(this.getDifficultyColor());
        });
    }

    private createHitEffect(): void {
        this.hitEffect.clear();
        this.hitEffect.fillStyle(0xff0000, 0.3);
        this.hitEffect.fillCircle(this.x, this.y, 25);

        this.scene.tweens.add({
            targets: this.hitEffect,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => this.hitEffect.clear()
        });
    }

    die(): void {
        console.log('Bot dying:', this.botName, 'at position:', this.x, this.y);
        this.isAlive = false;
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
        
        console.log('Emitting botDefeated event with reward:', this.reward);
        // Trigger question event
        this.scene.events.emit('botDefeated', this);
        
        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            onComplete: () => {
                console.log('Bot death animation complete, destroying:', this.botName);
                this.destroy();
            }
        });
    }

    destroy(): void {
        if (this.nameText) this.nameText.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.hitEffect) this.hitEffect.destroy();
        super.destroy();
    }
}