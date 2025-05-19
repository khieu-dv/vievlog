"use client";

import { Code } from "lucide-react";
import { PopularTopic, TrendingTech } from '../../lib/types';

interface LeftSidebarProps {
    sidebarVisible: boolean;
    toggleSidebar: () => void;
    popularTopics: PopularTopic[];
    trendingTechnologies: TrendingTech[];
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
    sidebarVisible,
    toggleSidebar,
    popularTopics,
    trendingTechnologies
}) => {
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
                        <li key={index}>
                            <a
                                className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="mr-3 flex h-8 w-8 items-center justify-center rounded-md"
                                        style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                                    >
                                        {topic.icon}
                                    </div>
                                    <span className="font-medium dark:text-gray-200">{topic.title}</span>
                                </div>
                                <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs dark:text-gray-300">{topic.count}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                <button className="mt-3 w-full rounded-md bg-gray-100 dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    View All Topics
                </button>
            </div>

            {/* Trending Technologies */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <h3 className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold dark:text-white">Trending Technologies</h3>
                <ul className="space-y-3">
                    {trendingTechnologies.map((tech, index) => (
                        <li key={index} className="rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="font-medium dark:text-gray-200">{tech.name}</span>
                                <span className="text-green-500">{tech.growthPercentage > 0 ? '+' : ''}{tech.growthPercentage}%</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};