"use client";

import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

interface Props {
  children: React.ReactNode;
}

export default function CompaniesWrapper({ children }: Props) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      
      {/* Main Layout - Apple Style */}
      <div className="max-w-7xl mx-auto sm:px-6">
        <div className="flex flex-col">
          {/* Header Section - Enhanced modern design */}
          <div className="relative pt-20 pb-16 text-center px-4 sm:px-0">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-transparent to-transparent dark:from-green-950 dark:via-transparent opacity-40"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-60"></div>
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Đánh giá chân thực từ nhân viên
              </div>

              {/* Main title with gradient */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-green-800 to-blue-900 dark:from-white dark:via-green-300 dark:to-blue-300 bg-clip-text text-transparent">
                  Đánh giá công ty
                </span>
              </h1>

              {/* Subtitle with better typography */}
              <div className="max-w-4xl mx-auto mb-8">
                <p className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Khám phá đánh giá chân thực từ nhân viên
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Tìm hiểu về môi trường làm việc, lương thưởng, cơ hội phát triển và văn hóa công ty
                </p>
              </div>

              {/* Stats section */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    1000+ Đánh giá
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    500+ Công ty
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    4.5★ Rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Companies Content */}
          <div className="pb-20">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}