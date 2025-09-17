"use client";

import {
  BookOpen,
  GraduationCap,
  Volume2,
  MessageSquare,
  FileText,
  Award,
  Users,
  Globe2,
  ArrowRight,
  Headphones,
  Video,
  PenTool,
  Star
} from 'lucide-react';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Footer } from "~/components/common/Footer";
import { Header } from "~/components/common/Header";
import { Button } from "~/components/ui/Button";
import { RoadmapCard } from "~/components/ui/RoadmapCard";
import { RoadmapMultiCard } from "~/components/ui/RoadmapMultiCard";
import { RoleRoadmaps } from "~/components/ui/RoleRoadmaps";
import { SectionBadge } from "~/components/ui/SectionBadge";
import { TipItem } from "~/components/ui/TipItem";

export default function KoreanLearningPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      {/* Korean Learning Hero Section */}
      <div className="border-b bg-gradient-to-b from-blue-50 to-white py-12 dark:border-b-gray-800 dark:from-blue-900/20 dark:to-slate-900 sm:py-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-3 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              학습 한국어 📚
            </h1>
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Học Tiếng Hàn Quốc
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Khám phá hành trình học tiếng Hàn từ cơ bản đến nâng cao với các bài học có cấu trúc và phương pháp hiệu quả.
            </p>
            <div className="flex gap-4">
              <Link
                href="/docs/soft-skills/korean"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:px-6 sm:py-3 sm:text-base"
              >
                <BookOpen className="size-3 sm:size-5" />
                Bắt đầu học ngay
              </Link>
              <Link
                href="#beginner-guide"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-base"
              >
                <GraduationCap className="size-3 sm:size-5" />
                Hướng dẫn người mới
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Levels */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-4 dark:from-blue-900/20 dark:to-slate-900 sm:py-8 md:py-12" id="beginner-guide">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <SectionBadge title="Trình độ học tập" />
          </div>
          <div className="my-3 text-left md:my-5">
            <h2 className="mb-0 text-xl font-semibold sm:mb-1 sm:text-3xl">
              Bạn đang ở trình độ nào?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Chọn trình độ phù hợp để bắt đầu hành trình học tiếng Hàn của bạn.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800">
              <Link href="/docs/soft-skills/korean/bai-1" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Sơ cấp 1 (초급 1)</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Hangeul, từ vựng cơ bản, giới thiệu bản thân và gia đình.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800">
              <Link href="/docs/soft-skills/korean/bai-3" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Sơ cấp 2 (초급 2)</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Ngữ pháp hiện tại, quá khứ và hoạt động hàng ngày.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800">
              <Link href="/docs/soft-skills/korean/bai-6" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Trung cấp 1 (중급 1)</h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Giao tiếp trong các tình huống xã hội và công việc.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800">
              <Link href="/docs/soft-skills/korean/bai-9" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Trung cấp 2 (중급 2)</h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Thể hiện ý kiến, cảm xúc và thảo luận các chủ đề phức tạp.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-violet-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-purple-950/50 dark:to-violet-950/50 dark:border-purple-800">
              <Link href="/docs/soft-skills/korean/bai-12" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Cao cấp 1 (고급 1)</h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Ngôn ngữ chuyên ngành, văn học và các văn bản học thuật.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-violet-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-purple-950/50 dark:to-violet-950/50 dark:border-purple-800">
              <Link href="/docs/soft-skills/korean/bai-15" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Cao cấp 2 (고급 2)</h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Thành thạo hoàn toàn, nghiên cứu và sử dụng tiếng Hàn chuyên sâu.
                </p>
              </Link>
            </div>
          </div>

          <p className="my-4 text-sm text-gray-500 dark:text-gray-400 sm:my-7 sm:text-base">
            Ngoài ra còn có{" "}
            <Link
              href="/docs/soft-skills/korean"
              className="font-medium underline underline-offset-2"
            >
              bộ 18 bài học hoàn chỉnh
            </Link>{" "}
            từ cơ bản đến nâng cao, giúp bạn xây dựng nền tảng vững chắc và phát triển
            kỹ năng tiếng Hàn một cách có hệ thống.
          </p>

          <div className="rounded-xl border bg-white p-3 dark:border-gray-800 dark:bg-slate-950 sm:p-4">
            <h2 className="mb-0 text-lg font-semibold sm:mb-1 sm:text-xl">
              Mẹo học tiếng Hàn hiệu quả
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Những gợi ý hữu ích để tối ưu hóa quá trình học tiếng Hàn của bạn:
            </p>

            <div className="mt-3 flex flex-col gap-1">
              <TipItem
                title="Học Hangeul trước tiên"
                description="Bảng chữ cái Hàn Quốc (한글) là nền tảng quan trọng nhất. Dành thời gian để thuộc lòng và viết thành thạo 40 ký tự cơ bản trước khi chuyển sang từ vựng và ngữ pháp."
              />
              <TipItem
                title="Luyện tập hàng ngày"
                description="Học tiếng Hàn 30 phút mỗi ngày hiệu quả hơn học 3 tiếng một tuần một lần. Tính nhất quán là chìa khóa để ghi nhớ lâu dài."
              />
              <TipItem
                title="Nghe và bắt chước phát âm"
                description="Tiếng Hàn có nhiều âm khó với người Việt. Nghe nhạc K-pop, xem phim Hàn có phụ đề và luyện phát âm theo để cải thiện kỹ năng nghe nói."
              />
              <TipItem
                title="Học từ vựng theo chủ đề"
                description="Thay vì học từ vựng ngẫu nhiên, hãy học theo chủ đề như gia đình, đồ ăn, thời tiết. Điều này giúp não bộ liên kết và ghi nhớ tốt hơn."
              />
              <TipItem
                title="Thực hành viết và đọc"
                description="Viết nhật ký bằng tiếng Hàn, đọc truyện tranh hoặc tin tức đơn giản. Bắt đầu với câu ngắn và dần dần tăng độ phức tạp."
              />
              <TipItem
                title="Tìm partner học tập"
                description="Tham gia các nhóm học tiếng Hàn trên Facebook, Discord hoặc tìm bạn Hàn Quốc để trao đổi ngôn ngữ. Thực hành với người bản xứ sẽ giúp bạn tiến bộ nhanh chóng."
              />
              <TipItem
                title="Học văn hóa cùng ngôn ngữ"
                description="Hiểu văn hóa Hàn Quốc giúp bạn sử dụng ngôn ngữ chính xác hơn. Tìm hiểu về cách xưng hô, phép lịch sự và các tình huống giao tiếp thường gặp."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Study Materials */}
      <RoleRoadmaps
        badge="Tài liệu học tập"
        title="Tài liệu và phương pháp học"
        description="Khám phá các nguồn tài liệu và phương pháp học tiếng Hàn đa dạng và hiệu quả"
      >
        <RoadmapCard
          icon={FileText}
          title="Giáo trình cơ bản"
          link="/docs/soft-skills/korean"
          description="18 bài học từ cơ bản đến nâng cao với ngữ pháp và từ vựng chi tiết."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Ngữ pháp", link: "/docs/soft-skills/korean/bai-2" },
            { title: "Từ vựng", link: "/docs/soft-skills/korean/bai-1" },
          ]}
          description="Nắm vững ngữ pháp và mở rộng vốn từ vựng tiếng Hàn"
          secondaryRoadmaps={[{ title: "Phát âm", link: "/docs/soft-skills/korean/bai-3" }]}
          secondaryDescription="Luyện phát âm chuẩn và kỹ năng nghe"
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Giao tiếp hàng ngày", link: "/docs/soft-skills/korean/bai-4" },
            { title: "Văn hóa xã hội", link: "/docs/soft-skills/korean/bai-11" },
          ]}
          description="Ứng dụng tiếng Hàn trong cuộc sống thực tế"
        />
      </RoleRoadmaps>

      {/* Skills Development */}
      <RoleRoadmaps
        badge="Phát triển kỹ năng"
        title="4 kỹ năng cần thiết"
        description="Phát triển đồng đều 4 kỹ năng ngôn ngữ cơ bản: Nghe - Nói - Đọc - Viết"
      >
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={Headphones}
            title="Kỹ năng Nghe"
            link="/docs/soft-skills/korean/bai-7"
            description="Luyện nghe qua âm nhạc, phim ảnh và podcast Hàn Quốc."
          />
          <RoadmapCard
            icon={Volume2}
            title="Kỹ năng Nói"
            link="/docs/soft-skills/korean/bai-8"
            description="Thực hành phát âm và giao tiếp thông qua các tình huống thực tế."
          />
        </div>
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={BookOpen}
            title="Kỹ năng Đọc"
            link="/docs/soft-skills/korean/bai-9"
            description="Đọc hiểu từ văn bản đơn giản đến phức tạp."
          />
          <RoadmapCard
            icon={PenTool}
            title="Kỹ năng Viết"
            link="/docs/soft-skills/korean/bai-10"
            description="Viết từ câu đơn giản đến đoạn văn và bài luận."
          />
        </div>
      </RoleRoadmaps>

      {/* Test Preparation */}
      <RoleRoadmaps
        badge="Luyện thi"
        title="Chuẩn bị cho các kỳ thi"
        description="Chuẩn bị cho TOPIK và các chứng chỉ tiếng Hàn quốc tế"
      >
        <RoadmapCard
          icon={Award}
          title="TOPIK I (Sơ cấp)"
          link="/docs/soft-skills/korean/bai-15"
          description="Chuẩn bị cho kỳ thi TOPIK cấp độ 1-2, dành cho người mới bắt đầu."
        />
        <RoadmapCard
          icon={Star}
          title="TOPIK II (Trung-Cao cấp)"
          link="/docs/soft-skills/korean/bai-16"
          description="Luyện thi TOPIK cấp độ 3-6 cho trình độ trung cấp và cao cấp."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Luyện đề", link: "/docs/soft-skills/korean/bai-17" },
            { title: "Kỹ thuật làm bài", link: "/docs/soft-skills/korean/bai-18" },
          ]}
          description="Chiến lược và kỹ thuật làm bài thi hiệu quả"
        />
      </RoleRoadmaps>

      {/* Additional Resources */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-5 mb-12 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-5 dark:from-blue-800 dark:to-purple-900">
          <h2 className="mb-0.5 text-xl font-semibold text-white sm:mb-1 sm:text-2xl">
            Có rất nhiều thứ hay khác!
          </h2>
          <p className="text-sm text-blue-100 sm:text-base">
            Khám phá thêm nhiều tài liệu và công cụ học tiếng Hàn hữu ích.
          </p>

          <div className="my-4 grid grid-cols-1 gap-2 sm:my-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            <Link
              href="/docs/soft-skills/korean"
              className="grow rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-blue-400/30 hover:to-blue-500/30 sm:text-base"
            >
              <BookOpen className="mb-3 h-5 w-5 text-blue-200 sm:mb-2" />
              Tất cả bài học
            </Link>
            <Link
              href="/docs"
              className="grow rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-purple-400/30 hover:to-purple-500/30 sm:text-base"
            >
              <Video className="mb-3 h-5 w-5 text-purple-200 sm:mb-2" />
              Video hướng dẫn
            </Link>
            <Link
              href="/docs"
              className="grow rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-green-400/30 hover:to-green-500/30 sm:text-base"
            >
              <Users className="mb-3 h-5 w-5 text-green-200 sm:mb-2" />
              Cộng đồng học tập
            </Link>
          </div>
          <p className="text-sm text-blue-100 sm:text-base">
            Hoặc tham khảo{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-blue-500/30 px-2 py-1 text-blue-100 transition-colors hover:bg-blue-400/40 hover:text-white"
            >
              tài liệu bổ sung
            </Link>{" "}
            và{" "}
            <Link
              href="/docs"
              className="rounded-lg bg-blue-500/30 px-2 py-1 text-blue-100 transition-colors hover:bg-blue-400/40 hover:text-white"
            >
              ứng dụng di động
            </Link>{" "}
            để học mọi lúc mọi nơi.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}