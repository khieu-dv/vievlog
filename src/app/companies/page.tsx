import { Suspense } from 'react';
import CompaniesClient from './client';
import CompaniesWrapper from './wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đánh giá công ty - VieVlog',
  description: 'Khám phá đánh giá nhân viên về các công ty hàng đầu Việt Nam. Tìm hiểu về môi trường làm việc, lương thưởng, và văn hóa công ty.',
  keywords: ['đánh giá công ty', 'review công ty', 'môi trường làm việc', 'lương thưởng', 'tuyển dụng'],
};

export default function CompaniesPage() {
  return (
    <CompaniesWrapper>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      }>
        <CompaniesClient />
      </Suspense>
    </CompaniesWrapper>
  );
}