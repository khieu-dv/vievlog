"use client";

import {
  Blocks,
  Bot,
  Braces,
  CheckSquare,
  Coins,
  Component,
  FolderKanban,
  Gamepad2,
  GitBranch,
  Globe2,
  GraduationCap,
  Megaphone,
  MessageCircle,
  MessageCircleCode,
  PenSquare,
  Server,
  ServerCog,
  Shield,
  ShieldHalf,
  Smartphone,
  SquareKanban,
  UsersRound,
  Waypoints,
  Workflow,
  ArrowRight
} from 'lucide-react';
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { Button } from "~/components/ui/Button";
import { RoadmapCard } from "~/components/ui/RoadmapCard";
import { RoadmapMultiCard } from "~/components/ui/RoadmapMultiCard";
import { RoleRoadmaps } from "~/components/ui/RoleRoadmaps";
import { SectionBadge } from "~/components/ui/SectionBadge";
import { TipItem } from "~/components/ui/TipItem";


export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* AI Chat Section */}
      <div className="border-b bg-gradient-to-b from-gray-200 to-white py-12 sm:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Bot className="mb-4 size-8 text-black sm:size-12" />
            <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl">
              Get AI-Powered Learning Guidance
            </h2>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">
              Our AI Tutor analyzes your experience, suggests relevant roadmaps, and
              provides detailed answers to help you progress in your tech career.
            </p>
            <Link
              href="/ai/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-80 sm:px-6 sm:py-3 sm:text-base"
            >
              <MessageCircle className="size-3 fill-current sm:size-5" />
              Chat with AI Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* Beginner Roadmaps */}
      <div className="bg-gradient-to-b from-gray-200 to-white py-4 sm:py-8 md:py-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <SectionBadge title="Beginner Roadmaps" />
          </div>
          <div className="my-3 text-left md:my-5">
            <h2 className="mb-0 text-xl font-semibold sm:mb-1 sm:text-3xl">
              Are you an Absolute beginner?
            </h2>
            <p className="text-sm text-gray-500 sm:text-base">
              Here are some beginner friendly roadmaps you should start with.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <RoadmapCard
              icon={Globe2}
              title="Frontend Developer"
              link="/docs"
              description="Develop the part of web apps that users interact with i.e. things rendered in the browser."
            />
            <RoadmapCard
              icon={ServerCog}
              title="Backend Developer"
              link="/docs"
              description="Develop the part hidden from the user e.g. things like APIs, databases, search engines etc."
            />
            <RoadmapCard
              icon={Globe2}
              icon2={ServerCog}
              title="Full Stack Developer"
              link="/docs"
              description="Develop both the frontend and backend side of the web apps i.e. the whole development stack."
            />
          </div>

          <p className="my-4 text-sm sm:my-7 sm:text-base">
            There is also a{" "}
            <Link
              href="/docs"
              className="font-medium underline underline-offset-2"
            >
              beginner DevOps roadmap
            </Link>{" "}
            which requires you to have some backend knowledge and entails a lot of
            operations work i.e. deploying, scaling, monitoring, and maintaining applications.
          </p>

          <div className="rounded-xl border bg-white p-3 sm:p-4">
            <h2 className="mb-0 text-lg font-semibold sm:mb-1 sm:text-xl">
              Tips for Beginners
            </h2>
            <p className="text-sm sm:text-base">
              Learning to code can be overwhelming, here are some tips to help you
              get started:
            </p>

            <div className="mt-3 flex flex-col gap-1">
              <TipItem
                title="Avoid Tutorial Hell"
                description="Don't get stuck in tutorial hell. It's easy to get caught up in tutorials and never actually build anything. Tutorials are great for learning, but the best way to learn is by doing. An example of this is to watch a project-based tutorial, code along with the instructor. After finishing the tutorial, try to build the same project from scratch without the tutorial (if you can't, it's okay to go back to the tutorial). Repeat this process until you can build the project without the tutorial. After that, try to add new features to the project or build something similar from scratch."
              />
              <TipItem
                title="Consistent study habits"
                description="Commit to regular, consistent study sessions. It's better to study for 30 minutes every day than to cram for 10 hours once a week."
              />
              <TipItem
                title="Set a clear goal"
                description="Establish a clear, significant goal that motivates you. It could be building a company, an app, a website, or anything that personally resonates with you."
              />
              <TipItem
                title="Embrace the marathon mindset"
                description="You will feel lost in the beginning. Avoid comparing yourself to others; everyone progresses at their own pace. Understand that challenges are part of the journey, and it's okay to take your time."
              />
              <TipItem
                title="Build projects"
                description="The best way to learn is by doing. Start building projects as soon as possible. It's okay if they're simple at first; the goal is to learn and improve. Build upon code-alongs and tutorials to create your projects and learn through hands-on experience"
              />
              <TipItem
                title="Learn to get unstuck"
                description="Once you start learning to code, you're going to run into problems that you don't know how to solve. This is normal and part of the process. You don't really learn unless you struggle through it. That said, you won't always be able to move forward without some help. So how do you find that help? First off, forget books. They aren't a great place to start here, because the number and types of errors they can cover is so small. Online is the easiest place to find help. Most devs look for solutions on StackOverflow or just google the error message (if they have one). Other solutions are to find newsgroups or forums dedicated to the language you're using."
              />
              <TipItem
                title="Join a community"
                description="Join a community of learners, such as a local coding group, a Discord server, or a subreddit. It's a great way to get help, share your progress, and learn from others."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Self-taught Developer */}
      <RoleRoadmaps
        badge="Self-taught Developer"
        title="Are you a self-taught developer?"
        description="How about taking a peek at the Computer Science roadmap aimed at self-taught developers?"
      >
        <RoadmapCard
          icon={GraduationCap}
          title="Computer Science"
          link="/docs"
          description="Learn the fundamental concepts of computer science and programming."
        />
        <RoadmapCard
          icon={Blocks}
          title="Data Structures"
          link="/docs"
          description="Learn all about data structures and algorithms."
        />
        <RoadmapMultiCard
          roadmaps={[{ title: "System Design", link: "/docs" }]}
          description="Learn how to design large scale systems and prepare for system design interviews."
          secondaryRoadmaps={[{ title: "Design and Architecture", link: "/docs" }]}
          secondaryDescription="Or learn how to design and architect software systems."
        />
      </RoleRoadmaps>

      {/* Frontend Developer */}
      <RoleRoadmaps
        badge="Frontend Developer"
        title="Are you a Frontend Developer?"
        description="How about skimming through the frontend or JavaScript roadmaps to see if there is anything you missed? TypeScript is all the rage these days, maybe it is time to learn it?"
      >
        <RoadmapCard
          icon={Globe2}
          title="Frontend"
          link="/docs"
          description="Learn all you need to know to become a frontend developer."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "JavaScript", link: "/docs" },
            { title: "TypeScript", link: "/docs" },
          ]}
          description="How about mastering the language of the web: JavaScript? or maybe TypeScript?"
          secondaryRoadmaps={[{ title: "Frontend Performance", link: "/docs" }]}
          secondaryDescription="Or learn how to improve the performance of your web apps?"
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "React", link: "/docs" },
            { title: "Vue", link: "/docs" },
            { title: "Angular", link: "/docs" },
            { title: "Next.js", link: "/docs" },
          ]}
          description="Or learn a framework?"
          secondaryRoadmaps={[{ title: "Design Systems", link: "/docs" }]}
          secondaryDescription="or learn about design systems?"
        />
      </RoleRoadmaps>

      {/* Backend Developer */}
      <RoleRoadmaps
        badge="Backend Developer"
        title="Are you a Backend Developer?"
        description="Explore the general backend roadmap or dive into a specific technology like Node.js, Python, Java etc"
      >
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={ServerCog}
            title="Backend"
            link="/docs"
            description="Learn all you need to know to become a backend developer."
          />
          <RoadmapCard
            icon={Braces}
            title="API Design"
            link="/docs"
            description="Learn all you need to know to design robust APIs."
          />
        </div>
        <RoadmapMultiCard
          roadmaps={[
            { title: "Node.js", link: "/docs" },
            { title: "PHP", link: "/docs" },
            { title: "Rust", link: "/docs" },
            { title: "Go", link: "/docs" },
            { title: "Python", link: "/docs" },
            { title: "Java", link: "/docs" },
            { title: "ASP.NET Core", link: "/docs" },
            { title: "C++", link: "/docs" },
          ]}
          description="Or learn a specific technology?"
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "System Design", link: "/docs" },
            { title: "Design and Architecture", link: "/docs" },
          ]}
          description="How about improving your System Design skills?"
          secondaryRoadmaps={[
            { title: "SQL", link: "/docs" },
            { title: "PostgreSQL", link: "/docs" },
            { title: "MongoDB", link: "/docs" },
            { title: "Redis", link: "/docs" },
          ]}
          secondaryDescription="Or perhaps improve your database skills?"
        />
      </RoleRoadmaps>

      {/* DevOps Engineer */}
      <RoleRoadmaps
        badge="DevOps Engineer"
        title="DevOps or a Wanna-be DevOps Engineer?"
        description="Explore the general DevOps roadmap or dive into a specific technology like Docker, Kubernetes etc"
      >
        <RoadmapCard
          icon={Server}
          title="DevOps"
          link="/docs"
          description="Learn all you need to know to become a DevOps Engineer."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "AWS", link: "/docs" },
            { title: "Cloudflare", link: "/docs" },
          ]}
          description="or perhaps you want to learn AWS or Cloudflare?"
          secondaryRoadmaps={[{ title: "Terraform", link: "/docs" }]}
          secondaryDescription="Or learn to automate your infrastructure using Terraform?"
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Docker", link: "/docs" },
            { title: "Kubernetes", link: "/docs" },
            { title: "Linux", link: "/docs" },
          ]}
          description="or perhaps you want to learn Docker, Kubernetes or Linux?"
          secondaryRoadmaps={[
            { title: "Python", link: "/docs" },
            { title: "Go", link: "/docs" },
            { title: "Rust", link: "/docs" },
          ]}
          secondaryDescription="Or maybe improve your automation skills?"
        />
      </RoleRoadmaps>

      {/* Mobile Developer */}
      <RoleRoadmaps
        badge="Mobile Developer"
        title="Are you a Mobile Developer?"
        description="How about beefing up your mobile development skills?"
      >
        <RoadmapCard
          icon={Smartphone}
          title="Android"
          link="/docs"
          description="Learn all you need to know to become an Android Developer."
        />
        <RoadmapCard
          icon={Smartphone}
          title="iOS"
          link="/docs"
          description="Learn all you need to know to become an iOS Developer."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "React Native", link: "/docs" },
            { title: "Flutter", link: "/docs" },
          ]}
          description="Or learn a cross-platform framework?"
        />
      </RoleRoadmaps>

      {/* AI and Machine Learning */}
      <RoleRoadmaps
        badge="AI and Machine Learning"
        title="Are you an AI or Machine Learning enthusiast?"
        description="How about diving into the AI or Machine Learning roadmaps?"
      >
        <RoadmapCard
          icon={Bot}
          title="Machine Learning"
          link="/docs"
          description="Learn all you need to know to become an ML Engineer."
        />
        <RoadmapCard
          icon={Bot}
          title="AI and Data Science"
          link="/docs"
          description="Learn all you need to know to become an AI or Data Scientist."
        />
        <RoadmapCard
          icon={Bot}
          title="AI Engineer"
          link="/docs"
          description="Learn all you need to become an AI Engineer."
        />
        <RoadmapCard
          icon={ServerCog}
          title="AI Agents"
          link="/docs"
          description="Learn how to design, build and ship AI agents in 2025."
        />
        <RoadmapCard
          icon={Bot}
          title="Data Analyst"
          link="/docs"
          description="Learn all you need to know to become a Data Analyst."
        />
        <RoadmapCard
          icon={Bot}
          title="BI Analyst"
          link="/docs"
          description="Learn to become a Business Intelligence Analyst in 2025."
        />
      </RoleRoadmaps>

      {/* More Roles */}
      <RoleRoadmaps
        badge="More Roles"
        title="Fancy something else?"
        description="Explore the following roadmaps about UX, Game Development, Software Architect and more"
      >
        <div className="flex flex-col justify-start gap-3">
          <RoadmapCard
            icon={ShieldHalf}
            title="Cyber Security"
            link="/docs"
            description="Learn to become a Cyber Security Expert."
          />
          <RoadmapCard
            icon={Workflow}
            title="UX Designer"
            link="/docs"
            description="Learn all you need to know to become a UX Designer."
          />
          <RoadmapCard
            icon={Coins}
            title="Blockchain"
            link="/docs"
            description="Learn all you need to know to become a Blockchain Developer."
          />
        </div>
        <div className="flex flex-col justify-start gap-3">
          <RoadmapCard
            icon={Gamepad2}
            title="Game Development"
            link="/docs"
            description="Learn all you need to know to become a Game Developer."
          />
          <RoadmapCard
            icon={PenSquare}
            title="Technical Writer"
            link="/docs"
            description="Learn all you need to know to become a Technical Writer."
          />
          <RoadmapCard
            icon={Megaphone}
            title="DevRel Engineer"
            link="/docs"
            description="Learn all you need to know to become a DevRel Engineer."
          />
        </div>
        <div className="flex flex-col justify-start gap-3">
          <RoadmapCard
            icon={FolderKanban}
            title="Product Manager"
            link="/docs"
            description="Learn all you need to know to become a Project Manager."
          />
          <RoadmapCard
            icon={Component}
            title="Software Architect"
            link="/docs"
            description="Learn all you need to know to become a Software Architect."
          />
          <RoadmapCard
            icon={GitBranch}
            title="Git and GitHub"
            link="/docs"
            description="Learn all you need to know to become a Git and GitHub expert."
          />
        </div>
      </RoleRoadmaps>

      {/* There is more section */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-5 mb-12 rounded-3xl bg-black p-5">
          <h2 className="mb-0.5 text-xl font-semibold text-white sm:mb-1 sm:text-2xl">
            There is more!
          </h2>
          <p className="text-sm text-gray-400 sm:text-base">
            We have a lot more content for you to explore.
          </p>

          <div className="my-4 grid grid-cols-1 gap-2 sm:my-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            <Link
              href="/docs"
              className="grow rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-sm text-white transition-all hover:from-gray-700 hover:to-gray-700 sm:text-base"
            >
              <Waypoints className="mb-3 h-5 w-5 text-gray-500 sm:mb-2" />
              Explore all Roadmaps
            </Link>
            <Link
              href="/docs"
              className="grow rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-sm text-white transition-all hover:from-gray-700 hover:to-gray-700 sm:text-base"
            >
              <CheckSquare className="mb-3 h-5 w-5 text-gray-500 sm:mb-2" />
              Explore Best Practices
            </Link>
            <Link
              href="/docs"
              className="grow rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-sm text-white transition-all hover:from-gray-700 hover:to-gray-700 sm:text-base"
            >
              <CheckSquare className="mb-3 h-5 w-5 text-gray-500 sm:mb-2" />
              Explore Questions
            </Link>
          </div>
          <p className="text-sm text-gray-400 sm:text-base">
            Or visit our{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              guides
            </Link>{" "}
            and{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              videos
            </Link>{" "}
            for long-form content.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}