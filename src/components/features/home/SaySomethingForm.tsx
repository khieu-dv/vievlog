"use client";

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { addComment } from "~/lib/actions";

export function SaySomethingForm() {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 text-center">
            Say Something
        </h2>
        <form action={addComment}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="content"
              name="content"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full text-lg w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
  );
}