"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Braces,
  Globe2,
  Server,
  Smartphone,
  Binary,
  Sparkles,
  Rocket,
  Target,
  Users,
  BookOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const technologies = [
  {
    name: "Rust",
    emoji: "🦀",
    href: "/docs/courses/rust/lesson_0",
    icon: Braces,
    color: "bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 text-white",
    description: "Systems programming with memory safety"
  },
  {
    name: "Go",
    emoji: "🐹",
    href: "/docs/courses/golang/lesson_0",
    icon: Server,
    color: "bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-600 text-white",
    description: "Simple, fast, and reliable backend development"
  },
  {
    name: "DSA",
    emoji: "🧠",
    href: "/docs/courses/dsa/lesson_0",
    icon: Binary,
    color: "bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white",
    description: "Computer science fundamentals"
  },
  {
    name: "Next.js",
    emoji: "⚡",
    href: "/docs/courses/nextjs/lesson_0",
    icon: Globe2,
    color: "bg-foreground hover:bg-foreground/80 text-background",
    description: "Modern full-stack web framework"
  },
  {
    name: "Flutter",
    emoji: "💙",
    href: "/docs/courses/flutter/lesson_0",
    icon: Smartphone,
    color: "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white",
    description: "Cross-platform mobile development"
  },
];

const learningPaths = [
  {
    title: "Systems Programming",
    description: "Build fast, safe system software with Rust. Perfect for performance-critical applications.",
    icon: Braces,
    link: "/docs/courses/rust/lesson_0",
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    title: "Backend & Cloud",
    description: "Create scalable backends and cloud services with Go's simplicity and concurrency.",
    icon: Server,
    link: "/docs/courses/golang/lesson_0",
    color: "text-cyan-600 dark:text-cyan-400"
  },
  {
    title: "Data Structures",
    description: "Master CS fundamentals with interactive examples and implementations.",
    icon: Binary,
    link: "/docs/courses/dsa/lesson_0",
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Modern Web Apps",
    description: "Build full-stack web applications with Next.js and React ecosystem.",
    icon: Globe2,
    link: "/docs/courses/nextjs/lesson_0",
    color: "text-foreground"
  },
  {
    title: "Cross-Platform Mobile",
    description: "Develop beautiful native mobile apps for iOS and Android with Flutter.",
    icon: Smartphone,
    link: "/docs/courses/flutter/lesson_0",
    color: "text-blue-600 dark:text-blue-400"
  },
];

const tips = [
  {
    title: "Avoid Tutorial Hell",
    description: "Don't get stuck in tutorial hell. Build projects while learning, then rebuild them from scratch without the tutorial."
  },
  {
    title: "Consistent Study Habits",
    description: "Commit to regular sessions. 30 minutes daily beats 10 hours weekly."
  },
  {
    title: "Set Clear Goals",
    description: "Establish meaningful goals that motivate you - a company, app, or project."
  },
  {
    title: "Build Projects",
    description: "The best way to learn is by doing. Start building as soon as possible."
  },
  {
    title: "Join a Community",
    description: "Connect with other learners on Discord, Reddit, or local coding groups."
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b py-16 sm:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4" variant="outline">
              <Sparkles className="mr-1 h-3 w-3" />
              Modern Development Platform
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Master Modern Development
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Focus on five powerful technologies that will define the future of software development.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {technologies.map((tech) => (
                <HoverCard key={tech.name}>
                  <HoverCardTrigger asChild>
                    <Link
                      href={tech.href}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-105 ${tech.color}`}
                    >
                      <tech.icon className="h-4 w-4" />
                      {tech.emoji} {tech.name}
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Badge className="mb-4" variant="secondary">
              <Target className="mr-1 h-3 w-3" />
              Learning Paths
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              Choose Your Development Path
            </h2>
            <p className="text-lg text-muted-foreground">
              Master these modern technologies for different domains of software development.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <Card key={path.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <path.icon className={`h-10 w-10 ${path.color}`} />
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">
                    <Link href={path.link} className="hover:underline">
                      {path.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{path.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Each path includes related tools and frameworks. For example, Rust ecosystem includes{" "}
                <Link
                  href="/docs/courses/rust/lesson_0"
                  className="font-medium text-primary hover:underline"
                >
                  Actix, Tokio, Serde
                </Link>{" "}
                while Next.js covers React, TypeScript, and modern web development practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Tips for Beginners Section */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="mb-4" variant="secondary">
              <Rocket className="mr-1 h-3 w-3" />
              Getting Started
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              Tips for Beginners
            </h2>
            <p className="text-lg text-muted-foreground">
              Learning to code can be overwhelming, here are some tips to help you get started.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {tips.map((tip, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold">{tip.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground pl-7">
                    {tip.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Separator />

      {/* Ecosystems Section */}
      <section className="py-16 sm:py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Badge className="mb-4" variant="secondary">
              <BookOpen className="mr-1 h-3 w-3" />
              Technology Ecosystems
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              Explore Tech Ecosystems
            </h2>
            <p className="text-lg text-muted-foreground">
              Deep dive into frameworks, tools, and best practices for each technology.
            </p>
          </div>

          <Tabs defaultValue="rust" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-muted">
              <TabsTrigger value="rust">🦀 Rust</TabsTrigger>
              <TabsTrigger value="go">🐹 Go</TabsTrigger>
              <TabsTrigger value="nextjs">⚡ Next.js</TabsTrigger>
            </TabsList>

            <TabsContent value="rust" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Rust Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Master ownership, borrowing, lifetimes, and memory safety.
                    </CardDescription>
                    <Link href="/docs/courses/rust/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Web Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Build web services with Actix-web, Warp, or Rocket.
                    </CardDescription>
                    <Link href="/docs/courses/rust/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Async & WebAssembly</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Learn Tokio for async programming and compile to WASM.
                    </CardDescription>
                    <Link href="/docs/courses/rust/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="go" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Go Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Master goroutines, channels, and Go's simplicity.
                    </CardDescription>
                    <Link href="/docs/courses/golang/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Web Frameworks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Build REST APIs with Gin, Fiber, or Echo frameworks.
                    </CardDescription>
                    <Link href="/docs/courses/golang/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cloud & DevOps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Docker, Kubernetes, and microservices with gRPC.
                    </CardDescription>
                    <Link href="/docs/courses/golang/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nextjs" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Next.js & React</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Server components, routing, and modern React patterns.
                    </CardDescription>
                    <Link href="/docs/courses/nextjs/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>TypeScript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Type-safe development with TypeScript best practices.
                    </CardDescription>
                    <Link href="/docs/courses/nextjs/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Full-Stack Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      API routes, database integration, and deployment.
                    </CardDescription>
                    <Link href="/docs/courses/nextjs/lesson_0" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
