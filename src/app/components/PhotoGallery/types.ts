
// src/components/PhotoGallery/
import { Vector3 } from "three";
import { Texture } from "three";

export interface ImageTransitionState {
  startTime: number;
  duration: number;
  effectIndex: number;
  state: 'appearing' | 'visible' | 'disappearing';
  opacity?: number;
  scale?: number;
  rotation?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  spinAngle?: number;
  direction?: Vector3;
  spinAxis?: Vector3;
  spinSpeed?: number;
}

export interface TransitionMap {
  [key: number]: ImageTransitionState;
}

export interface AspectRatioMap {
  [key: number]: number;
}

export interface Effect {
  (progress: number): {
    opacity: number;
    scale: number;
    rotation: number;
    translateY: number;
  };
}

export interface DisappearEffect {
  (progress: number, direction: Vector3): {
    opacity: number;
    scale: number;
    rotation: number;
    translateX: number;
    translateY: number;
    translateZ: number;
  };
}