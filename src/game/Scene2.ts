import * as Phaser from "phaser";
import { onlinePlayers, room } from '../lib/SocketServer';
import OnlinePlayer from "./OnlinePlayer";
import Player from "./Player";
import { GameMessage, SceneData } from "../lib/game";
import EnemyBot from "./EnemyBot";
import { QuestionUI } from "./QuestionUI";
import { ScoreSystem } from "./ScoreSystem";
import { questionDatabase } from "./QuestionDatabase";

export class Scene2 extends Phaser.Scene {
    public mapName!: string;
    public playerTexturePosition!: string;
    public container: any[] = [];
    public map!: Phaser.Tilemaps.Tilemap;
    public player!: Player;
    public belowLayer!: Phaser.Tilemaps.TilemapLayer;
    public worldLayer!: Phaser.Tilemaps.TilemapLayer;
    public grassLayer!: Phaser.Tilemaps.TilemapLayer;
    public aboveLayer!: Phaser.Tilemaps.TilemapLayer;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private socketKey: boolean = false;
    
    // English Learning Game Systems
    private enemyBots: EnemyBot[] = [];
    private questionUI!: QuestionUI;
    private scoreSystem!: ScoreSystem;
    private maxBots: number = 5;
    private botSpawnTimer!: Phaser.Time.TimerEvent;

    constructor() {
        super("playGame");
    }

    init(data: SceneData): void {
        // Map data
        this.mapName = data.map;

        // Player Texture starter position
        this.playerTexturePosition = data.playerTexturePosition;

        // Set container
        this.container = [];
    }

    create(): void {
        interface PlayerData {
            sessionId: string;
            map: string;
            x: number;
            y: number;
        }

        interface PlayersMap {
            [playerId: string]: PlayerData;
        }

        interface CurrentPlayersMessage extends GameMessage {
            event: 'CURRENT_PLAYERS';
            players?: PlayersMap;
        }

        interface PlayerJoinedMessage extends GameMessage {
            event: 'PLAYER_JOINED';
            sessionId?: string;
            map?: string;
            x?: number;
            y?: number;
        }

        interface PlayerLeftMessage extends GameMessage {
            event: 'PLAYER_LEFT';
            sessionId?: string;
        }

        interface PlayerMovedMessage extends GameMessage {
            event: 'PLAYER_MOVED';
            sessionId?: string;
            position?: string;
            map?: string;
            x?: number;
            y?: number;
        }

        interface PlayerMovementEndedMessage extends GameMessage {
            event: 'PLAYER_MOVEMENT_ENDED';
            sessionId?: string;
            position?: string;
            map?: string;
            x?: number;
            y?: number;
        }

        interface PlayerChangedMapMessage extends GameMessage {
            event: 'PLAYER_CHANGED_MAP';
            sessionId?: string;
            map?: string;
            x?: number;
            y?: number;
        }

        type RoomType = {
            sessionId: string;
            onMessage: (callback: (data: GameMessage) => void) => void;
            send: (type: string, payload: any) => void;
        };

        room.then((room: any) => {
            room.onMessage((data: GameMessage) => {
                console.log('Received message:', data.event, data);

                if (data.event === 'CURRENT_PLAYERS') {
                    const currentPlayersData = data as CurrentPlayersMessage;
                    console.log('CURRENT_PLAYERS - Processing existing players');
            
                    if (currentPlayersData.players) {
                        Object.keys(currentPlayersData.players).forEach((playerId: string) => {
                            const player = currentPlayersData.players![playerId];
                            
                            console.log(`Processing player ${playerId}, map: ${player.map}, current map: ${this.mapName}`);
            
                            // Only create online players for other players (not self) and in same map
                            if (playerId !== room.sessionId && player.map === this.mapName) {
                                // Destroy existing player if exists
                                if (onlinePlayers[player.sessionId]) {
                                    onlinePlayers[player.sessionId].destroy();
                                }
                                
                                onlinePlayers[player.sessionId] = new OnlinePlayer({
                                    scene: this,
                                    playerId: player.sessionId,
                                    key: player.sessionId,
                                    map: this.map,
                                    x: player.x,
                                    y: player.y,
                                    worldLayer: this.worldLayer
                                });
                                
                                console.log(`Created online player: ${player.sessionId} at (${player.x}, ${player.y})`);
                            }
                        });
                    }
                }
                
                if (data.event === 'PLAYER_JOINED') {
                    const joinedData = data as PlayerJoinedMessage;
                    console.log('PLAYER_JOINED:', joinedData);
            
                    if (joinedData.sessionId && joinedData.sessionId !== room.sessionId) {
                        // Only create if player is in same map
                        if (joinedData.map === this.mapName) {
                            // Destroy existing player if exists
                            if (onlinePlayers[joinedData.sessionId]) {
                                onlinePlayers[joinedData.sessionId].destroy();
                            }

                            onlinePlayers[joinedData.sessionId] = new OnlinePlayer({
                                scene: this,
                                playerId: joinedData.sessionId,
                                key: joinedData.sessionId,
                                map: this.map,
                                x: joinedData.x || 0,
                                y: joinedData.y || 0,
                                worldLayer: this.worldLayer
                            });
                            
                            console.log(`Player joined and created: ${joinedData.sessionId}`);
                        }
                    }
                }
                
                if (data.event === 'PLAYER_LEFT') {
                    const leftData = data as PlayerLeftMessage;
                    console.log('PLAYER_LEFT:', leftData);
            
                    if (leftData.sessionId && onlinePlayers[leftData.sessionId]) {
                        onlinePlayers[leftData.sessionId].destroy();
                        delete onlinePlayers[leftData.sessionId];
                        console.log(`Player left and removed: ${leftData.sessionId}`);
                    }
                }
                
                if (data.event === 'PLAYER_MOVED') {
                    const movedData = data as PlayerMovedMessage;
                    if (movedData.sessionId && movedData.sessionId !== room.sessionId) {
                        // Only process if player exists and is in same map
                        if (onlinePlayers[movedData.sessionId] && movedData.map === this.mapName) {
                            // Update the player's map reference
                            onlinePlayers[movedData.sessionId].map = movedData.map || 'town';
                            
                            // Start animation and set sprite position
                            onlinePlayers[movedData.sessionId].isWalking(
                                movedData.position || 'front', 
                                movedData.x || 0, 
                                movedData.y || 0
                            );
                        }
                    }
                }
                
                if (data.event === 'PLAYER_MOVEMENT_ENDED') {
                    const endedData = data as PlayerMovementEndedMessage;
                    if (endedData.sessionId && endedData.sessionId !== room.sessionId) {
                        // Only process if player exists and is in same map
                        if (onlinePlayers[endedData.sessionId] && endedData.map === this.mapName) {
                            // Stop animation & set sprite texture
                            onlinePlayers[endedData.sessionId].stopWalking(endedData.position || 'front');
                        }
                    }
                }
                
                if (data.event === 'PLAYER_CHANGED_MAP') {
                    const changedMapData = data as PlayerChangedMapMessage;
                    console.log('PLAYER_CHANGED_MAP:', changedMapData);
            
                    if (changedMapData.sessionId && changedMapData.sessionId !== room.sessionId) {
                        // Remove player from current scene
                        if (onlinePlayers[changedMapData.sessionId]) {
                            onlinePlayers[changedMapData.sessionId].destroy();
                            delete onlinePlayers[changedMapData.sessionId];
                        }
            
                        // Add player to new scene if they moved to current map
                        if (changedMapData.map === this.mapName) {
                            onlinePlayers[changedMapData.sessionId] = new OnlinePlayer({
                                scene: this,
                                playerId: changedMapData.sessionId,
                                key: changedMapData.sessionId,
                                map: this.map,
                                x: changedMapData.x || 0,
                                y: changedMapData.y || 0,
                                worldLayer: this.worldLayer
                            });
                            
                            console.log(`Player changed to current map: ${changedMapData.sessionId}`);
                        }
                    }
                }
            });
        });

        this.map = this.make.tilemap({ key: this.mapName });

        console.log("this.mapName", this.mapName);
        console.log("this.map", this.map);

        // Set current map Bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = this.map.addTilesetImage("tuxmon-sample-32px-extruded", "TilesTown");

        if (!tileset) {
            console.error("Failed to load tileset");
            return;
        }

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.belowLayer = this.map.createLayer("Below Player", tileset, 0, 0)!;
        this.worldLayer = this.map.createLayer("World", tileset, 0, 0)!;
        this.grassLayer = this.map.createLayer("Grass", tileset, 0, 0)!;
        this.aboveLayer = this.map.createLayer("Above Player", tileset, 0, 0)!;

        this.worldLayer.setCollisionByProperty({ collides: true });

        // By default, everything gets depth sorted on the screen in the order we created things
        this.aboveLayer.setDepth(10);

        // Get spawn point from tiled map
        const spawnPoint = this.map.findObject("SpawnPoints", obj => obj.name === "Spawn Point");

        if (!spawnPoint) {
            console.error("Spawn point not found");
            return;
        }

        // Set player
        this.player = new Player({
            scene: this,
            worldLayer: this.worldLayer,
            key: 'player',
            x: spawnPoint.x || 0,
            y: spawnPoint.y || 0,
            map: this.map,
            mapName: this.mapName
        });

        // Override player's findNearestEnemy method
        this.player.findNearestEnemy = () => {
            return this.findNearestEnemyForPlayer();
        };

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.debugGraphics();
        this.movementTimer();
        
        // Initialize English Learning Systems
        this.initializeLearningSystems();
    }

    update(time: number, delta: number): void {
        // Loop the player update method
        this.player.update(time, delta);

        // Check for mobile controls as well
        const isLeftPressed = this.cursors.left.isDown || this.player.mobileControls?.left;
        const isRightPressed = this.cursors.right.isDown || this.player.mobileControls?.right;
        const isUpPressed = this.cursors.up.isDown || this.player.mobileControls?.up;
        const isDownPressed = this.cursors.down.isDown || this.player.mobileControls?.down;

        // Horizontal movement
        if (isLeftPressed) {
            if (this.socketKey) {
                if (this.player.isMoved()) {
                    room.then((room: any) => room.send("PLAYER_MOVED", {
                        position: 'left',
                        x: this.player.x,
                        y: this.player.y
                    }));
                }
                this.socketKey = false;
            }
        } else if (isRightPressed) {
            if (this.socketKey) {
                if (this.player.isMoved()) {
                    room.then((room: any) => room.send("PLAYER_MOVED", {
                        position: 'right',
                        x: this.player.x,
                        y: this.player.y
                    }));
                }
                this.socketKey = false;
            }
        }

        // Vertical movement
        if (isUpPressed) {
            if (this.socketKey) {
                if (this.player.isMoved()) {
                    room.then((room: any) => room.send("PLAYER_MOVED", {
                        position: 'back',
                        x: this.player.x,
                        y: this.player.y
                    }));
                }
                this.socketKey = false;
            }
        } else if (isDownPressed) {
            if (this.socketKey) {
                if (this.player.isMoved()) {
                    room.then((room: any) => room.send("PLAYER_MOVED", {
                        position: 'front',
                        x: this.player.x,
                        y: this.player.y
                    }));
                }
                this.socketKey = false;
            }
        }

        // Movement ended events - check both keyboard and mobile controls
        if (Phaser.Input.Keyboard.JustUp(this.cursors.left) === true || 
            (this.player.mobileControls?.left === false && this.player.wasMobileControlPressed?.left)) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'left' }));
        } else if (Phaser.Input.Keyboard.JustUp(this.cursors.right) === true ||
                  (this.player.mobileControls?.right === false && this.player.wasMobileControlPressed?.right)) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'right' }));
        }

        if (Phaser.Input.Keyboard.JustUp(this.cursors.up) === true ||
            (this.player.mobileControls?.up === false && this.player.wasMobileControlPressed?.up)) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'back' }));
        } else if (Phaser.Input.Keyboard.JustUp(this.cursors.down) === true ||
                  (this.player.mobileControls?.down === false && this.player.wasMobileControlPressed?.down)) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'front' }));
        }

        // Update mobile control states for next frame
        if (this.player.mobileControls && this.player.wasMobileControlPressed) {
            this.player.wasMobileControlPressed.left = this.player.mobileControls.left;
            this.player.wasMobileControlPressed.right = this.player.mobileControls.right;
            this.player.wasMobileControlPressed.up = this.player.mobileControls.up;
            this.player.wasMobileControlPressed.down = this.player.mobileControls.down;
        }
        
        // Update English Learning Game
        this.updateLearningGame(time, delta);
    }

    movementTimer(): void {
        setInterval(() => {
            this.socketKey = true;
        }, 50);
    }

    initializeLearningSystems(): void {
        console.log('Initializing learning systems...');
        
        // Initialize Question UI
        this.questionUI = new QuestionUI(this);
        console.log('QuestionUI initialized:', !!this.questionUI);
        
        // Initialize Score System
        this.scoreSystem = new ScoreSystem(this);
        console.log('ScoreSystem initialized:', !!this.scoreSystem);
        
        // Set up event listeners
        this.events.on('botDefeated', this.handleBotDefeated, this);
        console.log('Event listener for botDefeated set up');
        
        // Spawn initial bots
        this.spawnEnemyBots();
        console.log('Initial bots spawned, total bots:', this.enemyBots.length);
        
        // Set up bot spawning timer
        this.botSpawnTimer = this.time.addEvent({
            delay: 10000, // Spawn new bot every 10 seconds
            callback: this.spawnEnemyBot,
            callbackScope: this,
            loop: true
        });
        
        console.log('Learning systems initialization complete');
    }

    spawnEnemyBots(): void {
        // Spawn initial bots around the map
        for (let i = 0; i < 3; i++) {
            this.spawnEnemyBot();
        }
    }

    spawnEnemyBot(): void {
        if (this.enemyBots.filter(bot => bot.isAlive).length >= this.maxBots) {
            console.log('Max bots reached, not spawning');
            return; // Don't spawn if we have max bots
        }

        // Get random spawn position
        const spawnX = Phaser.Math.Between(100, this.map.widthInPixels - 100);
        const spawnY = Phaser.Math.Between(100, this.map.heightInPixels - 100);
        
        // Determine difficulty based on player's score
        const difficulty = questionDatabase.getDifficultyBasedOnScore(this.scoreSystem.getStats().totalScore);
        
        console.log(`Spawning bot at (${spawnX}, ${spawnY}) with difficulty: ${difficulty}`);
        
        // Create bot
        const bot = new EnemyBot({
            scene: this,
            x: spawnX,
            y: spawnY,
            key: 'players',
            difficulty: difficulty,
            worldLayer: this.worldLayer
        });

        this.enemyBots.push(bot);
        console.log(`Bot spawned: ${bot.botName}, total bots: ${this.enemyBots.length}`);
        console.log('New bot reward question:', bot.reward);
        
        // Set up collision detection for this specific bot
        this.physics.add.overlap(this.player, bot, (player: any, botCollider: any) => {
            // Handle collision if needed
        }, undefined, this);
    }

    handlePlayerBotCollision(player: any, bot: any): void {
        // This is handled by the bot's own collision detection
        // The actual combat happens through the attack system
    }

    handleBotDefeated(bot: EnemyBot): void {
        console.log('handleBotDefeated called with bot:', bot.botName);
        console.log('Bot reward question:', bot.reward);
        console.log('Current enemy bots count:', this.enemyBots.length);
        
        // Remove bot from array
        this.enemyBots = this.enemyBots.filter(b => b !== bot);
        console.log('Enemy bots count after removal:', this.enemyBots.length);
        
        // Add bot defeat bonus
        this.scoreSystem.addBotDefeatBonus();
        console.log('Added bot defeat bonus');
        
        // Show question UI
        console.log('Attempting to show question UI...');
        if (this.questionUI) {
            console.log('QuestionUI exists, showing question');
            this.questionUI.showQuestion(bot.reward, (correct: boolean, question: any) => {
                console.log('Question answered:', correct, 'Question:', question);
                // Add score based on answer
                this.scoreSystem.addScore(question.points, question, correct);
                
                // Spawn new bot after a delay
                this.time.delayedCall(2000, () => {
                    this.spawnEnemyBot();
                });
            });
        } else {
            console.error('QuestionUI is not initialized!');
        }
    }

    updateLearningGame(time: number, delta: number): void {
        // Update enemy bots
        this.enemyBots.forEach(bot => {
            if (bot.isAlive) {
                bot.update(time, delta, this.player);
            }
        });
        
        // Gun system handles damage automatically through bullets
    }

    findNearestEnemyForPlayer(): any {
        let nearestEnemy = null;
        let nearestDistance = this.player.shootRange;

        this.enemyBots.forEach(bot => {
            if (!bot.isAlive) return;
            
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                bot.x, bot.y
            );
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = bot;
            }
        });

        return nearestEnemy;
    }

    checkPlayerAttacksOnBots(): void {
        // This is now handled by the gun system automatically
        // No need for manual collision checking
    }

    debugGraphics(): void {
        // Debug graphics
        this.input.keyboard!.once("keydown-D", (event: KeyboardEvent) => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            // Create worldLayer collision graphic above the player, but below the help text
            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
            this.worldLayer.renderDebug(graphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        });
    }
}