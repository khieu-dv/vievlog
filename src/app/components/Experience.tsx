import { CameraControls, Stars, Stats } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React, { useEffect, useRef, useState } from "react";
import { Emitter } from "./Emitter";

// Import type for CameraControls from drei
import { CameraControls as CameraControlsImpl } from "@react-three/drei";

export const Experience: React.FC = () => {
  const controls = useRef<CameraControlsImpl | null>(null);


  const [currentHash, setCurrentHash] = useState<string>(
    window.location.hash.replace("#", "")
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <Stats />
      <CameraControls ref={controls} />
      <directionalLight
        position={[1, 0.5, -10]}
        intensity={2}
        color="#ffe7ba"
      />
      <Stars fade speed={3} count={2000} />
      {currentHash === "" && <Emitter />}

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};
