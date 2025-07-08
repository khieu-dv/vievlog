// app/vieclone/page.tsx
import { Header } from "~/ui/components/header";

export default function VieClonePage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex items-center justify-center py-12 px-4">
                <div className="bg-white max-w-3xl w-full shadow-xl rounded-2xl p-8 space-y-6">
                    <div className="flex flex-col items-center">

                        <h1 className="text-3xl font-bold text-gray-800">VieClone</h1>
                        <p className="text-gray-600 text-center mt-2">
                            Phần mềm tải video từ <strong>YouTube</strong>, <strong>Facebook</strong> và nhiều nền tảng khác chỉ với một đường link.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 mb-2 font-medium">Tính năng nổi bật:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Nhập link → tải ngay</li>
                            <li>Hỗ trợ nhiều nền tảng như YouTube, Facebook</li>
                            <li>Chạy mượt mà trên hệ điều hành Windows</li>
                            <li>Giao diện đơn giản, dễ sử dụng</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://github.com/khieu-dv/vie-clone/releases/download/1.0.0/vieclone_tauri_0.1.0_x64-setup.exe"
                            download
                            className="inline-block bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Tải xuống cho Windows (.exe)
                        </a>
                        <p className="text-sm text-gray-500 mt-2">Phiên bản hiện tại: 5.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
