"use client";

export default function GamePage() {
  return (
    <div className="flex flex-col h-screen">
      <iframe
        src="/games/index.html"
        className="flex-grow border-none"
        title="Game"
      />
    </div>
  );
}