// ~/components/docs/LessonSuggestions.tsx
'use client';

import Link from 'next/link';

interface LessonSuggestionsProps {
  currentLesson: number; // 0-N, where 0 is intro lesson
  basePath?: string; // e.g., "/desktop-docs/soft-skills/rust"
  courseData?: LessonInfo[]; // Custom course data
  totalLessons?: number; // Total number of lessons in course
}

interface LessonInfo {
  id: number;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Default Rust course data
const defaultRustLessons: LessonInfo[] = [
  { id: 0, title: "Giới thiệu khóa học", description: "Tổng quan và lộ trình học Rust", emoji: "🦀", difficulty: 'beginner' },
  { id: 1, title: "Giới thiệu & Cài đặt", description: "Setup môi trường và Hello World", emoji: "🔧", difficulty: 'beginner' },
  { id: 2, title: "Cú pháp cơ bản", description: "Variables, constants và mutability", emoji: "📝", difficulty: 'beginner' },
  { id: 3, title: "Kiểu dữ liệu", description: "Scalar và compound types", emoji: "🔢", difficulty: 'beginner' },
  { id: 4, title: "Control Flow", description: "Functions, loops và conditions", emoji: "🔄", difficulty: 'beginner' },
  { id: 5, title: "Strings & Collections", description: "String, Vec và HashMap", emoji: "📚", difficulty: 'intermediate' },
  { id: 6, title: "Structs & Enums", description: "Custom types và methods", emoji: "🏗️", difficulty: 'intermediate' },
  { id: 7, title: "Pattern Matching", description: "match, if let và while let", emoji: "🎯", difficulty: 'intermediate' },
  { id: 8, title: "Ownership System", description: "Memory safety và move semantics", emoji: "🔒", difficulty: 'advanced' },
  { id: 9, title: "Borrowing", description: "References và borrowing rules", emoji: "🔗", difficulty: 'advanced' },
  { id: 10, title: "Error Handling", description: "Result, Option và panic", emoji: "⚠️", difficulty: 'intermediate' },
  { id: 11, title: "Modules", description: "Project organization", emoji: "📦", difficulty: 'intermediate' },
  { id: 12, title: "Traits", description: "Shared behavior", emoji: "🎭", difficulty: 'advanced' },
  { id: 13, title: "Generics", description: "Generic programming", emoji: "🔧", difficulty: 'advanced' },
  { id: 14, title: "Lifetimes", description: "Memory lifetimes", emoji: "⏰", difficulty: 'advanced' },
  { id: 15, title: "Collections", description: "Iterators và closures", emoji: "🔄", difficulty: 'advanced' },
  { id: 16, title: "Async Programming", description: "Concurrent programming", emoji: "⚡", difficulty: 'advanced' },
  { id: 17, title: "Macros & Testing", description: "Code generation", emoji: "🧪", difficulty: 'advanced' },
  { id: 18, title: "Web Development", description: "REST APIs", emoji: "🌐", difficulty: 'advanced' },
];

// Generic lesson data for other courses
const getGenericLessonData = (totalLessons: number): LessonInfo[] => {
  const lessons: LessonInfo[] = [
    { id: 0, title: "Giới thiệu khóa học", description: "Tổng quan và lộ trình học", emoji: "📚", difficulty: 'beginner' }
  ];

  for (let i = 1; i <= totalLessons; i++) {
    lessons.push({
      id: i,
      title: `Bài ${i}`,
      description: `Nội dung bài học ${i}`,
      emoji: "📖",
      difficulty: i <= 6 ? 'beginner' : i <= 12 ? 'intermediate' : 'advanced'
    });
  }

  return lessons;
};

const getSuggestions = (currentLesson: number, lessonData: LessonInfo[], totalLessons: number): LessonInfo[] => {
  const suggestions: LessonInfo[] = [];

  // Luôn thêm bài 0 đầu tiên (trừ khi đang ở bài 0)
  if (currentLesson !== 0 && lessonData[0]) {
    suggestions.push(lessonData[0]);
  }

  if (currentLesson === 0) {
    // Bài 0: gợi ý 4 bài đầu tiên
    const nextLessons = Math.min(4, totalLessons);
    suggestions.push(...lessonData.slice(1, nextLessons + 1));
  } else {
    // Thêm bài trước (nếu có)
    if (currentLesson > 1 && lessonData[currentLesson - 1]) {
      suggestions.push(lessonData[currentLesson - 1]);
    }

    // Thêm bài tiếp theo (nếu có)
    if (currentLesson < totalLessons && lessonData[currentLesson + 1]) {
      suggestions.push(lessonData[currentLesson + 1]);
    }

    // Thêm bài thứ 2 sau bài hiện tại (nếu có)
    if (currentLesson + 2 <= totalLessons && lessonData[currentLesson + 2]) {
      suggestions.push(lessonData[currentLesson + 2]);
    }

    // Nếu chưa đủ 4 gợi ý, thêm bài 1 (nếu không phải đang ở bài 1)
    if (suggestions.length < 4 && currentLesson !== 1 && lessonData[1]) {
      suggestions.push(lessonData[1]);
    }
  }

  return suggestions.slice(0, 4);
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
    case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'Cơ bản';
    case 'intermediate': return 'Trung bình';
    case 'advanced': return 'Nâng cao';
    default: return 'Khác';
  }
};

export default function LessonSuggestions({
  currentLesson,
  basePath = "/desktop-docs/soft-skills/rust",
  courseData,
  totalLessons = 18
}: LessonSuggestionsProps) {
  // Determine which lesson data to use
  const lessonData = courseData || (basePath.includes('rust') ? defaultRustLessons : getGenericLessonData(totalLessons));

  // Calculate actual total lessons if not provided
  const actualTotalLessons = totalLessons || Math.max(0, lessonData.length - 1);

  const suggestions = getSuggestions(currentLesson, lessonData, actualTotalLessons);

  if (suggestions.length === 0) return null;

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
              <div className="text-2xl">{lesson.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Bài {lesson.id}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(lesson.difficulty)}`}>
                    {getDifficultyLabel(lesson.difficulty)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {lesson.description}
                </p>
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
            {currentLesson < 18 && (
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