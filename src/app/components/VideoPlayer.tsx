// components/VideoPlayer.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Loader2, Play, Pause } from "lucide-react";

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

interface VideoPlayerProps {
    video: Video;
    isPlaying: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isPlaying }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [videoAspectRatio, setVideoAspectRatio] = useState(9 / 16); // Default aspect ratio (portrait)
    const [videoStyles, setVideoStyles] = useState({});

    // Handle play/pause based on visibility and user control
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isPlaying && !isPaused) {
            // Preload the video when it becomes active
            videoElement.preload = "auto";

            // Try to play the video
            const playPromise = videoElement.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Auto-play started successfully
                    })
                    .catch(err => {
                        // Auto-play was prevented, likely due to browser policy
                        console.error("Playback prevented:", err);
                        // Mark as paused since we couldn't autoplay
                        setIsPaused(true);
                    });
            }
        } else {
            // Pause the video when it's not in view or paused by user
            videoElement.pause();

            // Reset the video to beginning if it's no longer the active one
            if (!isPlaying) {
                videoElement.currentTime = 0;
                videoElement.preload = "none";
            }
        }

        // Clean up function
        return () => {
            if (videoElement && !isPlaying) {
                videoElement.pause();
            }
        };
    }, [isPlaying, isPaused]);

    // Handle video loading events
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleLoadStart = () => {
            setLoading(true);
            setError(null);
        };

        const handleLoadedData = () => {
            setLoading(false);

            // Get video's natural dimensions to calculate aspect ratio
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;

            if (videoWidth && videoHeight) {
                setVideoAspectRatio(videoWidth / videoHeight);
            }
        };

        const handleError = () => {
            setLoading(false);
            setError("Failed to load video");
        };

        const handleEnded = () => {
            // Loop the video when it ends
            if (videoElement && isPlaying && !isPaused) {
                videoElement.currentTime = 0;
                videoElement.play().catch(err => console.error("Replay failed:", err));
            }
        };

        videoElement.addEventListener("loadstart", handleLoadStart);
        videoElement.addEventListener("loadeddata", handleLoadedData);
        videoElement.addEventListener("error", handleError);
        videoElement.addEventListener("ended", handleEnded);

        return () => {
            videoElement.removeEventListener("loadstart", handleLoadStart);
            videoElement.removeEventListener("loadeddata", handleLoadedData);
            videoElement.removeEventListener("error", handleError);
            videoElement.removeEventListener("ended", handleEnded);
        };
    }, [isPlaying, isPaused]);

    // Calculate video sizing to maintain aspect ratio
    useEffect(() => {
        const updateVideoSize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const containerRatio = containerWidth / containerHeight;

            let width = '100%';
            let height = '100%';

            // If video is wider than container (landscape video)
            if (videoAspectRatio > containerRatio) {
                width = '100%';
                height = `${(containerWidth / videoAspectRatio)}px`;
            }
            // If video is taller than container (portrait video)
            else {
                height = '100%';
                width = `${containerHeight * videoAspectRatio}px`;
            }

            setVideoStyles({
                width,
                height,
                maxWidth: '100%',
                maxHeight: '100%'
            });
        };

        updateVideoSize();

        // Recalculate on window resize
        window.addEventListener('resize', updateVideoSize);
        return () => window.removeEventListener('resize', updateVideoSize);
    }, [videoAspectRatio]);

    // Toggle mute state
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    // Toggle play/pause state
    const togglePlayPause = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isPaused) {
            videoElement.play().catch(err => console.error("Play failed:", err));
            setIsPaused(false);
        } else {
            videoElement.pause();
            setIsPaused(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full bg-black overflow-hidden flex items-center justify-center"
        >
            {/* Video thumbnail as fallback/placeholder */}
            {video.thumbnail_url && (
                <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ display: loading ? "block" : "none" }}
                />
            )}

            {/* Loading indicator */}
            {loading && isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <p className="text-white text-center p-4">{error}</p>
                </div>
            )}

            {/* The actual video */}
            <video
                ref={videoRef}
                src={video.video_url}
                className="object-contain z-10"
                style={videoStyles}
                playsInline
                muted={isMuted}
                loop
                controls={false}
                poster={video.thumbnail_url}
            />

            {/* Play/pause button overlay (shows briefly when tapping) */}
            <div
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                onClick={togglePlayPause}
            >
                {isPaused && (
                    <div className="bg-black/40 rounded-full p-4 animate-fade-in">
                        <Play className="h-16 w-16 text-white" />
                    </div>
                )}
            </div>

            {/* Control buttons */}
            <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-30">
                {/* Mute/unmute button */}
                <button
                    className="bg-black/60 rounded-full p-3"
                    onClick={toggleMute}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                    )}
                </button>

                {/* Play/pause button */}
                <button
                    className="bg-black/60 rounded-full p-3"
                    onClick={togglePlayPause}
                >
                    {isPaused ? (
                        <Play className="h-6 w-6 text-white" />
                    ) : (
                        <Pause className="h-6 w-6 text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;