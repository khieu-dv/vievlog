"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "~/ui/primitives/button";
import axios from "axios";
import { useRouter } from 'next/navigation';

interface NavigationButtonsProps {
    currentLessonId: string;
    categoryId?: string;
}

export function LessonNavigationButtons({ currentLessonId, categoryId }: NavigationButtonsProps) {
    const [prevLesson, setPrevLesson] = useState<{ id: string; name: string } | null>(null);
    const [nextLesson, setNextLesson] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAdjacentLessons = async () => {
            try {
                setLoading(true);
                const apiUrl = `https://pocketbase.vietopik.com/api/collections/lessions/records?perPage=300`;
                const params: Record<string, string> = {
                    sort: 'created',
                    created: ">=2022-01-01 00:00:00"
                };

                if (categoryId) {
                    params.filter = `main_category = "${categoryId}"`;
                }


                const response = await axios.get(apiUrl, { params });
                const lessons = response.data.items || [];

                // Find the index of the current lesson
                const currentIndex = lessons.findIndex((lesson: any) => lesson.id === currentLessonId);

                if (currentIndex > 0) {
                    setPrevLesson({
                        id: lessons[currentIndex - 1].id,
                        name: lessons[currentIndex - 1].name
                    });
                } else {
                    setPrevLesson(null);
                }

                if (currentIndex < lessons.length - 1) {
                    setNextLesson({
                        id: lessons[currentIndex + 1].id,
                        name: lessons[currentIndex + 1].name
                    });
                } else {
                    setNextLesson(null);
                }
            } catch (error) {
                console.error("Error fetching adjacent lessons:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentLessonId) {
            fetchAdjacentLessons();
        }
    }, [currentLessonId, categoryId]);

    const navigateToLesson = (lessonId: string) => {
        router.push(`/lessons/${lessonId}`);
    };

    if (loading) {
        return <div className="flex justify-between mt-4 py-2 animate-pulse">
            <div className="bg-gray-200 h-10 w-28 rounded"></div>
            <div className="bg-gray-200 h-10 w-28 rounded"></div>
        </div>;
    }

    return (
        <div className="flex justify-between mt-4 py-2">
            {prevLesson ? (
                <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => navigateToLesson(prevLesson.id)}
                    title={prevLesson.name}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Bài trước</span>
                    <span className="hidden lg:inline ml-1 max-w-36 truncate">: {prevLesson.name}</span>
                </Button>
            ) : (
                <div></div>
            )}

            {nextLesson ? (
                <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => navigateToLesson(nextLesson.id)}
                    title={nextLesson.name}
                >
                    <span className="hidden sm:inline">Bài tiếp theo</span>
                    <span className="hidden lg:inline ml-1 max-w-36 truncate">: {nextLesson.name}</span>
                    <ChevronRight size={16} />
                </Button>
            ) : (
                <div></div>
            )}
        </div>
    );
}