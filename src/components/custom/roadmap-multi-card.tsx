"use client";

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

type RoadmapMultiCardProps = {
  roadmaps: {
    title: string;
    link: string;
  }[];
  description: string;
  secondaryRoadmaps?: {
    title: string;
    link: string;
  }[];
  secondaryDescription?: string;
};

export function RoadmapMultiCard(props: RoadmapMultiCardProps) {
  const { roadmaps, description, secondaryRoadmaps, secondaryDescription } = props;
  
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-50 ease-in-out dark:border-gray-800 dark:from-gray-900 dark:to-slate-900">
      <div className="flex flex-col divide-y dark:divide-gray-800">
        {roadmaps.map((roadmap, index) => (
          <Link
            key={index}
            href={roadmap.link}
            className="group flex w-full items-center justify-between gap-2 bg-gradient-to-br from-gray-100 to-gray-50 px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 dark:from-gray-900 dark:to-slate-900 dark:hover:bg-slate-800 sm:px-5 sm:text-base"
          >
            {roadmap.title}
            <ExternalLink className="h-4 text-gray-300 transition group-hover:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-300" />
          </Link>
        ))}
      </div>

      <p className="grow bg-gray-200/70 p-4 text-sm text-gray-500 dark:bg-slate-800/70 dark:text-gray-400 sm:p-5">
        {description}
      </p>

      {secondaryRoadmaps && (
        <div className="flex flex-col divide-y dark:divide-gray-800">
          {secondaryRoadmaps.map((roadmap, index) => (
            <Link
              key={index}
              href={roadmap.link}
              className="group flex w-full items-center justify-between gap-2 bg-gradient-to-br from-gray-100 to-gray-50 px-5 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 dark:from-gray-900 dark:to-slate-900 dark:hover:bg-slate-800 sm:text-base"
            >
              {roadmap.title}
              <ExternalLink className="h-4 text-gray-300 transition group-hover:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-300" />
            </Link>
          ))}
        </div>
      )}

      {secondaryDescription && (
        <p className="grow bg-gray-200/70 p-4 text-sm text-gray-500 dark:bg-slate-800/70 dark:text-gray-400 sm:p-5">
          {secondaryDescription}
        </p>
      )}
    </div>
  );
}