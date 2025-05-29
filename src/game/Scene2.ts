import * as Phaser from "phaser";
import { onlinePlayers, room } from '../lib/SocketServer';
import OnlinePlayer from "./OnlinePlayer";
import Player from "./Player";
import { GameMessage, SceneData } from "../lib/game";

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
                if (data.event === 'CURRENT_PLAYERS') {
                    const currentPlayersData = data as CurrentPlayersMessage;
                    console.log('CURRENT_PLAYERS');
            
                    if (currentPlayersData.players) {
                        Object.keys(currentPlayersData.players).forEach((playerId: string) => {
                            const player = currentPlayersData.players![playerId];
            
                            if (playerId !== room.sessionId) {
                                onlinePlayers[player.sessionId] = new OnlinePlayer({
                                    scene: this,
                                    playerId: player.sessionId,
                                    key: player.sessionId,
                                    map: player.map,
                                    x: player.x,
                                    y: player.y,
                                    worldLayer: this.worldLayer
                                });
                            }
                        });
                    }
                }
                
                if (data.event === 'PLAYER_JOINED') {
                    const joinedData = data as PlayerJoinedMessage;
                    console.log('PLAYER_JOINED');
            
                    if (joinedData.sessionId && !onlinePlayers[joinedData.sessionId]) {
                        onlinePlayers[joinedData.sessionId] = new OnlinePlayer({
                            scene: this,
                            playerId: joinedData.sessionId,
                            key: joinedData.sessionId,
                            map: joinedData.map || 'town',
                            x: joinedData.x || 0,
                            y: joinedData.y || 0,
                            worldLayer: this.worldLayer
                        });
                    }
                }
                
                if (data.event === 'PLAYER_LEFT') {
                    const leftData = data as PlayerLeftMessage;
                    console.log('PLAYER_LEFT');
            
                    if (leftData.sessionId && onlinePlayers[leftData.sessionId]) {
                        onlinePlayers[leftData.sessionId].destroy();
                        delete onlinePlayers[leftData.sessionId];
                    }
                }
                
                if (data.event === 'PLAYER_MOVED') {
                    const movedData = data as PlayerMovedMessage;
                    if (movedData.sessionId && onlinePlayers[movedData.sessionId]) {
                        // If player is in same map
                        if (this.mapName === onlinePlayers[movedData.sessionId].map) {
                            // If player isn't registered in this scene (map changing bug..)
                            if (!onlinePlayers[movedData.sessionId].scene) {
                                onlinePlayers[movedData.sessionId] = new OnlinePlayer({
                                    scene: this,
                                    playerId: movedData.sessionId,
                                    key: movedData.sessionId,
                                    map: movedData.map || 'town',
                                    x: movedData.x || 0,
                                    y: movedData.y || 0,
                                    worldLayer: this.worldLayer
                                });
                            }
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
                    if (endedData.sessionId && onlinePlayers[endedData.sessionId]) {
                        // If player is in same map
                        if (this.mapName === onlinePlayers[endedData.sessionId].map) {
                            // If player isn't registered in this scene (map changing bug..)
                            if (!onlinePlayers[endedData.sessionId].scene) {
                                onlinePlayers[endedData.sessionId] = new OnlinePlayer({
                                    scene: this,
                                    playerId: endedData.sessionId,
                                    key: endedData.sessionId,
                                    map: endedData.map || 'town',
                                    x: endedData.x || 0,
                                    y: endedData.y || 0,
                                    worldLayer: this.worldLayer
                                });
                            }
                            // Stop animation & set sprite texture
                            onlinePlayers[endedData.sessionId].stopWalking(endedData.position || 'front');
                        }
                    }
                }
                
                if (data.event === 'PLAYER_CHANGED_MAP') {
                    const changedMapData = data as PlayerChangedMapMessage;
                    console.log('PLAYER_CHANGED_MAP');
            
                    if (changedMapData.sessionId && onlinePlayers[changedMapData.sessionId]) {
                        onlinePlayers[changedMapData.sessionId].destroy();
            
                        if (changedMapData.map === this.mapName && !onlinePlayers[changedMapData.sessionId].scene) {
                            onlinePlayers[changedMapData.sessionId] = new OnlinePlayer({
                                scene: this,
                                playerId: changedMapData.sessionId,
                                key: changedMapData.sessionId,
                                map: changedMapData.map,
                                x: changedMapData.x || 0,
                                y: changedMapData.y || 0,
                                worldLayer: this.worldLayer
                            });
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
            //map: this.map
        });

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cursors = this.input.keyboard!.createCursorKeys();

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "Arrow keys to move\nPress \"D\" to show hitboxes", {
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0)
            .setDepth(30);

        this.debugGraphics();
        this.movementTimer();
    }

    update(time: number, delta: number): void {
        // Loop the player update method
        this.player.update(time, delta);

        // Horizontal movement
        if (this.cursors.left.isDown) {
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
        } else if (this.cursors.right.isDown) {
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
        if (this.cursors.up.isDown) {
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
        } else if (this.cursors.down.isDown) {
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

        // Movement ended events
        if (Phaser.Input.Keyboard.JustUp(this.cursors.left) === true) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'left' }));
        } else if (Phaser.Input.Keyboard.JustUp(this.cursors.right) === true) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'right' }));
        }

        if (Phaser.Input.Keyboard.JustUp(this.cursors.up) === true) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'back' }));
        } else if (Phaser.Input.Keyboard.JustUp(this.cursors.down) === true) {
            room.then((room: any) => room.send("PLAYER_MOVEMENT_ENDED", { position: 'front' }));
        }
    }

    movementTimer(): void {
        setInterval(() => {
            this.socketKey = true;
        }, 50);
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