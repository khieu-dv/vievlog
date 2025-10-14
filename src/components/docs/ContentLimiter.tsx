"use client";

import { useSession } from "@/lib/authClient";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UpgradeAccountModal } from "./UpgradeAccountModal";
import { useState } from "react";

export function ContentLimiter({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Bypass limiter for URLs ending with 'bai-0'
  if (pathname.endsWith('bai-0')) {
    return <>{children}</>;
  }

  // Don't limit content on the main docs page, only on specific articles
  if (pathname === '/docs') {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="py-8 text-center">
        <p>Loading content...</p>
      </div>
    );
  }

  // Check if user is logged in
  if (!session?.user) {
    return (
      <>
        <div className="relative max-h-[32rem] overflow-hidden">
          {children}
          {/* Hiệu ứng fade-out cho ~5 dòng cuối */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background from-0% via-background via-50% to-transparent to-100%" />
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="font-semibold">Đăng nhập để xem toàn bộ nội dung</p>
          <Button asChild>
            <Link href={`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`}>Đăng nhập</Link>
          </Button>
        </div>
      </>
    );
  }

  // Check if user has premium status (status field, default to false if not set)
  const isPremium = session.user.status === true;

  if (!isPremium) {
    return (
      <>
        <div className="relative max-h-[32rem] overflow-hidden">
          {children}
          {/* Hiệu ứng fade-out cho ~5 dòng cuối */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background from-0% via-background via-50% to-transparent to-100%" />
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="font-semibold">Nâng cấp tài khoản Premium để xem toàn bộ nội dung</p>
          <Button onClick={() => setShowUpgradeModal(true)}>
            Nâng cấp ngay - 200,000 VNĐ
          </Button>
        </div>
        <UpgradeAccountModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </>
    );
  }

  // User is logged in and has premium status
  return <>{children}</>;
}
