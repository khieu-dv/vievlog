"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "../../components/features/videos/VideoFeed";
import PocketBase from "pocketbase";
import { Play } from "lucide-react";
import { Header } from "../../components/common/Header";
import { Video } from '../../lib/types';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const pb = new PocketBase("https://pocketbase.vietopik.com");
        const resultList = await pb.collection("videos").getList(1, 20, {
          sort: "created",
        });
        setVideos(resultList.items as unknown as Video[]);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="text-lg font-medium text-white">Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <Play className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Oops! Something went wrong</h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <Header />
      <div style={{ height: 'calc(100vh - 56px)' }}>
        <VideoFeed videos={videos} />
      </div>
    </div>
  );
}