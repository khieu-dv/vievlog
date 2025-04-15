
// src/components/PhotoGallery/components/Emitter.tsx
import { useRef, useState } from "react";
import { Camera, useFrame, useThree } from "@react-three/fiber";
import { Text, Html, OrbitControls } from "@react-three/drei";
import { VFXEmitter, VFXParticles } from "wawa-vfx";
import * as THREE from "three";
import { Vector3 } from "three";
import { IMAGE_POSITIONS, CONFIG } from "../constants";
import { TransitionMap, ImageTransitionState } from "../types";
import { useTextures } from "../hooks/useTextures";
import { useAudio } from "../hooks/useAudio";
import { Image } from "./Image";
import { appearEffects, disappearEffects } from "../utils/animations";
import { useEffect } from "react"; // Added useEffect to the import


export const Emitter = () => {
    const emitter = useRef<THREE.Group>(null);
    const heartMesh = useRef<THREE.Mesh>(null);
    const [imageTransitions, setImageTransitions] = useState<TransitionMap>({});
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const { camera } = useThree();
    const [pathProgress, setPathProgress] = useState<number>(0);
    const [activeImage, setActiveImage] = useState<number | null>(null);
    const [visibleImages, setVisibleImages] = useState<number[]>([]);
    const [fadingImages, setFadingImages] = useState<{ [key: number]: boolean }>({});
    const { imageAspectRatios, textureRefs } = useTextures();
    const audioElementRef = useAudio();

    // Refs for animation
    const timeRef = useRef<number>(0);
    const switchTimeRef = useRef<number>(0);
    const autoAdvanceRef = useRef<boolean>(true);
    const emitterRefs = useRef<{ [key: string]: any }>({});
    const lastPositionRef = useRef<Vector3>(new Vector3());
    const tmpVector = new Vector3();

    // Initial camera setup
    useEffect(() => {
        camera.position.set(0, 0, 15);
        camera.zoom = 0.1;

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = 35;
        }
        camera.updateProjectionMatrix();
    }, [camera]);

    // Add new image with a random appear transition
    const addImageWithTransition = (imageIndex: number) => {
        setVisibleImages(prev => [...prev, imageIndex]);
        const randomEffectIndex = Math.floor(Math.random() * appearEffects.length);
        setImageTransitions(prev => ({
            ...prev,
            [imageIndex]: {
                startTime: timeRef.current,
                duration: CONFIG.APPEAR_TRANSITION_DURATION,
                effectIndex: randomEffectIndex,
                state: 'appearing',
            },
        }));
    };

    // Remove old image with a random disappear transition
    const removeImageWithTransition = (imageIndex: number) => {
        const randomDirection = new Vector3(
            Math.random() * 2 - 1,
            Math.random() * 1 + 0.5,
            Math.random() * 2 - 1
        ).normalize();
        const randomEffectIndex = Math.floor(Math.random() * disappearEffects.length);
        setImageTransitions(prev => ({
            ...prev,
            [imageIndex]: {
                startTime: timeRef.current,
                duration: CONFIG.DISAPPEAR_TRANSITION_DURATION,
                effectIndex: randomEffectIndex,
                state: 'disappearing',
                direction: randomDirection,
                spinAxis: new Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ).normalize(),
                spinSpeed: Math.random() * 1.5 + 0.5
            },
        }));
        setFadingImages(prev => ({ ...prev, [imageIndex]: true }));
        setVisibleImages(prev => prev.filter(idx => idx !== imageIndex));
        setTimeout(() => {
            setFadingImages(prev => {
                const newState = { ...prev };
                delete newState[imageIndex];
                return newState;
            });
            setImageTransitions(prev => {
                const newState = { ...prev };
                delete newState[imageIndex];
                return newState;
            });
        }, CONFIG.DISAPPEAR_TRANSITION_DURATION * 1000);
    };

    // Check distance from emitter to image positions and manage display
    const checkImageTriggers = (emitterPosition: Vector3) => {
        let closestImageIndex: number = -1;
        let closestDistance: number = Infinity;

        IMAGE_POSITIONS.forEach((position, index) => {
            const distance = emitterPosition.distanceTo(position);

            if (distance < CONFIG.TRIGGER_DISTANCE && distance < closestDistance) {
                closestDistance = distance;
                closestImageIndex = index;
            }
        });

        if (closestImageIndex !== -1) {
            setActiveImage(closestImageIndex);
            if (!visibleImages.includes(closestImageIndex) && !fadingImages[closestImageIndex]) {
                addImageWithTransition(closestImageIndex);
                if ([...visibleImages, closestImageIndex].length > CONFIG.MAX_VISIBLE_IMAGES) {
                    const oldestImage = visibleImages[0];
                    removeImageWithTransition(oldestImage);
                }
            }
        } else {
            setActiveImage(null);
        }
    };

    // Main animation frame
    useFrame(({ clock }, delta) => {
        const totalTime = clock.getElapsedTime();
        timeRef.current = totalTime;

        if (emitter.current) {
            // Auto advance to next position
            if (autoAdvanceRef.current) {
                if (totalTime - switchTimeRef.current > CONFIG.AUTO_ADVANCE_TIME) {
                    const nextPosition = (currentPosition + 1) % IMAGE_POSITIONS.length;
                    setCurrentPosition(nextPosition);
                    switchTimeRef.current = totalTime;
                }
            }

            // Movement path logic
            const currentPos = IMAGE_POSITIONS[currentPosition];
            const nextPos = IMAGE_POSITIONS[(currentPosition + 1) % IMAGE_POSITIONS.length];
            const progress = Math.min((totalTime - switchTimeRef.current) / CONFIG.AUTO_ADVANCE_TIME, 1);
            setPathProgress(progress);

            // Calculate new position with some gentle motion
            tmpVector.copy(currentPos).lerp(nextPos, progress);
            tmpVector.x += Math.sin(totalTime * 1.5) * 0.3;
            tmpVector.y += Math.cos(totalTime * 1) * 0.2;
            tmpVector.z += Math.sin(totalTime * 2) * 0.15;

            lastPositionRef.current.copy(emitter.current.position);
            emitter.current.position.lerp(tmpVector, delta * 1.5);
            checkImageTriggers(emitter.current.position);

            // Heart pulse animation
            if (heartMesh.current) {
                const pulse = Math.sin(totalTime * 1.5) * 0.1 + 1;
                heartMesh.current.scale.set(pulse, pulse, pulse);
                heartMesh.current.rotation.y = totalTime * 0.2;
            }

            // Process image transitions
            Object.entries(imageTransitions).forEach(([idx, transition]) => {
                const imageIdx = parseInt(idx);
                const elapsed = totalTime - transition.startTime;
                const normalizedTime = Math.min(elapsed / transition.duration, 1);

                let newTransition = { ...transition };

                if (transition.state === 'appearing') {
                    const effect = appearEffects[transition.effectIndex];
                    if (effect) {
                        Object.assign(newTransition, effect(normalizedTime));
                    }
                    if (normalizedTime >= 1) {
                        newTransition.state = 'visible';
                    }
                } else if (transition.state === 'disappearing') {
                    const effect = disappearEffects[transition.effectIndex];
                    if (effect) {
                        Object.assign(newTransition, effect(normalizedTime, transition.direction!));
                    }
                    newTransition.spinAngle = normalizedTime * Math.PI * (transition.spinSpeed || 1);
                }

                setImageTransitions(prev => ({
                    ...prev,
                    [imageIdx]: newTransition,
                }));
            });
        }
    });

    return (
        <>
            {/* Global particle systems */}
            <VFXParticles
                name="particles"
                settings={{
                    nbParticles: 50000,
                    gravity: [0, -0.8, 0],
                    fadeSize: [0.08, 0.2],
                    renderMode: "billboard",
                    intensity: 3,
                }}
            />

            <VFXParticles
                name="heartBubbles"
                settings={{
                    nbParticles: 15000,
                    gravity: [0, 0.5, 0],
                    fadeSize: [0, 0],
                    renderMode: "billboard",
                    intensity: 2,
                }}
            />

            {/* Empty HTML container */}
            <Html
                position={[0, -6, -2]}
                style={{
                    pointerEvents: 'none',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            />

            {/* Main emitter group */}
            <group ref={emitter}>
                {/* Heart mesh */}
                <mesh ref={heartMesh} scale={[0.6, 0.6, 0.6]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial
                        color="#ff69b4"
                        emissive="#ff1493"
                        emissiveIntensity={1.5}
                        metalness={0.3}
                        roughness={0.2}
                    />
                </mesh>

                {/* Title text */}
                <Text
                    position={[0, 1, -1]}
                    fontSize={0.3}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.03}
                    outlineColor="#ff1493"
                >
                    Khiêu ♡ Thương
                </Text>

                {/* Particle emitters */}
                <VFXEmitter
                    emitter="particles"
                    settings={{
                        loop: true,
                        duration: 1.5,
                        nbParticles: 800,
                        startPositionMin: [-0.3, -0.3, -0.3],
                        startPositionMax: [0.3, 0.3, 0.3],
                        directionMin: [-0.7, -0.15, -0.7],
                        directionMax: [0.7, 0.7, 0.7],
                        size: [0.03, 0.2],
                        speed: [0.7, 5],
                        colorStart: ["#ff69b4", "#87ceeb", "#ffb6c1"],
                        colorEnd: ["#ff1493", "#1e90ff", "#ffffff"],
                    }}
                    debug={false}
                />
                <VFXEmitter
                    emitter="heartBubbles"
                    settings={{
                        loop: true,
                        duration: 2,
                        nbParticles: 100,
                        startPositionMin: [-0.3, -0.3, -0.3],
                        startPositionMax: [0.3, 0.3, 0.3],
                        directionMin: [-0.2, 0.4, -0.2],
                        directionMax: [0.2, 1.2, 0.2],
                        size: [0.08, 0.3],
                        speed: [0.4, 1.5],
                        colorStart: ["#ff69b4", "#ffc0cb"],
                        colorEnd: ["#ffffff", "#ffb6c1"],
                    }}
                    debug={false}
                />
            </group>

            {/* Render visible and fading images */}
            {visibleImages.map(index => (
                <Image
                    key={`visible-${index}`}
                    index={index}
                    isVisible={true}
                    isFading={false}
                    transition={imageTransitions[index] || {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        spinAngle: 0,
                        state: 'visible'
                    }}
                    activeImage={activeImage}
                    textureRefs={textureRefs}
                    imageAspectRatios={imageAspectRatios}
                    timeRef={timeRef}
                    emitterRefs={emitterRefs}
                />
            ))}

            {Object.keys(fadingImages).map(index => (
                <Image
                    key={`fading-${parseInt(index)}`}
                    index={parseInt(index)}
                    isVisible={false}
                    isFading={true}
                    transition={imageTransitions[parseInt(index)] || {
                        opacity: 0,
                        scale: 0,
                        rotation: 0,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        spinAngle: 0,
                        state: 'disappearing'
                    }}
                    activeImage={activeImage}
                    textureRefs={textureRefs}
                    imageAspectRatios={imageAspectRatios}
                    timeRef={timeRef}
                    emitterRefs={emitterRefs}
                />
            ))}

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[-5, -5, -5]} intensity={0.2} color="#ff69b4" />

            {/* Camera controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                rotateSpeed={0.7}
                minAzimuthAngle={-Infinity}
                maxAzimuthAngle={Infinity}
            />
        </>
    );
};


