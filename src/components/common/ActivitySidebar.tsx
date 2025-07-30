"use client";

import Image from "next/image";
import { Award, Book, Star, Bell, Calendar } from "lucide-react";
import { RightSidebarProps } from '~/lib/types';



export const ActivitySidebar: React.FC<RightSidebarProps> = ({
    topContributors,
    popularCourses,
    recentAnnouncements,
    upcomingEvents
}) => {
    return (
        <aside className="lg:w-1/4 xl:w-1/5 pl-0 lg:pl-4">
            {/* Top Contributors Section */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <h3 className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold dark:text-white">Top Contributors</h3>
                <ul className="space-y-3">
                    {topContributors.map((contributor, index) => (
                        <li key={index} className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-center">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                    {contributor.avatar ? (
                                        <Image
                                            src={contributor.avatar}
                                            alt={contributor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                                            {contributor.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium dark:text-gray-200">{contributor.name}</p>
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">{contributor.points} pts</span>
                                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 text-xs text-indigo-700 dark:text-indigo-300">
                                            {contributor.badge}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Award size={16} className="text-yellow-500" />
                        </li>
                    ))}
                </ul>
                <button className="mt-3 w-full rounded-md bg-gray-100 dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    View Leaderboard
                </button>
            </div>

            {/* Popular Courses Section */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <h3 className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 text-lg font-semibold dark:text-white">Popular Courses</h3>
                <ul className="space-y-4">
                    {popularCourses.map((course, index) => (
                        <li key={index} className="rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex">
                                <div className="relative h-16 w-24 overflow-hidden rounded-md">
                                    {course.image ? (
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <Book size={20} className="dark:text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium line-clamp-2 dark:text-gray-200">{course.title}</p>
                                    <div className="mt-1 flex items-center">
                                        <Star size={14} className="text-yellow-500" />
                                        <span className="ml-1 text-sm dark:text-gray-300">{course.rating}</span>
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({course.students} students)</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="mt-3 w-full rounded-md bg-gray-100 dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    Browse All Courses
                </button>
            </div>

            {/* Recent Announcements Section */}
            <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <div className="mb-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h3 className="text-lg font-semibold dark:text-white">Announcements</h3>
                    <Bell size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <ul className="space-y-3">
                    {recentAnnouncements.map((announcement, index) => (
                        <li key={index} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                            <p className="font-medium dark:text-gray-200">{announcement.title}</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{announcement.excerpt}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{announcement.date}</p>
                        </li>
                    ))}
                </ul>
                <button className="mt-3 w-full rounded-md bg-gray-100 dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    View All
                </button>
            </div>

            {/* Upcoming Events Section */}
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow dark:shadow-gray-700">
                <div className="mb-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h3 className="text-lg font-semibold dark:text-white">Upcoming Events</h3>
                    <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                <ul className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                        <li key={index} className="rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <p className="font-medium dark:text-gray-200">{event.title}</p>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{event.date}</span>
                                <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                                    {event.type}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="mt-3 w-full rounded-md bg-gray-100 dark:bg-gray-700 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    View Calendar
                </button>
            </div>
        </aside>
    );
};