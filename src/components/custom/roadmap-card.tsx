"use client";

import { ExternalLink, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

type RoadmapCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  icon2?: LucideIcon;
  link: string;
  isUpcoming?: boolean;
};

export function RoadmapCard(props: RoadmapCardProps) {
  const {
    isUpcoming,
    link,
    title,
    description,
    icon: Icon,
    icon2: Icon2,
  } = props;

  if (isUpcoming) {
    return (
      <div className="group relative block rounded-xl border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-50 p-5 overflow-hidden dark:border-gray-800 dark:from-gray-900 dark:to-slate-900">
        <div className="mb-2 sm:mb-5 flex flex-row items-center">
          <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-black">
            <Icon className="h-3 sm:h-5" />
          </div>
          {Icon2 && (
            <>
              <span className="mx-2 text-gray-400">+</span>
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-black">
                <Icon2 className="h-3 sm:h-5" />
              </div>
            </>
          )}
        </div>
        <span className="mb-0.5 block text-lg font-semibold text-gray-900 dark:text-white sm:mb-2 sm:text-xl">
          {title}
        </span>
        <p className="min-h-[40px] text-sm text-gray-500 dark:text-gray-400">{description}</p>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/70 dark:bg-slate-900/70">
          <span className="transform rounded-lg bg-black py-1 px-2 text-sm font-semibold text-white -rotate-45">
            Coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={link}
      className="group relative block rounded-xl border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-50 p-3.5 transition-colors duration-200 ease-in-out hover:cursor-pointer hover:border-black/30 hover:bg-gray-50/70 hover:shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-slate-900 dark:hover:border-gray-700 dark:hover:bg-slate-800 sm:p-5"
    >
      <div className="mb-2 flex flex-row items-center sm:mb-5">
        <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-black">
          <Icon className="h-4 sm:h-5" />
        </div>
        {Icon2 && (
          <>
            <span className="mx-2 text-gray-400">+</span>
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-black">
              <Icon2 className="h-4 sm:h-5" />
            </div>
          </>
        )}
      </div>
      <ExternalLink className="lucide lucide-external-link absolute right-2 top-2 h-4 text-gray-300 transition group-hover:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-300" />
      <span className="mb-0 block text-lg font-semibold text-gray-900 dark:text-white sm:mb-2 sm:text-xl">
        {title}
      </span>
      <p className="min-h-[40px] text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Link>
  );
}