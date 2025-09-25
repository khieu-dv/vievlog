"use client";

import { useSession } from "@/lib/authClient";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ContentLimiter({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

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

  if (session?.user) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative max-h-[25rem] overflow-hidden">
        {children}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
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
