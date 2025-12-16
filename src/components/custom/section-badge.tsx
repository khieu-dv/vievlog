"use client";

type SectionBadgeProps = {
  title: string;
};

export function SectionBadge(props: SectionBadgeProps) {
  const { title } = props;

  return (
    <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white dark:bg-white dark:text-black">
      {title}
    </span>
  );
}