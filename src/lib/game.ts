import * as Phaser from 'phaser';

export interface GameConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key?: string;
  playerId?: string;
  worldLayer?: Phaser.Tilemaps.TilemapLayer;
  map?: string;
}

export interface PlayerData {
  sessionId: string;
  x: number;
  y: number;
  map: string;
}

export interface GameMessage {
  event: string;
  sessionId?: string;
  x?: number;
  y?: number;
  position?: string;
  map?: string;
  players?: Record<string, PlayerData>;
}

export interface SceneData {
  map: string;
  playerTexturePosition: string;
}