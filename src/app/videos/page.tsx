"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "~/components/features/videos/VideoFeed";
import PocketBase from "pocketbase";
import { Loader2, Play, Eye, Clock, TrendingUp } from "lucide-react";
import { Header } from "~/components/common/Header";
import { Video } from '~/lib/types';
import { Button } from "~/components/ui/Button";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const pb = new PocketBase("https://pocketbase.vietopik.com");
        const resultList = await pb.collection("videos").getList(1, 20, {
          sort: "-created",
        });
        setVideos(resultList.items as unknown as Video[]);
        setTotalVideos(resultList.totalItems);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading amazing videos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <Play className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Video Learning Hub
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover interactive video content and tutorials
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalVideos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">HD</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
              </div>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('feed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'feed'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Play className="h-4 w-4 inline mr-2" />Feed
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Content */}
      {viewMode === 'feed' ? (
        <div className="h-screen bg-black">
          <VideoFeed videos={videos} />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {video.duration}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{video.views || 0} views</span>
                    </div>
                    <span>{new Date(video.created).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {videos.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No videos yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">Check back soon for amazing video content!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}