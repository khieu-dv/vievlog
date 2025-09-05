"use client";
import { Header } from "~/components/common/Header";

export default function GamePage() {
  return (
    <div className="flex flex-col h-screen">
                  <Header className="hidden lg:block" />
      <iframe
        src="/games/index.html"
        className="flex-grow border-none"
        title="Game"
      />
    </div>
  );
}