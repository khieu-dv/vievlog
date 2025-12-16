"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Crown } from "lucide-react";

interface UpgradeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeAccountModal({
  isOpen,
  onClose,
}: UpgradeAccountModalProps) {
  const handleContactFacebook = () => {
    window.open("https://www.facebook.com/khieu.dv96", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 [&>button]:text-slate-500 [&>button]:hover:text-slate-900 dark:[&>button]:text-slate-400 dark:[&>button]:hover:text-slate-100 [&>button]:bg-slate-100 dark:[&>button]:bg-slate-800 [&>button]:rounded-full [&>button]:p-1 [&>button]:opacity-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl text-slate-900 dark:text-slate-50">Nâng cấp tài khoản Premium</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2 text-slate-600 dark:text-slate-400">
            Để xem toàn bộ nội dung tài liệu, bạn cần nâng cấp tài khoản lên Premium.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                200,000
              </span>
              <span className="text-lg text-slate-600 dark:text-slate-400">VNĐ</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Thanh toán một lần, sử dụng trọn đời
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-50">
              Quyền lợi Premium:
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Truy cập không giới hạn toàn bộ tài liệu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Cập nhật nội dung mới liên tục</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Hỗ trợ trực tiếp từ tác giả</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Không quảng cáo</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Để nâng cấp tài khoản, vui lòng liên hệ qua Facebook:
            </p>
            <Button
              onClick={handleContactFacebook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Liên hệ qua Facebook
            </Button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
            Sau khi thanh toán, tài khoản của bạn sẽ được kích hoạt trong vòng 24h
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
