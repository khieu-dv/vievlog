// components/VideoFeed.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import { Button } from "../../ui/primitives/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Video {
    id: string;
    title: string;
    description: string;
    author: string;
    video_url: string;
    thumbnail_url: string;
    tags: string;
    views: number;
    likes: number;
}

interface VideoFeedProps {
    videos: Video[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const observersRef = useRef<IntersectionObserver[]>([]);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [globalMuted, setGlobalMuted] = useState(true); // Start muted for browser autoplay policy
    const [hasPlayedBefore, setHasPlayedBefore] = useState(false);
    const previousIndexRef = useRef(0);

    // Function to navigate to the previous video
    const goToPreviousVideo = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Function to navigate to the next video
    const goToNextVideo = () => {
        if (currentIndex < videos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Set up refs for all videos
    useEffect(() => {
        videoRefs.current = Array(videos.length).fill(null);
    }, [videos.length]);

    // Handle scroll to current video
    useEffect(() => {
        if (videoRefs.current[currentIndex]) {
            setIsScrolling(true);
            videoRefs.current[currentIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // Reset scrolling flag after animation completes
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 500); // Typical scroll animation duration

            // If we've already played a video before, try to unmute the next one
            // But only if the user has manually unmuted at some point
            if (hasPlayedBefore && currentIndex !== previousIndexRef.current && !globalMuted) {
                // Keep unmuted state when changing videos if user has unmuted before
                setGlobalMuted(false);
            }

            // Update previous index
            previousIndexRef.current = currentIndex;

            // Mark that we've played at least one video
            if (!hasPlayedBefore) {
                setHasPlayedBefore(true);
            }
        }
    }, [currentIndex, hasPlayedBefore, globalMuted]);

    // Set up intersection observers
    useEffect(() => {
        // Disconnect any existing observers
        observersRef.current.forEach((observer) => observer.disconnect());
        observersRef.current = [];

        // Create new observers for each video
        videoRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Only update currentIndex if not currently in a programmatic scroll
                        if (entry.isIntersecting && entry.intersectionRatio > 0.7 && !isScrolling) {
                            setCurrentIndex(index);
                        }
                    });
                },
                {
                    threshold: 0.7, // Video must be 70% visible to be considered "current"
                    root: null,
                }
            );

            observer.observe(ref);
            observersRef.current.push(observer);
        });

        // Clean up observers on unmount
        return () => {
            observersRef.current.forEach((observer) => observer.disconnect());
        };
    }, [videos, isScrolling]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                goToPreviousVideo();
            } else if (e.key === "ArrowDown") {
                goToNextVideo();
            } else if (e.key === "m" || e.key === "M") {
                // Toggle mute with 'm' key
                setGlobalMuted(prev => !prev);
            } else if (e.key === " ") {
                // Space bar can toggle audio
                e.preventDefault(); // Prevent page scroll
                if (globalMuted) {
                    setGlobalMuted(false);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, globalMuted]);

    // Handle swipe navigation on touch devices
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

            // Check if it's a fast swipe (less than 300ms)
            const isFastSwipe = timeDiff < 300;

            // Detect swipe (min 50px movement or fast swipe with min 30px)
            const minDiff = isFastSwipe ? 30 : 50;

            if (Math.abs(diff) > minDiff) {
                if (diff > 0) {
                    // Swipe up - go to next video
                    goToNextVideo();
                } else {
                    // Swipe down - go to previous video
                    goToPreviousVideo();
                }
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
    }, [currentIndex]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Handle muted state changes from child components
    const handleMutedChange = (muted: boolean) => {
        setGlobalMuted(muted);
    };

    if (videos.length === 0) {
        return <div className="text-white text-center p-4">No videos found</div>;
    }

    return (
        <div
            ref={containerRef}
            className="relative h-full overflow-y-auto snap-y snap-mandatory video-container"
        >
            {videos.map((video, index) => (
                <div
                    key={video.id}
                    ref={(el) => {
                        videoRefs.current[index] = el;
                    }}
                    className="h-full w-full snap-start snap-always relative"
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

            {/* <div className="fixed right-4 bottom-20 flex flex-col gap-4 z-40">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/50 border-white/20 text-white"
                    onClick={goToPreviousVideo}
                    disabled={currentIndex === 0}
                >
                    <ChevronUp className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/50 border-white/20 text-white"
                    onClick={goToNextVideo}
                    disabled={currentIndex === videos.length - 1}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
            </div> */}
        </div>
    );
};

export default VideoFeed;