"use client";

import { PopularTopic, TrendingTech } from '../../lib/types';

interface LeftSidebarProps {
    sidebarVisible: boolean;
    toggleSidebar: () => void;
    popularTopics: PopularTopic[];
    trendingTechnologies: TrendingTech[];
    onCategorySelect?: (categoryId: string) => void;
    selectedCategoryId?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
    sidebarVisible,
    toggleSidebar,
    popularTopics,
    trendingTechnologies,
    onCategorySelect,
    selectedCategoryId
}) => {
    const handleCategoryClick = (categoryId: string) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId);
        }
        // Auto close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    const handleViewAllTopics = () => {
        if (onCategorySelect) {
            onCategorySelect("");
        }
        // Auto close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    return (
        <aside
            className={`lg:w-1/4 xl:w-1/5 pr-0 lg:pr-4
                ${sidebarVisible
                    ? 'fixed inset-0 z-40 bg-white dark:bg-gray-900 p-4 overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:p-0 lg:bg-transparent dark:lg:bg-transparent'
                    : 'hidden lg:block'}
            `}
        >
            {/* Close button for mobile sidebar */}
            {sidebarVisible && (
                <div className="flex justify-end lg:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Popular Programming Topics */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <h3 className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold dark:text-white">Popular Topics</h3>
                <ul className="space-y-2">
                    {popularTopics.map((topic, index) => (
                        <li key={topic.id || index}>
                            <button
                                onClick={() => handleCategoryClick(topic.id || "")}
                                className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors duration-200 ${selectedCategoryId === topic.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className="mr-3 flex h-8 w-8 items-center justify-center rounded-md"
                                        style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                                    >
                                        {topic.icon}
                                    </div>
                                    <span className={`font-medium ${selectedCategoryId === topic.id
                                        ? 'text-blue-700 dark:text-blue-300'
                                        : 'dark:text-gray-200'
                                        }`}>
                                        {topic.title}
                                    </span>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs ${selectedCategoryId === topic.id
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                    {topic.count}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleViewAllTopics}
                    className={`mt-3 w-full rounded-md py-2 text-sm font-medium transition-colors duration-200 ${!selectedCategoryId
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    {!selectedCategoryId ? 'All Topics (Current)' : 'View All Topics'}
                </button>
            </div>

            {/* Trending Technologies */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <h3 className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold dark:text-white">Trending Technologies</h3>
                <ul className="space-y-3">
                    {trendingTechnologies.map((tech, index) => (
                        <li key={index} className="rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                                <span className="font-medium dark:text-gray-200">{tech.name}</span>
                                <span className={`text-sm font-medium ${tech.growthPercentage > 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {tech.growthPercentage > 0 ? '+' : ''}{tech.growthPercentage}%
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};