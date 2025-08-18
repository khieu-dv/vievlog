"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import { Video } from '~/lib/types';

type VideoFeedProps = {
    videos: Video[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [globalMuted, setGlobalMuted] = useState(true);
    const [hasPlayedBefore, setHasPlayedBefore] = useState(false);

    // Initialize video refs
    useEffect(() => {
        videoRefs.current = Array(videos.length).fill(null);
    }, [videos.length]);

    // Simple intersection observer for video visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const index = videoRefs.current.findIndex(ref => ref === entry.target);
                        if (index !== -1 && index !== currentIndex) {
                            setCurrentIndex(index);
                        }
                    }
                });
            },
            {
                threshold: 0.5,
                root: containerRef.current,
                rootMargin: '0px'
            }
        );

        videoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [videos, currentIndex]);

    // Update play state
    useEffect(() => {
        if (!hasPlayedBefore && currentIndex >= 0) {
            setHasPlayedBefore(true);
        }
    }, [currentIndex, hasPlayedBefore]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    if (currentIndex > 0 && containerRef.current) {
                        const targetElement = videoRefs.current[currentIndex - 1];
                        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (currentIndex < videos.length - 1 && containerRef.current) {
                        const targetElement = videoRefs.current[currentIndex + 1];
                        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    break;
                case "m":
                case "M":
                    setGlobalMuted(prev => !prev);
                    break;
                case " ":
                    e.preventDefault();
                    if (globalMuted) {
                        setGlobalMuted(false);
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, videos.length, globalMuted]);

    // Mute state handler
    const handleMutedChange = useCallback((muted: boolean) => {
        setGlobalMuted(muted);
    }, []);

    if (videos.length === 0) {
        return <div className="text-white text-center p-4">No videos found</div>;
    }

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto video-container"
        >
            {videos.map((video, index) => (
                <div
                    key={video.id}
                    ref={(el) => {
                        videoRefs.current[index] = el;
                    }}
                    className="w-full relative"
                    style={{
                        height: 'calc(100vh - 56px)',
                        minHeight: 'calc(100vh - 56px)'
                    }}
                >
                    <VideoPlayer
                        video={video}
                        isPlaying={index === currentIndex}
                        globalMuted={globalMuted}
                        onMutedChange={handleMutedChange}
                        playedBefore={hasPlayedBefore}
                    />
                    <VideoInfo video={video} />
                </div>
            ))}
        </div>
    );
};

export default VideoFeed;