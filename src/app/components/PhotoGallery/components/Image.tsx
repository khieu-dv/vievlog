
// src/components/PhotoGallery/components/Image.tsx
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { VFXEmitter } from "wawa-vfx";
import { DoubleSide, Texture } from "three";
import { ImageTransitionState, AspectRatioMap } from "../types";
import { IMAGE_DETAILS, IMAGE_POSITIONS } from "../constants";

interface ImageProps {
    index: number;
    isVisible: boolean;
    isFading: boolean;
    transition: ImageTransitionState;
    activeImage: number | null;
    textureRefs: React.MutableRefObject<Array<Texture | null>>;
    imageAspectRatios: AspectRatioMap;
    timeRef: React.MutableRefObject<number>;
    emitterRefs: React.MutableRefObject<{ [key: string]: any }>;
}

export const Image = ({
    index,
    isVisible,
    isFading,
    transition,
    activeImage,
    textureRefs,
    imageAspectRatios,
    timeRef,
    emitterRefs
}: ImageProps) => {
    const basePosition = IMAGE_POSITIONS[index];

    // Lấy tỷ lệ khung hình của ảnh (mặc định là 1.5 nếu không có)
    const aspectRatio = imageAspectRatios[index] || 1.5;

    // Tính toán kích thước dựa trên tỷ lệ khung hình
    const imageWidth = 5 * (aspectRatio > 1.5 ? 1.5 : aspectRatio); // Giới hạn tỷ lệ tối đa
    const imageHeight = 5 * (aspectRatio > 1.5 ? 1.5 / aspectRatio : 1);

    // Điều chỉnh tỷ lệ ảnh cho thiết bị di động
    const imageScaleMultiplier = Math.min(1.0, window.innerWidth / 600); // Ví dụ: tỷ lệ dựa trên chiều rộng màn hình
    const frameScaleMultiplier = imageScaleMultiplier * 1.1;
    const textScaleMultiplier = imageScaleMultiplier * 0.8;

    return (
        <group
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

                {/* Khung ảnh */}
                <mesh
                    position={[0, 0, -0.05]} // Slightly closer frame
                    scale={[
                        frameScaleMultiplier * (imageWidth + 0.2) * (transition.scale ?? 1) * (activeImage === index ? 1.05 : 1),
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

                {/* Hình ảnh */}
                <mesh
                    scale={[
                        imageScaleMultiplier * imageWidth * (transition.scale ?? 1),
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

                {/* Hiệu ứng ánh sáng khi biến mất */}
                {transition.state === 'disappearing' && (
                    <>
                        <pointLight
                            position={[
                                Math.sin(timeRef.current * 3) * 1.5,
                                Math.cos(timeRef.current * 2.5) * 1.5,
                                Math.sin(timeRef.current * 2) * 0.7
                            ]}
                            intensity={1 * transition.opacity!}
                            color="#ffd700"
                            distance={2}
                            decay={2}
                        />
                        <pointLight
                            position={[
                                Math.cos(timeRef.current * 2.5) * -1.5,
                                Math.sin(timeRef.current * 2) * 1.5,
                                Math.cos(timeRef.current * 3) * 0.7
                            ]}
                            intensity={0.8 * transition.opacity!}
                            color="#1e90ff"
                            distance={1.5}
                            decay={2}
                        />
                    </>
                )}

                {/* Văn bản mô tả */}
                <group
                    position={[0, -imageHeight * 0.6 - 0.2, 0.05]}
                    scale={[1, 1, 1]}
                >
                    <Text
                        fontSize={0.25 * (0.7 + 0.3 * transition.scale!) * transition.scale!}
                        color={activeImage === index ? "#ff1493" : "#ffffff"}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02 * (0.7 + 0.3 * transition.scale!)}
                        outlineColor="#000000"
                    >
                        {IMAGE_DETAILS[index]}
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
