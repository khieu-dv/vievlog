"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { addComment } from "~/lib/actions";
import axios from "axios";
import { CheckCircle, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  content: string;
  created: string;
}

export function SaySomethingForm() {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/collections/home_comments_tbl/records`,
        {
          params: {
            sort: '-created', // Sort by creation date, newest first
            perPage: 100, // Fetch a reasonable number of comments
          },
        }
      );
      setComments(response.data.items);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();

    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(interval);
            setIsSubmitting(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setCountdown(10);
    const formData = new FormData(event.currentTarget);
    await addComment(formData);
    setUsername("");
    setContent("");
    fetchComments(); // Re-fetch comments after submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000); // Hide message after 3 seconds
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 w-96 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Say Something
        </h2>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        
        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-blue-300/50 scrollbar-track-transparent">
          {comments.length === 0 ? (
            <div className="text-center py-6">
              <MessageSquare className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Be the first to share!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg shadow-sm border border-gray-100/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.username}</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 line-clamp-2">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="username"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block w-full p-3 transition-all duration-200 hover:bg-white dark:hover:bg-gray-800"
            placeholder="Your name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="content"
            name="content"
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block p-3 w-full text-sm text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none transition-all duration-200 hover:bg-white dark:hover:bg-gray-800"
            placeholder="What's on your mind?"
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending... ({countdown}s)</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </Button>
          <div className="h-8">
            {isSubmitted && (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400 animate-bounce">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="text-sm font-medium">Shared!</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}