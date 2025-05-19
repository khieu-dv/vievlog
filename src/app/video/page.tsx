// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "../components/VideoFeed";
import PocketBase from "pocketbase";
import { Loader2 } from "lucide-react";
import { Header } from "~/ui/components/header";
import { Video } from '../../lib/types';


export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const pb = new PocketBase("https://pocketbase.vietopik.com");
        const resultList = await pb.collection("videos").getList(1, 10, {
          sort: "-created",
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
      <div className="flex min-h-screen flex-col">

        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="h-screen bg-black">
      <Header />
      <VideoFeed videos={videos} />
    </main>
  );
}