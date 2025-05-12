'use client';

import * as React from "react";
import { MessageCircle, Facebook, Phone, HelpCircle, X, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ContactButton = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isHovering, setIsHovering] = React.useState(false);
    const { t } = useTranslation();

    // Số điện thoại và link Messenger của bạn https://www.facebook.com/khieu.dv96
    const phoneNumber = "+84123456789";
    const messengerLink = "https://www.youtube.com/@vie-vlogs";
    // const messengerLink = "https://m.me/khieu.dv96";

    // Xử lý hover
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        // Chỉ đóng khi không ở trạng thái mở cố định
        if (!isOpen) {
            setIsHovering(false);
        }
    };

    // Xử lý click
    const handleToggleClick = () => {
        setIsOpen(!isOpen);
        // Nếu đang mở và click để đóng, đảm bảo isHovering cũng là false
        if (isOpen) {
            setIsHovering(false);
        } else {
            setIsHovering(true);
        }
    };

    // Đóng menu khi click ra ngoài
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
                setIsHovering(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={menuRef}
        >
            {/* Menu contact hiện ra khi isHovering=true hoặc isOpen=true */}
            <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${(isHovering || isOpen)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 pointer-events-none"
                }`}>
                <a
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg group"
                    aria-label={t("Follow us on Youtube")}
                >
                    <Youtube size={24} />
                    <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t("Follow us on Youtube")}
                    </span>
                </a>

                {/* <a
                    href={`tel:${phoneNumber}`}
                    className="bg-green-500 p-3 rounded-full text-white hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg group"
                    aria-label={t("Call us")}
                >
                    <Phone size={24} />
                    <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t("Call us")}
                    </span>
                </a> */}
            </div>

            {/* Button chính */}
            <button
                onClick={handleToggleClick}
                className={`p-4 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 ${isOpen
                    ? "bg-red-500 scale-110"
                    : isHovering
                        ? "bg-primary scale-110"
                        : "bg-primary hover:scale-105"
                    }`}
                aria-label={isOpen ? t("Close contact options") : t("Contact Us")}
            >
                {isOpen ? <X size={28} /> : <HelpCircle size={28} />}
            </button>
        </div>
    );
};