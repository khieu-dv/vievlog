// components/VideoInfo.tsx
import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../../ui/primitives/button";

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

interface VideoInfoProps {
    video: Video;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video }) => {
    return (
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
            <div className="flex justify-between items-end">
                <div className="max-w-3/4">
                    <h2 className="text-lg font-bold truncate">{video.title}</h2>
                    <p className="text-sm opacity-90 mb-2">@{video.author}</p>
                    <p className="text-xs line-clamp-2">{video.description}</p>
                    {video.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {video.tags.split(",").map((tag, index) => (
                                <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white">
                        <Heart className="h-6 w-6" />
                        <span className="text-xs mt-1">{video.likes}</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white">
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-xs mt-1">0</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="rounded-full bg-black/40 text-white">
                        <Share2 className="h-6 w-6" />
                        <span className="text-xs mt-1">Share</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VideoInfo;