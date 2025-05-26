'use client';

import * as React from "react";
import { X, Youtube, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ContactButton = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isHovering, setIsHovering] = React.useState(false);
    const { t } = useTranslation();

    const youtuberLink = "https://www.youtube.com/@vie-vlogs";

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
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={menuRef}
        >
            {/* Menu contact hiện ra khi isHovering=true hoặc isOpen=true */}
            <div className={`flex flex-col items-end gap-3 transition-all duration-500 ease-out ${(isHovering || isOpen)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                }`}>
                {/* YouTube Button */}
                <div className="flex items-center gap-3 group">
                    {/* Tooltip */}
                    <div className={`
                        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                        bg-white dark:bg-gray-800 
                        text-gray-700 dark:text-gray-200
                        shadow-lg dark:shadow-gray-900/30
                        border border-gray-200 dark:border-gray-700
                        backdrop-blur-sm
                        transition-all duration-300
                        ${(isHovering || isOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                    `}>
                        {t("Follow us on Youtube")}
                    </div>

                    {/* YouTube Icon */}
                    <a
                        href={youtuberLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            relative p-4 rounded-full text-white 
                            bg-gradient-to-r from-red-500 to-red-600
                            hover:from-red-600 hover:to-red-700
                            hover:scale-110 active:scale-95
                            transition-all duration-300 ease-out
                            flex items-center justify-center 
                            shadow-lg hover:shadow-xl
                            shadow-red-500/25 hover:shadow-red-500/40
                            dark:shadow-red-500/20 dark:hover:shadow-red-500/30
                            group-hover:rotate-3
                        `}
                        aria-label={t("Follow us on Youtube")}
                    >
                        <Youtube size={24} className="drop-shadow-sm" />

                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
                    </a>
                </div>
            </div>

            {/* Button chính */}
            <button
                onClick={handleToggleClick}
                className={`
                    relative p-4 rounded-full flex items-center justify-center 
                    shadow-lg hover:shadow-xl active:scale-95
                    transition-all duration-300 ease-out
                    ${isOpen
                        ? `bg-gradient-to-r from-red-500 to-red-600 text-white 
                           scale-110 rotate-90 shadow-red-500/30`
                        : `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                           text-white hover:scale-110 
                           shadow-blue-500/25 hover:shadow-blue-500/40
                           dark:shadow-blue-500/20`
                    }
                    group overflow-hidden
                `}
                aria-label={isOpen ? t("Close contact options") : t("Contact Us")}
            >
                {/* Background glow */}
                <div className={`
                    absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300
                    ${isOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }
                `} />

                {/* Icon container */}
                <div className="relative z-10">
                    {isOpen ? (
                        <X size={28} className="drop-shadow-sm transition-transform duration-300" />
                    ) : (
                        <MessageCircle size={28} className="drop-shadow-sm transition-transform duration-300" />
                    )}
                </div>

                {/* Ripple effect */}
                <div className={`
                    absolute inset-0 rounded-full opacity-0 
                    bg-white/20 dark:bg-white/10
                    scale-0 group-active:scale-100 group-active:opacity-100
                    transition-all duration-150
                `} />
            </button>

            {/* Floating particles effect (optional) */}
            {isOpen && (
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            )}
        </div>
    );
};