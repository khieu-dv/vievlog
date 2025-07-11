// app/vieshare/page.tsx
import { Header } from "~/ui/components/header";

export default function VieSharePage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex items-center justify-center py-12 px-4">
                <div className="bg-white max-w-3xl w-full shadow-xl rounded-2xl p-8 space-y-6">
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-gray-800">VieShare</h1>
                        <p className="text-gray-600 text-center mt-2">
                            Ứng dụng quản lý cấu hình và kết nối tới <strong>FRP (Fast Reverse Proxy)</strong> một cách trực quan và dễ dàng.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 mb-2 font-medium">Tính năng chính:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Kết nối/ngắt kết nối FRP server nhanh chóng</li>
                            <li>Thêm và xóa port động ngay trong ứng dụng</li>
                            <li>Truy cập nhanh ứng dụng từ xa qua port</li>
                            <li>Tự động đặt tên proxy và chọn port phù hợp</li>
                            <li>Xem trạng thái kết nối và lượng port đang dùng</li>
                            <li>Bảo mật bằng token</li>
                            <li>Giao diện tối giản, hoạt động mượt mà</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://github.com/khieu-dv/vieshare/releases/download/1.1.0/vieshare_tauri_1.1.0_x64-setup.exe"
                            download
                            className="inline-block bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Tải xuống cho Windows (.exe)
                        </a>
                        <p className="text-sm text-gray-500 mt-2">Phiên bản hiện tại: 1.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
