import { ProfilePageClient } from "./client";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });


export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <div className="relative">
        {/* Logo chữ V */}
        <h1 className={`${inter.className} text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800`}>
          V
        </h1>
        {/* Hiệu ứng bóng nhẹ */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl" />
      </div>
    </div>
  )
}
