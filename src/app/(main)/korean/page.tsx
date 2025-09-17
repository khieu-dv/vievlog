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
              🇰🇷 한국어 학습 센터
            </h1>
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Trung Tâm Học Tiếng Hàn Tổng Hợp
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Hệ thống học tiếng Hàn chuyên nghiệp cho người Việt Nam: Từ tiếng Hàn tổng hợp, chương trình KIIP, đến luyện thi TOPIK, KIIP và ESP.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Link
                href="#korean-general"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:text-sm"
              >
                <BookOpen className="size-3 sm:size-4" />
                Tiếng Hàn Tổng Hợp
              </Link>
              <Link
                href="#kiip-program"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 sm:text-sm"
              >
                <Users className="size-3 sm:size-4" />
                KIIP Program
              </Link>
              <Link
                href="#topik-test"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 sm:text-sm"
              >
                <Award className="size-3 sm:size-4" />
                Thi TOPIK
              </Link>
              <Link
                href="#kiip-test"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-orange-700 sm:text-sm"
              >
                <FileText className="size-3 sm:size-4" />
                Thi KIIP
              </Link>
              <Link
                href="#esp-test"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 sm:text-sm"
              >
                <Star className="size-3 sm:size-4" />
                Thi ESP
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Korean General Program */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-4 dark:from-blue-900/20 dark:to-slate-900 sm:py-8 md:py-12" id="korean-general">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <SectionBadge title="Tiếng Hàn Tổng Hợp" />
          </div>
          <div className="my-3 text-left md:my-5">
            <h2 className="mb-0 text-xl font-semibold sm:mb-1 sm:text-3xl">
              Chương Trình Tiếng Hàn Tổng Hợp Cho Người Việt Nam
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Hệ thống học tiếng Hàn từ cơ bản đến nâng cao, được thiết kế đặc biệt phù hợp với người Việt Nam.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
            <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800">
              <Link href="/docs/soft-skills/korean/bai-1" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Tiếng Hàn Sơ Cấp (초급)</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Học bảng chữ cái Hangeul, từ vựng cơ bản, ngữ pháp đơn giản. Phù hợp cho người mới bắt đầu.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800">
              <Link href="/docs/soft-skills/korean/bai-6" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Tiếng Hàn Trung Cấp (중급)</h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Giao tiếp thành thạo trong các tình huống xã hội, công việc. Hiểu văn hóa Hàn Quốc sâu hơn.
                </p>
              </Link>
            </div>

            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-violet-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-purple-950/50 dark:to-violet-950/50 dark:border-purple-800">
              <Link href="/docs/soft-skills/korean/bai-12" className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Tiếng Hàn Cao Cấp (고급)</h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Thành thạo tiếng Hàn chuyên ngành, văn học, học thuật. Có thể làm việc và sinh sống tại Hàn Quốc.
                </p>
              </Link>
            </div>
          </div>

          <p className="my-4 text-sm text-gray-500 dark:text-gray-400 sm:my-7 sm:text-base">
            Chương trình tiếng Hàn tổng hợp dành riêng cho người Việt Nam với{" "}
            <Link
              href="/docs/soft-skills/korean"
              className="font-medium underline underline-offset-2"
            >
              phương pháp học tập hiệu quả
            </Link>{" "}
            và tài liệu được biên soạn phù hợp với đặc điểm ngôn ngữ và văn hóa Việt Nam.
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

      {/* KIIP Program */}
      <div id="kiip-program">
      <RoleRoadmaps
        badge="Chương Trình KIIP"
        title="Chương Trình Tiếng Hàn Hội Nhập Xã Hội Hàn Quốc (KIIP)"
        description="Korea Immigration & Integration Program - Chương trình chính thức của Chính phủ Hàn Quốc"
      >
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={Users}
            title="KIIP Sơ Cấp (1-2급)"
            link="/docs/soft-skills/korean/kiip-beginner"
            description="Tiếng Hàn cơ bản cho cuộc sống hàng ngày, hiểu biết về xã hội Hàn Quốc."
          />
          <RoadmapCard
            icon={Globe2}
            title="KIIP Trung Cấp (3-4급)"
            link="/docs/soft-skills/korean/kiip-intermediate"
            description="Giao tiếp xã hội, tìm hiểu văn hóa và lịch sử Hàn Quốc sâu hơn."
          />
        </div>
        <RoadmapCard
          icon={Award}
          title="KIIP Cao Cấp (5급)"
          link="/docs/soft-skills/korean/kiip-advanced"
          description="Hiểu biết sâu sắc về xã hội, chính trị, kinh tế Hàn Quốc. Chuẩn bị nhập quốc tịch."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Văn hóa Hàn Quốc", link: "/docs/soft-skills/korean/kiip-culture" },
            { title: "Lịch sử Hàn Quốc", link: "/docs/soft-skills/korean/kiip-history" },
            { title: "Xã hội Hàn Quốc", link: "/docs/soft-skills/korean/kiip-society" },
          ]}
          description="Tìm hiểu toàn diện về đất nước và con người Hàn Quốc"
        />
      </RoleRoadmaps>
      </div>

      {/* TOPIK Test */}
      <div id="topik-test">
      <RoleRoadmaps
        badge="Thi TOPIK"
        title="Luyện Thi TOPIK (Test of Proficiency in Korean)"
        description="Kỳ thi tiếng Hàn quan trọng nhất cho du học, làm việc và định cư tại Hàn Quốc"
      >
        <div className="flex flex-col gap-3">
          <RoadmapCard
            icon={Award}
            title="TOPIK I (Sơ cấp 1-2)"
            link="/docs/soft-skills/korean/topik-1"
            description="Luyện thi TOPIK cấp độ 1-2: Nghe và Đọc hiểu cơ bản (200 câu hỏi, 100 phút)."
          />
          <RoadmapCard
            icon={Star}
            title="TOPIK II (Trung-Cao cấp 3-6)"
            link="/docs/soft-skills/korean/topik-2"
            description="Luyện thi TOPIK cấp độ 3-6: Nghe, Đọc và Viết (70 câu + 4 bài viết, 180 phút)."
          />
        </div>
        <RoadmapMultiCard
          roadmaps={[
            { title: "Chiến lược làm bài", link: "/docs/soft-skills/korean/topik-strategy" },
            { title: "Đề thi thực hành", link: "/docs/soft-skills/korean/topik-practice" },
            { title: "Từ vựng TOPIK", link: "/docs/soft-skills/korean/topik-vocabulary" },
          ]}
          description="Chuẩn bị toàn diện cho kỳ thi TOPIK"
          secondaryRoadmaps={[
            { title: "Kỹ năng Viết", link: "/docs/soft-skills/korean/topik-writing" },
            { title: "Kỹ năng Nghe", link: "/docs/soft-skills/korean/topik-listening" },
          ]}
          secondaryDescription="Luyện tập chuyên sâu từng kỹ năng"
        />
      </RoleRoadmaps>
      </div>

      {/* KIIP Test */}
      <div id="kiip-test">
      <RoleRoadmaps
        badge="Thi KIIP"
        title="Luyện Thi Tốt Nghiệp KIIP"
        description="Kỳ thi tốt nghiệp chương trình KIIP để nhận chứng chỉ hoàn thành"
      >
        <RoadmapCard
          icon={FileText}
          title="Thi Tổng Hợp KIIP"
          link="/docs/soft-skills/korean/kiip-test-comprehensive"
          description="Thi tổng hợp kiến thức tiếng Hàn và văn hóa xã hội đã học trong chương trình KIIP."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Đề thi mẫu", link: "/docs/soft-skills/korean/kiip-test-samples" },
            { title: "Kiến thức văn hóa", link: "/docs/soft-skills/korean/kiip-culture-test" },
          ]}
          description="Ôn tập và luyện đề thi KIIP hiệu quả"
          secondaryRoadmaps={[
            { title: "Thủ tục đăng ký", link: "/docs/soft-skills/korean/kiip-registration" },
            { title: "Lịch thi", link: "/docs/soft-skills/korean/kiip-schedule" },
          ]}
          secondaryDescription="Hướng dẫn thủ tục và lịch trình thi"
        />
      </RoleRoadmaps>
      </div>

      {/* ESP Test */}
      <div id="esp-test">
      <RoleRoadmaps
        badge="Thi ESP"
        title="Luyện Thi ESP (Employment Permit System)"
        description="Kỳ thi tiếng Hàn cho lao động nước ngoài muốn làm việc tại Hàn Quốc"
      >
        <RoadmapCard
          icon={Star}
          title="ESP Test Preparation"
          link="/docs/soft-skills/korean/esp-preparation"
          description="Chuẩn bị cho kỳ thi ESP: Kiến thức tiếng Hàn cơ bản cho môi trường làm việc."
        />
        <RoadmapMultiCard
          roadmaps={[
            { title: "Từ vựng công việc", link: "/docs/soft-skills/korean/esp-work-vocabulary" },
            { title: "Giao tiếp nơi làm việc", link: "/docs/soft-skills/korean/esp-workplace-communication" },
          ]}
          description="Tiếng Hàn chuyên biệt cho môi trường làm việc"
          secondaryRoadmaps={[
            { title: "Quy trình đăng ký EPS", link: "/docs/soft-skills/korean/eps-registration" },
            { title: "Chuẩn bị phỏng vấn", link: "/docs/soft-skills/korean/esp-interview" },
          ]}
          secondaryDescription="Hướng dẫn toàn diện về EPS"
        />
      </RoleRoadmaps>
      </div>

      {/* Korean Learning Resources */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-5 mb-12 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-5 dark:from-blue-800 dark:to-purple-900">
          <h2 className="mb-0.5 text-xl font-semibold text-white sm:mb-1 sm:text-2xl">
            🇰🇷 Bắt đầu hành trình học tiếng Hàn!
          </h2>
          <p className="text-sm text-blue-100 sm:text-base">
            Chọn chương trình phù hợp với mục tiêu của bạn và bắt đầu ngay hôm nay.
          </p>

          <div className="my-4 grid grid-cols-1 gap-2 sm:my-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-5">
            <Link
              href="/docs/soft-skills/korean"
              className="grow rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-blue-400/30 hover:to-blue-500/30 sm:text-base"
            >
              <BookOpen className="mb-3 h-5 w-5 text-blue-200 sm:mb-2" />
              Tiếng Hàn Tổng Hợp
            </Link>
            <Link
              href="#kiip-program"
              className="grow rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-green-400/30 hover:to-green-500/30 sm:text-base"
            >
              <Users className="mb-3 h-5 w-5 text-green-200 sm:mb-2" />
              Chương trình KIIP
            </Link>
            <Link
              href="#topik-test"
              className="grow rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-purple-400/30 hover:to-purple-500/30 sm:text-base"
            >
              <Award className="mb-3 h-5 w-5 text-purple-200 sm:mb-2" />
              Luyện thi TOPIK
            </Link>
            <Link
              href="#kiip-test"
              className="grow rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-orange-400/30 hover:to-orange-500/30 sm:text-base"
            >
              <FileText className="mb-3 h-5 w-5 text-orange-200 sm:mb-2" />
              Luyện thi KIIP
            </Link>
            <Link
              href="#esp-test"
              className="grow rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur p-4 text-sm text-white transition-all hover:from-red-400/30 hover:to-red-500/30 sm:text-base"
            >
              <Star className="mb-3 h-5 w-5 text-red-200 sm:mb-2" />
              Luyện thi ESP
            </Link>
          </div>
          <p className="text-sm text-blue-100 sm:text-base">
            Mỗi chương trình được thiết kế đặc biệt cho{" "}
            <Link
              href="/docs/soft-skills/korean"
              className="rounded-lg bg-blue-500/30 px-2 py-1 text-blue-100 transition-colors hover:bg-blue-400/40 hover:text-white"
            >
              người Việt Nam
            </Link>{" "}
            với{" "}
            <Link
              href="/docs/soft-skills/korean"
              className="rounded-lg bg-blue-500/30 px-2 py-1 text-blue-100 transition-colors hover:bg-blue-400/40 hover:text-white"
            >
              phương pháp hiệu quả
            </Link>{" "}
            và tài liệu chất lượng cao.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}