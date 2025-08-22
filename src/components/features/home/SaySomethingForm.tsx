"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { addComment } from "~/lib/actions";
import axios from "axios";
import { CheckCircle } from "lucide-react";

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
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg w-96">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4 text-center">
        Say Something
      </h2>

      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        
        <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.username}</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(comment.created).toLocaleString()}
                </p>
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
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
            className="block p-2 w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's on your mind?"
            required
          ></textarea>
        </div>
        <div className="text-center">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full text-base w-full"
          >
            Submit
          </Button>
        </div>
      </form>
      {isSubmitted && (
        <div className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">Comment submitted!</p>
        </div>
      )}
    </div>
  );
}