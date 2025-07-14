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
                            An intuitive and easy-to-use application for managing configurations and connections to <strong>FRP (Fast Reverse Proxy)</strong>.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 mb-2 font-medium">Key Features:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Quickly connect/disconnect to the FRP server</li>
                            <li>Add and remove ports dynamically within the app</li>
                            <li>Instant remote access via port</li>
                            <li>Auto-generate proxy names and assign suitable ports</li>
                            <li>Monitor connection status and port usage</li>
                            <li>Secure access with token-based authentication</li>
                            <li>Minimalist interface with smooth performance</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://github.com/khieu-dv/vieshare/releases/download/1.1.0/vieshare_tauri_1.1.0_x64-setup.exe"
                            download
                            className="inline-block bg-green-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Download for Windows (.exe)
                        </a>
                        <p className="text-sm text-gray-500 mt-2">Current version: 1.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
