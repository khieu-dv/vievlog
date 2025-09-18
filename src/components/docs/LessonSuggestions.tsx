// ~/components/docs/LessonSuggestions.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface LessonSuggestionsProps {
  currentLesson: number; // 0-N, where 0 is intro lesson
  basePath?: string; // e.g., "/desktop-docs/soft-skills/rust"
  metaData?: Record<string, string>; // Meta data from _meta.ts files
  totalLessons?: number; // Fallback for backward compatibility
}

interface LessonInfo {
  id: number;
  title: string;
}

// Function to get lesson data from meta files
const getLessonDataFromMeta = (metaData: Record<string, string>): LessonInfo[] => {
  const lessons: LessonInfo[] = [];

  // Convert meta data to lesson info
  Object.entries(metaData).forEach(([key, title]) => {
    const match = key.match(/bai-(\d+)/);
    if (match) {
      const id = parseInt(match[1]);
      lessons.push({ id, title });
    }
  });

  // Sort by id
  lessons.sort((a, b) => a.id - b.id);
  return lessons;
};

// Fallback function to load meta data dynamically
const getMetaData = async (basePath: string): Promise<Record<string, string>> => {
  try {
    // Extract course name from basePath
    const pathParts = basePath.split('/');
    const courseName = pathParts[pathParts.length - 1];

    // Dynamically import the meta file
    const metaModule = await import(`../../content/soft-skills/${courseName}/_meta.ts`);
    return metaModule.default;
  } catch (error) {
    console.warn(`Could not load meta data for ${basePath}:`, error);
    return {};
  }
};

// Fallback function for backward compatibility
const getGenericLessonData = (totalLessons: number): LessonInfo[] => {
  const lessons: LessonInfo[] = [
    { id: 0, title: "Giới thiệu khóa học" }
  ];

  for (let i = 1; i <= totalLessons; i++) {
    lessons.push({
      id: i,
      title: `Bài ${i}`
    });
  }

  return lessons;
};

const getSuggestions = (currentLesson: number, lessonData: LessonInfo[]): LessonInfo[] => {
  const suggestions: LessonInfo[] = [];
  const totalLessons = lessonData.length - 1; // Excluding lesson 0

  // Find lesson by id helper
  const findLessonById = (id: number) => lessonData.find(lesson => lesson.id === id);

  // Luôn thêm bài 0 đầu tiên (trừ khi đang ở bài 0)
  if (currentLesson !== 0) {
    const lesson0 = findLessonById(0);
    if (lesson0) suggestions.push(lesson0);
  }

  if (currentLesson === 0) {
    // Bài 0: gợi ý 4 bài đầu tiên
    const nextLessons = Math.min(4, totalLessons);
    for (let i = 1; i <= nextLessons; i++) {
      const lesson = findLessonById(i);
      if (lesson) suggestions.push(lesson);
    }
  } else {
    // Thêm bài trước (nếu có)
    if (currentLesson > 1) {
      const prevLesson = findLessonById(currentLesson - 1);
      if (prevLesson) suggestions.push(prevLesson);
    }

    // Thêm bài tiếp theo (nếu có)
    const nextLesson = findLessonById(currentLesson + 1);
    if (nextLesson) suggestions.push(nextLesson);

    // Thêm bài thứ 2 sau bài hiện tại (nếu có)
    const nextNextLesson = findLessonById(currentLesson + 2);
    if (nextNextLesson) suggestions.push(nextNextLesson);

    // Nếu chưa đủ 4 gợi ý, thêm bài 1 (nếu không phải đang ở bài 1)
    if (suggestions.length < 4 && currentLesson !== 1) {
      const lesson1 = findLessonById(1);
      if (lesson1) suggestions.push(lesson1);
    }
  }

  return suggestions.slice(0, 4);
};

export default function LessonSuggestions({
  currentLesson,
  basePath = "/desktop-docs/soft-skills/rust",
  metaData,
  totalLessons
}: LessonSuggestionsProps) {
  const [lessonData, setLessonData] = useState<LessonInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessonData = async () => {
      if (metaData) {
        // Use provided meta data
        setLessonData(getLessonDataFromMeta(metaData));
        setLoading(false);
      } else {
        // Try to load meta data dynamically
        const meta = await getMetaData(basePath);
        if (Object.keys(meta).length > 0) {
          setLessonData(getLessonDataFromMeta(meta));
        } else if (totalLessons) {
          // Fallback to generic data
          setLessonData(getGenericLessonData(totalLessons));
        }
        setLoading(false);
      }
    };

    loadLessonData();
  }, [basePath, metaData, totalLessons]);

  const suggestions = getSuggestions(currentLesson, lessonData);

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        💡 Bài học liên quan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((lesson) => (
          <Link
            key={lesson.id}
            href={`${basePath}/bai-${lesson.id}`}
            className="group block p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">📖</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Bài {lesson.id}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h4>
                <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Học ngay →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Điều hướng nhanh:</span>
          <div className="flex gap-2">
            {currentLesson > 0 && (
              <Link
                href={`${basePath}/bai-${currentLesson - 1}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ← Bài trước
              </Link>
            )}
            {lessonData.find(lesson => lesson.id === currentLesson + 1) && (
              <Link
                href={`${basePath}/bai-${currentLesson + 1}`}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Bài tiếp theo →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}