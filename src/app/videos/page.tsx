"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";

export default function PostsPage() {
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
    };

    return (
        <>

            <Header />
            {!started && (
                <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center backdrop-blur-sm font-[Quicksand] animate-fade-in">
                    <h1 className="mb-5 text-2xl font-[Dancing_Script]">✨ Có thể hôm nay chỉ là một ngày bình thường như bao ngày khác...</h1>
                    <h1 className="mb-5 text-2xl font-[Dancing_Script]">☀️ Nắng vẫn nghiêng bên khung cửa sổ quen</h1>
                    <h1 className="mb-5 text-2xl font-[Dancing_Script]">🐦 Tiếng chim vẫn ríu rít nơi đầu ngõ</h1>
                    <h1 className="mb-8 text-2xl font-[Dancing_Script]">💭 Nhưng với anh – là dịp để lặng thầm yêu em thêm lần nữa.</h1>

                    <button
                        onClick={handleStart}
                        className="px-8 py-3 text-lg bg-pink-600 text-white rounded-full shadow-md transition-transform duration-200 hover:bg-pink-700 hover:scale-105"
                    >
                        💖 Xem video 💖
                    </button>
                </div>
            )}

            {started && (
                <div className="fixed inset-0 z-[-1] bg-black">
                    <Canvas shadows camera={{ position: [12, 8, 26], fov: 30 }}>
                        <Suspense fallback={null}>
                            <Experience />
                        </Suspense>
                    </Canvas>
                </div>
            )}
        </>
    );
}
