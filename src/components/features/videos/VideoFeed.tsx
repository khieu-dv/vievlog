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
    const observersRef = useRef<IntersectionObserver[]>([]);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [globalMuted, setGlobalMuted] = useState(true);
    const [hasPlayedBefore, setHasPlayedBefore] = useState(false);
    const previousIndexRef = useRef(0);

    // Improved navigation functions with boundary checks
    const goToPreviousVideo = useCallback(() => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    }, []);

    const goToNextVideo = useCallback(() => {
        setCurrentIndex(prev => Math.min(videos.length - 1, prev + 1));
    }, [videos.length]);

    // Initialize video refs
    useEffect(() => {
        videoRefs.current = Array(videos.length).fill(null);
    }, [videos.length]);

    // Improved scroll handling with debounce
    const smoothScrollToVideo = useCallback((index: number) => {
        if (videoRefs.current[index]) {
            setIsScrolling(true);

            // Cancel any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Scroll to the video
            videoRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // Set a timeout to reset scrolling state
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 500);
        }
    }, []);

    // Scroll to current video when index changes
    useEffect(() => {
        smoothScrollToVideo(currentIndex);

        // Update mute state logic
        if (hasPlayedBefore && currentIndex !== previousIndexRef.current && !globalMuted) {
            setGlobalMuted(false);
        }

        // Update previous index and play state
        previousIndexRef.current = currentIndex;
        if (!hasPlayedBefore) {
            setHasPlayedBefore(true);
        }
    }, [currentIndex, hasPlayedBefore, globalMuted, smoothScrollToVideo]);

    // Improved intersection observer setup
    useEffect(() => {
        // Disconnect existing observers
        observersRef.current.forEach((observer) => observer.disconnect());
        observersRef.current = [];

        // Create new observers
        const createObserver = (ref: HTMLDivElement, index: number) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // More robust intersection checking
                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio > 0.7 &&
                            !isScrolling
                        ) {
                            setCurrentIndex(index);
                        }
                    });
                },
                {
                    threshold: 0.7,
                    root: null,
                }
            );

            observer.observe(ref);
            return observer;
        };

        // Set up observers for visible videos
        videoRefs.current.forEach((ref, index) => {
            if (ref) {
                const observer = createObserver(ref, index);
                observersRef.current.push(observer);
            }
        });

        // Cleanup
        return () => {
            observersRef.current.forEach((observer) => observer.disconnect());
        };
    }, [videos, isScrolling]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    goToPreviousVideo();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    goToNextVideo();
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
    }, [goToPreviousVideo, goToNextVideo, globalMuted]);

    // Touch swipe navigation
    useEffect(() => {
        let touchStartY = 0;
        let touchStartTime = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            const diff = touchStartY - touchEndY;
            const timeDiff = touchEndTime - touchStartTime;

            const isFastSwipe = timeDiff < 300;
            const minDiff = isFastSwipe ? 30 : 50;

            if (Math.abs(diff) > minDiff) {
                diff > 0 ? goToNextVideo() : goToPreviousVideo();
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("touchstart", handleTouchStart);
            container.addEventListener("touchend", handleTouchEnd);

            return () => {
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [goToPreviousVideo, goToNextVideo]);

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Mute state handler
    const handleMutedChange = useCallback((muted: boolean) => {
        setGlobalMuted(muted);
    }, []);

    // No videos handling
    if (videos.length === 0) {
        return <div className="text-white text-center p-4">No videos found</div>;
    }

    return (
        <div
            ref={containerRef}
            className="relative h-screen overflow-y-auto snap-y snap-mandatory video-container"
        >
            {videos.map((video, index) => (
                <div
                    key={video.id}
                    ref={(el) => {
                        videoRefs.current[index] = el;
                    }}
                    className="h-screen w-full snap-start snap-always relative"
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