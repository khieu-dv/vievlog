"use client";

import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { Button } from "~/components/ui/Button";
import {
  Code2,
  Smartphone,
  Zap,
  Check,
  ArrowRight,
  Globe,
  Palette,
  ShoppingCart,
  BarChart,
  Users,
  Mail
} from "lucide-react";

export default function ServicesPage() {
  const handleContact = () => {
    window.open("https://www.facebook.com/khieu.dv96", "_blank");
  };

  const nextjsFeatures = [
    "Website doanh nghiệp",
    "Landing page chuyển đổi cao",
    "E-commerce / Cửa hàng trực tuyến",
    "Blog & Trang tin tức",
    "Dashboard quản trị",
    "SEO tối ưu, tốc độ nhanh",
    "Responsive mọi thiết bị",
    "Tích hợp thanh toán, CRM",
  ];

  const flutterFeatures = [
    "Ứng dụng iOS & Android từ 1 mã nguồn",
    "UI/UX hiện đại, mượt mà",
    "Tích hợp API, Backend",
    "Push notification",
    "Thanh toán in-app",
    "Maps, Location tracking",
    "Chat realtime",
    "Upload hình ảnh, video",
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Hiệu suất cao",
      description: "Tối ưu tốc độ, SEO và trải nghiệm người dùng"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Thiết kế đẹp",
      description: "Giao diện hiện đại, chuyên nghiệp, responsive"
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Code sạch",
      description: "Dễ bảo trì, mở rộng và nâng cấp"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Hỗ trợ tận tâm",
      description: "Tư vấn, hướng dẫn sử dụng và bảo hành"
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Dịch Vụ Phát Triển
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Website & Mobile App
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Chuyên thiết kế website bằng <strong>Next.js</strong> và phát triển ứng dụng di động <strong>Android/iOS</strong> bằng <strong>Flutter</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContact}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Liên hệ tư vấn miễn phí
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-6 text-lg"
              >
                Xem dịch vụ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Dịch Vụ Của Chúng Tôi
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Giải pháp công nghệ toàn diện cho doanh nghiệp của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Next.js Service */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 border border-blue-100 dark:border-blue-900 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />

              <div className="relative">
                <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Website với Next.js
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Xây dựng website hiện đại, tốc độ cao, SEO tối ưu với Next.js - Framework React tốt nhất hiện nay
                </p>

                <ul className="space-y-3 mb-8">
                  {nextjsFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Tốc độ tải trang 90+ điểm Google PageSpeed
                  </span>
                </div>
              </div>
            </div>

            {/* Flutter Service */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-8 border border-cyan-100 dark:border-cyan-900 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />

              <div className="relative">
                <div className="w-16 h-16 bg-cyan-600 dark:bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                  Mobile App với Flutter
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Phát triển ứng dụng di động đa nền tảng (iOS & Android) với Flutter - Hiệu suất native, chi phí tối ưu
                </p>

                <ul className="space-y-3 mb-8">
                  {flutterFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4 pt-4 border-t border-cyan-200 dark:border-cyan-800">
                  <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    60 FPS mượt mà trên mọi thiết bị
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Vì Sao Chọn Chúng Tôi?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Hint Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 md:p-12 border border-blue-100 dark:border-blue-900">
            <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Chi Phí Linh Hoạt
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Báo giá phụ thuộc vào quy mô và tính năng dự án. Chúng tôi cam kết mức giá cạnh tranh và minh bạch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContact}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Nhận báo giá miễn phí
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn Sàng Bắt Đầu Dự Án?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn
          </p>
          <Button
            onClick={handleContact}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
          >
            <Mail className="mr-2 h-5 w-5" />
            Liên hệ qua Facebook
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
