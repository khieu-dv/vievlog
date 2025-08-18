"use client";

import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import { Video } from '~/lib/types';

type VideoFeedProps = {
    videos: Video[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Initialize video refs
    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, videos.length);
    }, [videos.length]);

    // Intersection Observer to detect which video is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = videoRefs.current.indexOf(entry.target as HTMLDivElement);
                        if (index !== -1 && index !== currentIndex) {
                            setCurrentIndex(index);
                        }
                    }
                });
            },
            {
                threshold: 0.7, // Video must be 70% visible to be considered active
                root: containerRef.current
            }
        );

        videoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [videos, currentIndex]);

    const toggleMute = () => {
        setMuted(!muted);
    };

    if (videos.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-white text-center">No videos found</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="video-feed"
            style={{
                height: 'calc(100vh - 56px)' // Account for header
            }}
        >
            {videos.map((video, index) => (
                <div
                    key={video.id}
                    ref={(el) => {
                        videoRefs.current[index] = el;
                    }}
                    className="video-item"
                    style={{
                        height: 'calc(100vh - 56px)' // Match container height
                    }}
                >
                    <VideoPlayer
                        video={video}
                        isActive={index === currentIndex}
                        muted={muted}
                        onToggleMute={toggleMute}
                    />
                    <VideoInfo video={video} />
                </div>
            ))}
        </div>
    );
};

export default VideoFeed;