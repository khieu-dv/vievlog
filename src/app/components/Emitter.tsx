import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Vector3, TextureLoader, MathUtils, DoubleSide, Texture } from "three";
import { Text, Html, useTexture } from "@react-three/drei";
import { VFXEmitter, VFXParticles } from "wawa-vfx";
import { OrbitControls } from "@react-three/drei";

// Paths to images (using placeholders, replace with actual images)
const IMAGES: string[] = [
  "/images/0.jpg",
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg"
];

// Mảng chứa thông tin văn bản cho từng ảnh
const IMAGE_DETAILS: string[] = [
  "🎄VK Ck đi chơi Noel",
  "👶👶 Chào thế giới, hai tình yêu bé nhỏ",
  "👵👶 Vòng tay bên Bà và Cậu",
  "👨‍👩‍👧‍👦 2 Vk Ck chào đón 2 con",
  "✝️  Khoảnh khắc thiêng liêng đầu đời",
  "🎂 Bống thêm tuổi mới",
  "😴  Giấc mơ của 2 thiên thần",
  "🌌  Ánh mắt Minh Hà giữa trời sao",
  "💉 Đưa 2 con đi tiêm chủng",
  "✈️ Kỷ niệm tại sân bay Incheon"
];

// Positions for displaying each image (adjusted for mobile)
const IMAGE_POSITIONS: Vector3[] = [
  new Vector3(3, 1.5, -2),
  new Vector3(-3, 2, 2),
  new Vector3(0, 3, -4),
  new Vector3(-2, 0, 5),
  new Vector3(3, -2, 1),
  new Vector3(-4, -0.5, -1.5),
  new Vector3(1.5, 3, 3),
  new Vector3(-3, 1.5, -3),
  new Vector3(4, -1.5, -2.5),
  new Vector3(0, -3, 4)
];

// Distance to trigger image display (slightly closer for mobile)
const TRIGGER_DISTANCE: number = 1.5;

// Number of images to display simultaneously (reduce for better performance)
const MAX_VISIBLE_IMAGES: number = 1;

// Transition duration (seconds)
const APPEAR_TRANSITION_DURATION: number = 1.0; // Slightly faster
const DISAPPEAR_TRANSITION_DURATION: number = 1.5; // Slightly faster

// Background audio
const AUDIO_URL: string = "https://viedesk.sgp1.cdn.digitaloceanspaces.com/audio_birthday.m4a";

const tmpVector = new Vector3();

interface ImageTransitionState {
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

interface TransitionMap {
  [key: number]: ImageTransitionState;
}

interface AspectRatioMap {
  [key: number]: number;
}

export const Emitter = () => {
  const emitter = useRef<THREE.Group>(null);
  const heartMesh = useRef<THREE.Mesh>(null);
  const [imageTransitions, setImageTransitions] = useState<TransitionMap>({});
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const { camera, gl } = useThree(); // Get gl for viewport size
  const [pathProgress, setPathProgress] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);
  const [fadingImages, setFadingImages] = useState<{ [key: number]: boolean }>({});
  const [imageAspectRatios, setImageAspectRatios] = useState<AspectRatioMap>({}); // Lưu tỷ lệ khung hình của từng ảnh
  const textureRefs = useRef<Array<Texture | null>>([]);
  const timeRef = useRef<number>(0);
  const switchTimeRef = useRef<number>(0);
  const autoAdvanceRef = useRef<boolean>(true);
  const emitterRefs = useRef<{ [key: string]: any }>({});
  const lastPositionRef = useRef<Vector3>(new Vector3());
  const AUTO_ADVANCE_TIME: number = 4; // Seconds between points

  interface Effect {
    (progress: number): {
      opacity: number;
      scale: number;
      rotation: number;
      translateY: number;
    };
  }

  interface DisappearEffect {
    (progress: number, direction: Vector3): {
      opacity: number;
      scale: number;
      rotation: number;
      translateX: number;
      translateY: number;
      translateZ: number;
    };
  }

  const appearEffects: Effect[] = [
    (progress) => ({ // Fade in and scale up
      opacity: progress,
      scale: 0.7 + easeOutBack(progress) * 0.3, // Reduced scale up
      rotation: 0,
      translateY: 0,
    }),
    (progress) => ({ // Slide up
      opacity: progress,
      scale: 1,
      rotation: 0,
      translateY: (1 - progress) * -1.5, // Reduced slide distance
    }),
    (progress) => ({ // Zoom from center
      opacity: progress,
      scale: easeOutElastic(progress) * 0.8, // Reduced zoom
      rotation: 0,
      translateY: 0,
    }),
    (progress) => ({ // Spin in
      opacity: progress,
      scale: progress * 0.8, // Reduced final scale
      rotation: progress * Math.PI * 2,
      translateY: 0,
    }),
    (progress) => ({ // Fade in with slight rotation
      opacity: progress,
      scale: 1,
      rotation: (1 - progress) * Math.PI * 0.3, // Reduced rotation
      translateY: 0,
    }),
  ];

  const disappearEffects: DisappearEffect[] = [
    (progress, direction) => ({ // Fade out and float up
      opacity: 1 - progress,
      scale: 1 - progress * 0.6, // Reduced scale down
      rotation: 0,
      translateX: direction.x * progress * 2, // Reduced float distance
      translateY: direction.y * progress * 2,
      translateZ: direction.z * progress * 2,
    }),
    (progress, direction) => ({ // Shrink and fade
      opacity: 1 - progress,
      scale: 1 - progress * 0.7, // Faster shrink
      rotation: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    }),
    (progress, direction) => ({ // Spin out and fade
      opacity: 1 - progress,
      scale: 1 - progress * 0.4, // Faster scale down
      rotation: progress * Math.PI * 2, // Reduced spin
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    }),
    (progress, direction) => ({ // Move away quickly
      opacity: 1 - progress,
      scale: 1,
      rotation: 0,
      translateX: direction.x * progress * 3, // Reduced move distance
      translateY: direction.y * progress * 3,
      translateZ: direction.z * progress * 3,
    }),
    (progress, direction) => ({ // Fade and slightly rotate
      opacity: 1 - progress,
      scale: 1,
      rotation: progress * Math.PI * 0.3, // Reduced rotation
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    }),
  ];

  useEffect(() => {
    // Đẩy camera ra xa hơn để "zoom out" nhẹ
    camera.position.set(0, 0, 15);
    camera.zoom = 0.1; // Giảm zoom để có góc nhìn rộng hơn

    // Hoặc chỉnh FOV nếu bạn muốn góc nhìn rộng hơn
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 35;
    }
    camera.updateProjectionMatrix();
  }, [camera]);


  // Load textures for images and calculate aspect ratios
  useEffect(() => {
    const loadTextures = async () => {
      const loader = new TextureLoader();
      const loadPromises = IMAGES.map((url, index) => {
        return new Promise<Texture | null>((resolve) => {
          const img = new Image();
          img.onload = () => {
            // Lưu tỷ lệ khung hình (width/height) của ảnh
            const aspectRatio = img.width / img.height;
            setImageAspectRatios(prev => ({ ...prev, [index]: aspectRatio }));

            // Load texture
            loader.load(url, texture => {
              resolve(texture);
            }, undefined, error => {
              console.error("Error loading texture:", error);
              resolve(null);
            });
          };
          img.onerror = () => {
            console.error("Error loading image:", url);
            setImageAspectRatios(prev => ({ ...prev, [index]: 1.5 })); // Tỷ lệ mặc định nếu load ảnh lỗi
            resolve(null);
          };
          img.src = url;
        });
      });

      try {
        const loadedTextures = await Promise.all(loadPromises);
        textureRefs.current = loadedTextures;
      } catch (error) {
        console.error("Error loading textures:", error);
      }
    };

    loadTextures();
  }, []);

  // Set up background audio
  useEffect(() => {
    try {
      const audioEl = document.createElement('audio');
      audioEl.src = AUDIO_URL;
      audioEl.loop = true;
      audioEl.volume = 0.3; // Lower volume for mobile
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElementRef.current = audioEl;

      audioEl.play().catch(err => {
        console.error("Could not play audio:", err);
      });
    } catch (error) {
      console.error("Error setting up audio:", error);
    }

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.remove();
      }
    };
  }, []);

  // Add new image with a random appear transition
  const addImageWithTransition = (imageIndex: number) => {
    setVisibleImages(prev => [...prev, imageIndex]);
    const randomEffectIndex = Math.floor(Math.random() * appearEffects.length);
    setImageTransitions(prev => ({
      ...prev,
      [imageIndex]: {
        startTime: timeRef.current,
        duration: APPEAR_TRANSITION_DURATION,
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
        duration: DISAPPEAR_TRANSITION_DURATION,
        effectIndex: randomEffectIndex,
        state: 'disappearing',
        direction: randomDirection,
        spinAxis: new Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize(),
        spinSpeed: Math.random() * 1.5 + 0.5 // Slightly slower spin
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
    }, DISAPPEAR_TRANSITION_DURATION * 1000);
  };

  // Check distance from emitter to image positions and manage display
  const checkImageTriggers = (emitterPosition: Vector3) => {
    let closestImageIndex: number = -1;
    let closestDistance: number = Infinity;

    IMAGE_POSITIONS.forEach((position, index) => {
      const distance = emitterPosition.distanceTo(position);

      if (distance < TRIGGER_DISTANCE && distance < closestDistance) {
        closestDistance = distance;
        closestImageIndex = index;
      }
    });

    if (closestImageIndex !== -1) {
      setActiveImage(closestImageIndex);
      if (!visibleImages.includes(closestImageIndex) && !fadingImages[closestImageIndex]) {
        addImageWithTransition(closestImageIndex);
        if ([...visibleImages, closestImageIndex].length > MAX_VISIBLE_IMAGES) {
          const oldestImage = visibleImages[0];
          removeImageWithTransition(oldestImage);
        }
      }
    } else {
      setActiveImage(null);
    }
  };

  useFrame(({ clock }, delta) => {
    const totalTime = clock.getElapsedTime();
    timeRef.current = totalTime;

    if (emitter.current) {
      if (autoAdvanceRef.current) {
        if (totalTime - switchTimeRef.current > AUTO_ADVANCE_TIME) {
          const nextPosition = (currentPosition + 1) % IMAGE_POSITIONS.length;
          setCurrentPosition(nextPosition);
          switchTimeRef.current = totalTime;
        }
      }

      const currentPos = IMAGE_POSITIONS[currentPosition];
      const nextPos = IMAGE_POSITIONS[(currentPosition + 1) % IMAGE_POSITIONS.length];
      const progress = Math.min((totalTime - switchTimeRef.current) / AUTO_ADVANCE_TIME, 1);
      setPathProgress(progress);
      tmpVector.copy(currentPos).lerp(nextPos, progress);
      tmpVector.x += Math.sin(totalTime * 1.5) * 0.3; // Slower movement
      tmpVector.y += Math.cos(totalTime * 1) * 0.2;
      tmpVector.z += Math.sin(totalTime * 2) * 0.15;
      lastPositionRef.current.copy(emitter.current.position);
      emitter.current.position.lerp(tmpVector, delta * 1.5); // Slower lerp
      checkImageTriggers(emitter.current.position);

      if (heartMesh.current) {
        const pulse = Math.sin(totalTime * 1.5) * 0.1 + 1; // Slower pulse
        heartMesh.current.scale.set(pulse, pulse, pulse);
        heartMesh.current.rotation.y = totalTime * 0.2; // Slower rotation
      }

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

  // Easing functions
  const easeOutBack = (x: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  const easeOutElastic = (x: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  };

  const renderImage = (index: number, isVisible: boolean, isFading: boolean) => {
    const transition = imageTransitions[index] || { opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0, rotation: 0, translateX: 0, translateY: 0, translateZ: 0, spinAngle: 0, state: 'visible' };
    const basePosition = IMAGE_POSITIONS[index];

    // Lấy tỷ lệ khung hình của ảnh (mặc định là 1.5 nếu không có)
    const aspectRatio = imageAspectRatios[index] || 1.5;

    // Tính toán kích thước dựa trên tỷ lệ khung hình
    const imageWidth = 5 * (aspectRatio > 1.5 ? 1.5 : aspectRatio); // Giới hạn tỷ lệ tối đa
    const imageHeight = 5 * (aspectRatio > 1.5 ? 1.5 / aspectRatio : 1);

    // Adjust image scale for mobile
    const imageScaleMultiplier = Math.min(1.0, window.innerWidth / 600); // Example scaling based on screen width
    const frameScaleMultiplier = imageScaleMultiplier * 1.1;
    const textScaleMultiplier = imageScaleMultiplier * 0.8;

    return (
      <group
        key={index}
        position={[
          basePosition.x + (transition.translateX || 0),
          basePosition.y + (transition.translateY || 0),
          basePosition.z + (transition.translateZ || 0)
        ]}
        rotation={[0, transition.rotation || 0, 0]}
      >
        <group rotation={[0, transition.spinAngle || 0, 0]}>
          {(transition.state === 'appearing' || transition.state === 'disappearing') && (
            <VFXEmitter
              ref={el => { emitterRefs.current[`image_${index}`] = el; }}
              emitter="particles"
              settings={{
                loop: true,
                duration: 1.5, // Shorter particle duration
                nbParticles: transition.state === 'appearing' ? 300 : 500, // Fewer particles
                startPositionMin: [-1.5, -1, -0.3], // Smaller start area
                startPositionMax: [1.5, 1, 0.3],
                directionMin: transition.state === 'appearing' ? [-0.8, -0.3, -0.8] : [-1.5, -0.7, -1.5],
                directionMax: transition.state === 'appearing' ? [0.8, 0.3, 0.8] : [1.5, 1.5, 1.5],
                size: transition.state === 'appearing' ? [0.02, 0.1] : [0.03, 0.15], // Smaller particles
                speed: transition.state === 'appearing' ? [0.3, 1.5] : [0.7, 2.5], // Slower speed
                colorStart: transition.state === 'appearing' ?
                  ["#ff69b4", "#87ceeb", "#ffb6c1"] :
                  ["#ff1493", "#1e90ff", "#ffd700"],
                colorEnd: transition.state === 'appearing' ?
                  ["#ff1493", "#1e90ff", "#ffffff"] :
                  ["#ff69b4", "#00bfff", "#ffb6c1"],
              }}
              debug={false}
            />
          )}

          <mesh
            position={[0, 0, -0.05]} // Slightly closer frame
            scale={[
              frameScaleMultiplier * (imageWidth + 0.2) * (transition.scale ?? 1) * (activeImage === index ? 1.05 : 1), // Adjusted frame scale based on image width
              frameScaleMultiplier * (imageHeight + 0.2) * (transition.scale ?? 1) * (activeImage === index ? 1.05 : 1),
              frameScaleMultiplier * 0.1 * (transition.scale ?? 1) * (activeImage === index ? 1.05 : 1)
            ]}
          >
            <meshStandardMaterial
              color={activeImage === index ? "#ff1493" : "#ffffff"}
              metalness={0.5}
              roughness={0.2}
              transparent={true}
              opacity={transition.opacity}
              emissive={activeImage === index ? "#ff69b4" : "#555555"}
              emissiveIntensity={activeImage === index ? 0.5 : 0.1}
            />
          </mesh>

          <mesh
            scale={[
              imageScaleMultiplier * imageWidth * (transition.scale ?? 1), // Adjusted image scale based on aspect ratio
              imageScaleMultiplier * imageHeight * (transition.scale ?? 1),
              imageScaleMultiplier * 0.1 * (transition.scale ?? 1)
            ]}
            position={[0, 0, 0]}
          >
            <planeGeometry />
            <meshBasicMaterial
              map={textureRefs.current[index]!}
              transparent={true}
              opacity={(transition.opacity ?? 1) * (activeImage === index ? 1 : 0.7)}
              side={DoubleSide}
            />
          </mesh>

          {transition.state === 'disappearing' && (
            <>
              <pointLight
                position={[
                  Math.sin(timeRef.current * 3) * 1.5, // Closer sparkle
                  Math.cos(timeRef.current * 2.5) * 1.5,
                  Math.sin(timeRef.current * 2) * 0.7
                ]}
                intensity={1 * transition.opacity!} // Reduced intensity
                color="#ffd700"
                distance={2} // Shorter distance
                decay={2}
              />
              <pointLight
                position={[
                  Math.cos(timeRef.current * 2.5) * -1.5,
                  Math.sin(timeRef.current * 2) * 1.5,
                  Math.cos(timeRef.current * 3) * 0.7
                ]}
                intensity={0.8 * transition.opacity!} // Reduced intensity
                color="#1e90ff"
                distance={1.5} // Shorter distance
                decay={2}
              />
            </>
          )}

          <group
            position={[0, -imageHeight * 0.6 - 0.2, 0.05]} // Điều chỉnh vị trí dựa trên chiều cao ảnh
            scale={[1, 1, 1]}
          >
            <Text
              fontSize={0.25 * (0.7 + 0.3 * transition.scale!) * transition.scale!} // Điều chỉnh kích thước phông chữ
              color={activeImage === index ? "#ff1493" : "#ffffff"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02 * (0.7 + 0.3 * transition.scale!)} // Điều chỉnh độ dày viền
              outlineColor="#000000"
            >
              {IMAGE_DETAILS[index]} {/* Hiển thị thông tin chi tiết */}
            </Text>
            <meshStandardMaterial
              transparent={true}
              opacity={transition.opacity!}
            />
          </group>
        </group>
      </group>
    );
  };

  return (
    <>
      <VFXParticles
        name="particles"
        settings={{
          nbParticles: 50000, // Reduced particles
          gravity: [0, -0.8, 0], // Slightly less gravity
          fadeSize: [0.08, 0.2], // Smaller fade size
          renderMode: "billboard",
          intensity: 3, // Reduced intensity
        }}
      />

      <VFXParticles
        name="heartBubbles"
        settings={{
          nbParticles: 15000, // Reduced particles
          gravity: [0, 0.5, 0], // Reduced gravity
          fadeSize: [0, 0],
          renderMode: "billboard",
          intensity: 2, // Reduced intensity
        }}
      />

      <Html position={[0, -6, -2]} // Adjusted controls position
        style={{
          pointerEvents: 'none',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >

      </Html>

      <group ref={emitter}>
        <mesh ref={heartMesh} scale={[0.6, 0.6, 0.6]}> {/* Smaller heart */}
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#ff69b4"
            emissive="#ff1493"
            emissiveIntensity={1.5} // Reduced emissive intensity
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        <Text
          position={[0, 1, -1]} // Adjusted text position
          fontSize={0.3} // Smaller font size
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ff1493"
        >
          Khiêu ♡ Thương
        </Text>

        <VFXEmitter
          emitter="particles"
          settings={{
            loop: true,
            duration: 1.5, // Shorter duration
            nbParticles: 800, // Fewer particles
            startPositionMin: [-0.3, -0.3, -0.3], // Smaller start area
            startPositionMax: [0.3, 0.3, 0.3],
            directionMin: [-0.7, -0.15, -0.7],
            directionMax: [0.7, 0.7, 0.7],
            size: [0.03, 0.2], // Smaller size
            speed: [0.7, 5], // Slower speed
            colorStart: ["#ff69b4", "#87ceeb", "#ffb6c1"],
            colorEnd: ["#ff1493", "#1e90ff", "#ffffff"],
          }}
          debug={false}
        />

        <VFXEmitter
          emitter="heartBubbles"
          settings={{
            loop: true,
            duration: 2, // Shorter duration
            nbParticles: 100, // Fewer bubbles
            startPositionMin: [-0.3, -0.3, -0.3],
            startPositionMax: [0.3, 0.3, 0.3],
            directionMin: [-0.2, 0.4, -0.2],
            directionMax: [0.2, 1.2, 0.2],
            size: [0.08, 0.3], // Smaller size
            speed: [0.4, 1.5], // Slower speed
            colorStart: ["#ff69b4", "#ffc0cb"],
            colorEnd: ["#ffffff", "#ffb6c1"],
          }}
          debug={false}
        />
      </group>

      {visibleImages.map(index => renderImage(index, true, false))}
      {Object.keys(fadingImages).map(index => renderImage(parseInt(index), false, true))}

      <ambientLight intensity={0.4} /> {/* Reduced ambient light */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.7}
        minAzimuthAngle={-Infinity} // cho phép quay trái
        maxAzimuthAngle={Infinity}  // cho phép quay phải
      />


      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" /> {/* Reduced point light */}
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#ff69b4" /> {/* Reduced point light */}
    </>
  );
};