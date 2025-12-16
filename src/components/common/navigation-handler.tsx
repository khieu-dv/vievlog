"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component để handle navigation và reload trang khi cần thiết
 * để đồng bộ theme giữa các layouts khác nhau
 */
export function NavigationHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Handler cho clicks vào home links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');

      // Nếu đang ở docs/docs/mobile-docs và click vào home link
      if (href === '/' && (
        pathname?.startsWith('/docs') ||
        pathname?.startsWith('/docs') ||
        pathname?.startsWith('/mobile-docs')
      )) {
        e.preventDefault();
        window.location.href = '/';
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  return null;
}
