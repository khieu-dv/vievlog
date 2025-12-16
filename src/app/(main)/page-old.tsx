"use client";

import {
  Braces,
  Globe2,
  Server,
  Smartphone,
  Binary,
  SortAsc
} from 'lucide-react';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { RoadmapCard } from '@/components/custom/roadmap-card';
import { RoadmapMultiCard } from '@/components/custom/roadmap-multi-card';
import { RoleRoadmaps } from '@/components/custom/role-roadmaps';
import { SectionBadge } from '@/components/custom/section-badge';
import { TipItem } from '@/components/custom/tip-item';


export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Core Technologies Section */}
      <div className="border-b py-12 dark:border-b-gray-800 sm:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Master Modern Development
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Focus on five powerful technologies that will define the future of software development.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Link
                href="/docs/courses/rust/lesson_0"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-700"
              >
                <Braces className="size-4" />
                🦀 Rust
              </Link>
              <Link
                href="/docs/courses/golang/lesson_0"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
              >
                <Server className="size-4" />
                🐹 Go
              </Link>
              <Link
                href="/docs/courses/golang/lesson_0"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Binary className="size-4" />
                🧠 DSA
              </Link>
              <Link
                href="/docs/courses/nextjs/lesson_0"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-80 dark:bg-white dark:text-black"
              >
                <Globe2 className="size-4" />
                ⚡ Next.js
              </Link>
              <Link
                href="/docs/courses/flutter/lesson_0"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Smartphone className="size-4" />
                💙 Flutter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Technologies Learning Paths */}
      <div className="py-4 sm:py-8 md:py-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <SectionBadge title="Learning Paths" />
          </div>
          <div className="my-3 text-left md:my-5">
            <h2 className="mb-0 text-xl font-semibold sm:mb-1 sm:text-3xl">
              Choose Your Development Path
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Master these modern technologies for different domains of software development.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <RoadmapCard
              icon={Braces}
              title="Systems Programming"
              link="/docs/courses/rust/lesson_0"
              description="Build fast, safe system software with Rust. Perfect for performance-critical applications."
            />
            <RoadmapCard
              icon={Server}
              title="Backend & Cloud"
              link="/docs/courses/golang/lesson_0"
              description="Create scalable backends and cloud services with Go's simplicity and concurrency."
            />
            <RoadmapCard
              icon={Binary}
              title="Data Structures & Algorithms"
              link="/docs/courses/dsa/lesson_0"
              description="Master CS fundamentals with interactive examples and Rust implementations."
            />
            <RoadmapCard
              icon={Globe2}
              title="Modern Web Apps"
              link="/docs/courses/nextjs/lesson_0"
              description="Build full-stack web applications with Next.js and React ecosystem."
            />
            <RoadmapCard
              icon={Smartphone}
              title="Cross-Platform Mobile"
              link="/docs/courses/flutter/lesson_0"
              description="Develop beautiful native mobile apps for iOS and Android with Flutter."
            />
          </div>

          <p className="my-4 text-sm text-gray-500 dark:text-gray-400 sm:my-7 sm:text-base">
            Each path includes related tools and frameworks. For example, Rust ecosystem includes{" "}
            <Link
              href="/docs/courses/rust/lesson_0"
              className="font-medium underline underline-offset-2"
            >
              Actix, Tokio, Serde
            </Link>{" "}
            while Next.js covers React, TypeScript, and modern web development practices.
          </p>

          <div className="rounded-xl border p-3 dark:border-gray-800 sm:p-4">
            <h2 className="mb-0 text-lg font-semibold sm:mb-1 sm:text-xl">
              Tips for Beginners
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
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

      {/* Rust Ecosystem */}
      <RoleRoadmaps
        badge="Rust Ecosystem"
        title="Building with Rust?"
        description="Explore the powerful Rust ecosystem and related technologies for systems programming."
      >
        <RoadmapCard
          icon={Braces}
          title="Rust Fundamentals"
          link="/docs/courses/rust/lesson_0"
          description="Master ownership, borrowing, lifetimes, and Rust's unique memory safety features."
        />
        <RoadmapCard
          icon={Server}
          title="Web Development"
          link="/docs/courses/rust/lesson_0"
          description="Build web services with Actix-web, Warp, or Rocket frameworks."
        />
        <RoadmapMultiCard
          roadmaps={[{ title: "Async Programming", link: "/docs/courses/rust/lesson_0" }]}
          description="Learn async/await with Tokio, async-std for concurrent applications."
          secondaryRoadmaps={[{ title: "WebAssembly", link: "/docs/courses/rust/lesson_0" }]}
          secondaryDescription="Compile Rust to WebAssembly for high-performance web apps."
        />
      </RoleRoadmaps>

      {/* Go Ecosystem */}
      <RoleRoadmaps
        badge="Go Ecosystem"
        title="Building with Go?"
        description="Explore Go's ecosystem for backend development, microservices, and cloud-native applications."
      >
        <RoadmapCard
          icon={Server}
          title="Go Fundamentals"
          link="/docs/courses/golang/lesson_0"
          description="Master goroutines, channels, interfaces, and Go's simplicity philosophy."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Web Frameworks", link: "/docs/courses/golang/lesson_0" },
            { title: "Gin & Fiber", link: "/docs/courses/golang/lesson_0" },
          ]}
          description="Build REST APIs with Gin, Fiber, or Echo frameworks."
          secondaryRoadmaps={[{ title: "gRPC & Microservices", link: "/docs/courses/golang/lesson_0" }]}
          secondaryDescription="Learn gRPC for high-performance microservices communication."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Docker & K8s", link: "/docs/courses/golang/lesson_0" },
            { title: "Database Integration", link: "/docs/courses/golang/lesson_0" },
            { title: "Testing", link: "/docs/courses/golang/lesson_0" },
            { title: "CLI Tools", link: "/docs/courses/golang/lesson_0" },
          ]}
          description="Go excels in DevOps tooling and cloud infrastructure."
          secondaryRoadmaps={[{ title: "Concurrency Patterns", link: "/docs/courses/golang/lesson_0" }]}
          secondaryDescription="Master Go's concurrency with practical patterns."
        />
      </RoleRoadmaps>

      {/* Data Structures & Algorithms */}
      <RoleRoadmaps
        badge="Computer Science"
        title="Master Data Structures & Algorithms?"
        description="Build strong foundations in computer science with interactive examples and Rust implementations."
      >
        <RoadmapCard
          icon={Binary}
          title="Data Structures"
          link="/docs/courses/dsa/lesson_0"
          description="Master arrays, linked lists, trees, graphs, hash tables with visual examples."
        />
        <RoadmapCard
          icon={SortAsc}
          title="Algorithms"
          link="/docs/courses/dsa/lesson_0"
          description="Learn sorting, searching, graph algorithms with step-by-step implementations."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Trees & Graphs", link: "/docs/courses/dsa/lesson_0" },
            { title: "Hash Tables", link: "/docs/courses/dsa/lesson_0" },
          ]}
          description="Advanced data structures for efficient data management and retrieval."
          secondaryRoadmaps={[{ title: "Dynamic Programming", link: "/docs/courses/dsa/lesson_0" }]}
          secondaryDescription="Master complex algorithmic techniques with practical examples."
        />
      </RoleRoadmaps>

      {/* Next.js Ecosystem */}
      <RoleRoadmaps
        badge="Next.js Ecosystem"
        title="Building with Next.js?"
        description="Master modern full-stack web development with Next.js and the React ecosystem."
      >
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={Globe2}
            title="Next.js Fundamentals"
            link="/docs/courses/nextjs/lesson_0"
            description="Learn App Router, Server Components, and modern Next.js patterns."
          />
          <RoadmapCard
            icon={Braces}
            title="React & TypeScript"
            link="/docs/courses/nextjs/lesson_0"
            description="Master React 18+ features with TypeScript for type-safe development."
          />
        </div>
        <RoadmapMultiCard
          roadmaps={[
            { title: "Styling Solutions", link: "/docs/courses/nextjs/lesson_0" },
            { title: "Tailwind CSS", link: "/docs/courses/nextjs/lesson_0" },
            { title: "shadcn/ui", link: "/docs/courses/nextjs/lesson_0" },
            { title: "State Management", link: "/docs/courses/nextjs/lesson_0" },
          ]}
          description="Build beautiful UIs with modern styling and state management."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Database Integration", link: "/docs/courses/nextjs/lesson_0" },
            { title: "Authentication", link: "/docs/courses/nextjs/lesson_0" },
          ]}
          description="Full-stack features with Prisma, NextAuth, and more."
          secondaryRoadmaps={[
            { title: "Deployment", link: "/docs/courses/nextjs/lesson_0" },
            { title: "Vercel", link: "/docs/courses/nextjs/lesson_0" },
            { title: "Performance", link: "/docs/courses/nextjs/lesson_0" },
          ]}
          secondaryDescription="Deploy and optimize your Next.js applications."
        />
      </RoleRoadmaps>

      {/* Flutter Ecosystem */}
      <RoleRoadmaps
        badge="Flutter Ecosystem"
        title="Building with Flutter?"
        description="Master cross-platform mobile development with Flutter and Dart ecosystem."
      >
        <RoadmapCard
          icon={Smartphone}
          title="Flutter Fundamentals"
          link="/docs/courses/flutter/lesson_0"
          description="Learn widgets, state management, and Dart programming language."
        />
        <RoadmapCard
          icon={Smartphone}
          title="Advanced Flutter"
          link="/docs/courses/flutter/lesson_0"
          description="Master animations, custom widgets, and platform-specific features."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "State Management", link: "/docs/courses/flutter/lesson_0" },
            { title: "BLoC & Riverpod", link: "/docs/courses/flutter/lesson_0" },
            { title: "GetX & Provider", link: "/docs/courses/flutter/lesson_0" },
          ]}
          description="Choose the right state management solution for your app."
          secondaryRoadmaps={[
            { title: "Firebase Integration", link: "/docs/courses/flutter/lesson_0" },
            { title: "Native Features", link: "/docs/courses/flutter/lesson_0" },
            { title: "App Store Deployment", link: "/docs/courses/flutter/lesson_0" },
          ]}
          secondaryDescription="Integrate backend services and deploy to app stores."
        />
      </RoleRoadmaps>

      {/* Explore More Section */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-5 mb-12 rounded-3xl p-5">
          <h2 className="mb-0.5 text-xl font-semibold text-white sm:mb-1 sm:text-2xl">
            Start Your Journey!
          </h2>
          <p className="text-sm text-gray-400 sm:text-base">
            Ready to dive deep into modern development technologies?
          </p>

          <div className="my-4 grid grid-cols-1 gap-2 sm:my-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
            <Link
              href="/docs/courses/rust/lesson_0"
              className="grow rounded-lg bg-gradient-to-br from-orange-700 to-orange-600 p-4 text-sm text-white transition-all hover:from-orange-600 hover:to-orange-600 sm:text-base"
            >
              <Braces className="mb-3 h-5 w-5 text-orange-200 sm:mb-2" />
              🦀 Rust Mastery
            </Link>
            <Link
              href="/docs/courses/golang/lesson_0"
              className="grow rounded-lg bg-gradient-to-br from-cyan-700 to-cyan-600 p-4 text-sm text-white transition-all hover:from-cyan-600 hover:to-cyan-600 sm:text-base"
            >
              <Server className="mb-3 h-5 w-5 text-cyan-200 sm:mb-2" />
              🐹 Go Development
            </Link>
            <Link
              href="/docs/courses/golang/lesson_0"
              className="grow rounded-lg bg-gradient-to-br from-purple-700 to-purple-600 p-4 text-sm text-white transition-all hover:from-purple-600 hover:to-purple-600 sm:text-base"
            >
              <Binary className="mb-3 h-5 w-5 text-purple-200 sm:mb-2" />
              🧠 DSA Mastery
            </Link>
            <Link
              href="/docs/courses/nextjs/lesson_0"
              className="grow rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-sm text-white transition-all hover:from-gray-700 hover:to-gray-700 sm:text-base"
            >
              <Globe2 className="mb-3 h-5 w-5 text-gray-300 sm:mb-2" />
              ⚡ Next.js Pro
            </Link>
            <Link
              href="/docs/courses/flutter/lesson_0"
              className="grow rounded-lg bg-gradient-to-br from-blue-700 to-blue-600 p-4 text-sm text-white transition-all hover:from-blue-600 hover:to-blue-600 sm:text-base"
            >
              <Smartphone className="mb-3 h-5 w-5 text-blue-200 sm:mb-2" />
              💙 Flutter Expert
            </Link>
          </div>
          <p className="text-sm text-gray-400 sm:text-base">
            Each path includes comprehensive{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              tutorials
            </Link>{" "}
            and{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              hands-on projects
            </Link>{" "}
            to build real-world expertise.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}