import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import { Object3D } from "three";
import VFXEmitter from "./vfxs/VFXEmitter";
import VFXParticles from "./vfxs/VFXParticles";
import { Emitter } from "./Emitter1";

export const Experience = () => {
  const emitterBlue = useRef<Object3D>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (emitterBlue.current) {
      emitterBlue.current.position.x = Math.cos(time * 6) * 1.5;
      emitterBlue.current.position.y = Math.sin(time * 3) * 1.5;
      emitterBlue.current.position.z = Math.cos(time * 4) * 1.5;
    }
  });

  return (
    <>
      <Stats />
      <OrbitControls enablePan={false} />
      <Environment preset="sunset" />
      <Emitter />
    </>
  );
};