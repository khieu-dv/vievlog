"use client";

import React, { useRef, useEffect, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { Video } from '~/lib/types';

type VideoPlayerProps = {
    video: Video;
    isActive: boolean;
    muted: boolean;
    onToggleMute: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    video,
    isActive,
    muted,
    onToggleMute
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);

    // Handle video playback based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.currentTime = 0;
            const playPromise = video.play();
            
            if (playPromise) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        setIsPlaying(false);
                        setShowPlayButton(true);
                    });
            }
        } else {
            video.pause();
            video.currentTime = 0;
            setIsPlaying(false);
            setShowPlayButton(false);
        }
    }, [isActive]);

    // Handle mute state
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = muted;
        }
    }, [muted]);

    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video || !isActive) return;

        if (video.paused) {
            video.play().then(() => {
                setIsPlaying(true);
                setShowPlayButton(false);
            });
        } else {
            video.pause();
            setIsPlaying(false);
            setShowPlayButton(true);
        }
    };

    const handleVideoEnded = () => {
        const video = videoRef.current;
        if (video && isActive) {
            video.currentTime = 0;
            video.play();
        }
    };

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                src={video.video_url}
                className="w-full h-full object-contain"
                playsInline
                muted={muted}
                loop
                preload={isActive ? "auto" : "metadata"}
                poster={video.thumbnail_url}
                onEnded={handleVideoEnded}
                onClick={handleVideoClick}
            />

            {/* Play button overlay */}
            {showPlayButton && (
                <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    onClick={handleVideoClick}
                >
                    <div className="bg-black/50 rounded-full p-4">
                        <Play className="w-16 h-16 text-white" fill="white" />
                    </div>
                </div>
            )}

            {/* Mute button */}
            <button
                className="absolute top-4 right-4 z-20 bg-black/50 rounded-full p-3"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                }}
            >
                {muted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
};

export default VideoPlayer;