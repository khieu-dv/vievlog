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
                            A tool to download videos from <strong>YouTube</strong>, <strong>Facebook</strong>, and many other platforms using just a link.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 mb-2 font-medium">Key Features:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Paste a link → download instantly</li>
                            <li>Supports multiple platforms like YouTube, Facebook</li>
                            <li>Runs smoothly on Windows OS</li>
                            <li>Simple and user-friendly interface</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://github.com/khieu-dv/vie-clone/releases/download/1.0.0/vieclone_tauri_0.1.0_x64-setup.exe"
                            download
                            className="inline-block bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
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
