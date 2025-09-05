import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CompanyDetailClient from './client';
import CompanyDetailWrapper from './wrapper';
import { companyAPI } from '../../../../lib/pocketbase';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const company = await companyAPI.getBySlug(slug);
    
    if (!company) {
      return {
        title: 'Không tìm thấy công ty - VieVlog',
        description: 'Công ty không tồn tại hoặc đã bị xóa.',
      };
    }

    const description = company.description 
      ? company.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Đánh giá nhân viên về ${company.name}. Tìm hiểu về môi trường làm việc, lương thưởng, và văn hóa công ty.`;

    return {
      title: `${company.name} - Đánh giá công ty | VieVlog`,
      description,
      keywords: [
        company.name,
        'đánh giá công ty',
        'review',
        'môi trường làm việc',
        'lương thưởng',
        company.expand?.industry?.name || 'công nghệ'
      ],
      openGraph: {
        title: `${company.name} - Đánh giá từ nhân viên`,
        description,
        images: company.logoUrl ? [company.logoUrl] : undefined,
      },
    };
  } catch (error) {
    return {
      title: 'Lỗi tải trang - VieVlog',
      description: 'Có lỗi xảy ra khi tải thông tin công ty.',
    };
  }
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  
  return (
    <CompanyDetailWrapper>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      }>
        <CompanyDetailClient slug={slug} />
      </Suspense>
    </CompanyDetailWrapper>
  );
}