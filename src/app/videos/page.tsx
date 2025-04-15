// app/posts/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PocketBase from 'pocketbase';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../../lib/auth-client_v2";
import { Emitter } from "../components/Emitter";
import { Experience } from "../components/Experience";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function PostsPage() {
    const { t } = useTranslation();

    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
    };


    return (
        <>
            {!started && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(17, 5, 17, 0.9))",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                        flexDirection: "column",
                        fontFamily: "'Quicksand', sans-serif",
                        textAlign: "center",
                        backdropFilter: "blur(6px)",
                        animation: "fadeIn 2s ease-in-out",
                    }}
                >
                    <h1 style={{ marginBottom: "20px", fontFamily: "'Dancing Script', cursive", fontSize: "28px" }}>
                        ✨ Có thể hôm nay chỉ là một ngày bình thường như bao ngày khác...
                    </h1>
                    <h1 style={{ marginBottom: "20px", fontFamily: "'Dancing Script', cursive", fontSize: "28px" }}>
                        ☀️ Nắng vẫn nghiêng bên khung cửa sổ quen
                    </h1>
                    <h1 style={{ marginBottom: "20px", fontFamily: "'Dancing Script', cursive", fontSize: "28px" }}>
                        🐦 Tiếng chim vẫn ríu rít nơi đầu ngõ
                    </h1>
                    <h1 style={{ marginBottom: "30px", fontFamily: "'Dancing Script', cursive", fontSize: "28px" }}>
                        💭 Nhưng với anh – là dịp để lặng thầm yêu em thêm lần nữa.
                    </h1>

                    <button
                        onClick={handleStart}
                        style={{
                            padding: "14px 32px",
                            fontSize: "18px",
                            background: "#e91e63",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50px",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            transition: "transform 0.2s, background 0.3s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#d81b60";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#e91e63";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        💖 Xem video 💖
                    </button>
                </div>
            )}

            {started && (
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: -1,
                    }}
                >
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