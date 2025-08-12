import React from 'react';
import { BookOpen, Rocket, Settings, Code, Video, MessageCircle, Shield, Globe, GitBranch } from 'lucide-react';

export const getIconComponent = (iconName: string): React.ReactNode => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'book-open': BookOpen,
    'code': Code,
    'rocket': Rocket,
    'settings': Settings,
    'video': Video,
    'message-circle': MessageCircle,
    'shield': Shield,
    'globe': Globe,
    'git-branch': GitBranch,
  };

  const IconComponent = iconMap[iconName] || BookOpen;
  return <IconComponent className="h-4 w-4" />;
};