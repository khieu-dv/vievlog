"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type TipItemProps = {
  title: string;
  description: string;
};

export function TipItem(props: TipItemProps) {
  const { title, description } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button
        className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="pb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}