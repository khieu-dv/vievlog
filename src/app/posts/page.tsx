// app/posts/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "~/ui/components/header";
import { Footer } from "~/ui/components/footer";
import { PostCard } from "../components/PostCard";
import { Button } from "~/ui/primitives/button";
import { useTranslation } from "react-i18next";

export default function PostsPage() {
    const { t } = useTranslation();
    interface Post {
        id: string;
        title: string;
        excerpt: string;
        content: string;
        publishedAt: string;
        coverImage: string;
        author: {
            name: string;
            avatar: string;
        };
        likes: number;
        commentCount: number;
        tags: string[];
    }

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real application, you would fetch from an API
        // This is mock data for demonstration
        setTimeout(() => {
            setPosts([
                {
                    id: "1",
                    title: "Getting Started with TOPIK I: A Beginner's Guide",
                    excerpt: "TOPIK I is designed for beginners to intermediate Korean language learners. This guide will help you understand what to expect and how to prepare effectively for the test.",
                    content: "TOPIK I is designed for beginners to intermediate Korean language learners. This guide will help you understand what to expect and how to prepare effectively for the test. The TOPIK I test consists of two sections: Listening and Reading. Each section tests different aspects of your Korean language proficiency.\n\nIn the Listening section, you'll be tested on your ability to understand spoken Korean in various contexts, from simple conversations to announcements and short talks. The Reading section assesses your ability to read and understand written Korean, including vocabulary, grammar, and comprehension.\n\nTo prepare for TOPIK I, it's recommended to:\n1. Study basic Korean vocabulary and grammar\n2. Practice listening to Korean conversations, news, or podcasts\n3. Read Korean texts regularly, from simple sentences to short paragraphs\n4. Take practice tests to familiarize yourself with the test format\n5. Join study groups or language exchange programs to practice with others",
                    publishedAt: "2025-03-15T10:00:00Z",
                    coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                    author: {
                        name: "Min-Ji Kim",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    likes: 42,
                    commentCount: 8,
                    tags: ["TOPIK I", "Beginner", "Study Guide"]
                },
                {
                    id: "2",
                    title: "Advanced Korean Grammar Patterns for TOPIK II",
                    excerpt: "This post explores complex grammar patterns that frequently appear in TOPIK II tests. Master these patterns to improve your score significantly.",
                    content: "This post explores complex grammar patterns that frequently appear in TOPIK II tests. Master these patterns to improve your score significantly.\n\nTOPIK II tests advanced Korean language skills, and a solid understanding of complex grammar patterns is essential for achieving a high score. Here, we'll dive into some of the most frequently tested grammar patterns in the TOPIK II exam.\n\n1. -는 바와 같이 (as mentioned earlier/as stated)\n2. -는 한 (as long as/to the extent that)\n3. -는 커녕 (far from/let alone)\n4. -는 반면에 (while/whereas)\n5. -더니만 (had been doing and then)\n\nEach of these patterns has specific usage rules and nuances that you need to understand to use them correctly. We'll examine each pattern in detail, providing examples and practice exercises to help you master them.",
                    publishedAt: "2025-03-10T14:30:00Z",
                    coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                    author: {
                        name: "Sung-Ho Park",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    likes: 35,
                    commentCount: 12,
                    tags: ["TOPIK II", "Advanced", "Grammar"]
                },
                {
                    id: "3",
                    title: "Common Mistakes to Avoid in TOPIK Reading Section",
                    excerpt: "Learn about the typical errors made by test-takers in the reading comprehension section and how to avoid them in your preparation.",
                    content: "Learn about the typical errors made by test-takers in the reading comprehension section and how to avoid them in your preparation.\n\nThe reading section of the TOPIK test can be challenging, especially under time pressure. Many test-takers make common mistakes that can be easily avoided with proper awareness and preparation. Here are the most frequent errors to watch out for:\n\n1. Misinterpreting the question: Always read the question carefully to understand exactly what is being asked.\n\n2. Falling for distractors: Test creators often include answer choices that contain words from the text but don't actually answer the question.\n\n3. Focusing too much on unknown words: Don't get stuck on vocabulary you don't know. Try to understand the overall meaning from context.\n\n4. Poor time management: The reading section requires efficient time use. Don't spend too much time on difficult questions.\n\n5. Ignoring context clues: The surrounding sentences often provide important context for understanding difficult passages.\n\nBy being aware of these common pitfalls and practicing strategies to avoid them, you can significantly improve your performance on the TOPIK reading section.",
                    publishedAt: "2025-03-05T09:15:00Z",
                    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                    author: {
                        name: "Ji-Woo Lee",
                        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    likes: 27,
                    commentCount: 6,
                    tags: ["TOPIK", "Reading", "Test Preparation"]
                },
                {
                    id: "4",
                    title: "Listening Comprehension Strategies for TOPIK",
                    excerpt: "This article provides effective strategies to enhance your listening skills for the TOPIK exam, including practice resources and tips.",
                    content: "This article provides effective strategies to enhance your listening skills for the TOPIK exam, including practice resources and tips.\n\nListening comprehension is a crucial part of the TOPIK exam, and many test-takers find it challenging. Here are some strategies to improve your listening skills:\n\n1. **Active Listening**: Practice active listening by focusing on the speaker's tone, intonation, and context clues.\n2. **Use Authentic Materials**: Listen to Korean podcasts, news broadcasts, and conversations to familiarize yourself with different accents and speaking speeds.\n3. **Practice with Mock Tests**: Take practice tests under timed conditions to simulate the exam environment.\n4. **Note-taking**: Develop a note-taking system that works for you. Jot down key points while listening to help retain information.\n5. **Review and Reflect**: After listening exercises, review what you understood and identify areas for improvement.",
                    publishedAt: "2025-02-28T11:45:00Z",
                    coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                    author: {
                        name: "Hye-Jin Choi",
                        avatar: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    likes: 50,
                    commentCount: 15,
                    tags: ["TOPIK", "Listening", "Strategies"]
                },
                {
                    id: "5",
                    title: "Writing Tips for TOPIK II: Crafting a Strong Essay",
                    excerpt: "This post offers practical tips for writing a compelling essay in the TOPIK II exam, including structure, vocabulary, and common pitfalls.",
                    content: "This post offers practical tips for writing a compelling essay in the TOPIK II exam, including structure, vocabulary, and common pitfalls.\n\nWriting a strong essay in the TOPIK II exam is essential for achieving a high score. Here are some tips to help you craft a compelling essay:\n\n1. **Understand the Prompt**: Carefully read the essay prompt and ensure you understand what is being asked.\n2. **Plan Your Structure**: A clear structure is vital. Typically, an essay should include an introduction, body paragraphs, and a conclusion.\n3. **Use Appropriate Vocabulary**: Use varied vocabulary and grammar structures to demonstrate your language proficiency.\n4. **Practice Time Management**: Allocate time for planning, writing, and reviewing your essay.\n5. **Proofread**: Leave time to proofread your essay for grammatical errors and clarity.",
                    publishedAt: "2025-02-20T13:30:00Z",
                    coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                    author: {
                        name: "Soo-Yeon Kim",
                        avatar: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    likes: 38,
                    commentCount: 10,
                    tags: ["TOPIK II", "Writing", "Essay"]
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Korean Language Learning Blog
                            </h1>
                            <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
                            <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                                Explore our latest articles, tips and techniques for mastering Korean
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 animate-pulse rounded-lg bg-muted"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}

                        <div className="mt-10 flex justify-center">
                            <Button variant="outline" className="group h-12 px-8">
                                Load More
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}