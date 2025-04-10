// components/post/PostCard.jsx
"use client";

import { ArrowRight, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/ui/primitives/card";
import { formatDistanceToNow } from "date-fns";

interface Post {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    publishedAt: string;
    likes: number;
    commentCount: number;
    author: {
        name: string;
        avatar?: string;
    };
}

export function PostCard({ post }: { post: Post }) {
    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            {post.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                            src={post.author.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <CardTitle className="mt-3 text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="line-clamp-3">
                    {post.excerpt}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentCount}</span>
                    </div>
                </div>
                <Link href={`/posts/${post.id}`} className="flex items-center gap-1 text-sm font-medium text-primary">
                    Read more <ArrowRight className="h-4 w-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}