'use client';

import { useState } from 'react';

export type Category = {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    questionCount: number;
};

const categories: Category[] = [
    {
        id: 'english',
        name: 'English',
        icon: '📚',
        color: 'from-blue-500 to-blue-700',
        description: 'Grammar, Vocabulary & Reading',
        questionCount: 15
    },
    {
        id: 'IT',
        name: 'Information Technology',
        icon: '💻',
        color: 'from-green-500 to-green-700',
        description: 'Programming, Web Dev & Computer Science',
        questionCount: 9
    },
    {
        id: 'Korean',
        name: 'Korean Language',
        icon: '🇰🇷',
        color: 'from-purple-500 to-purple-700',
        description: 'Basic Korean, Grammar & Phrases',
        questionCount: 9
    }
];

interface CategorySelectionProps {
    onCategorySelect: (category: string) => void;
    onClose?: () => void;
}

export default function CategorySelection({ onCategorySelect, onClose }: CategorySelectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setIsAnimating(true);
        
        // Small delay for animation effect
        setTimeout(() => {
            onCategorySelect(categoryId);
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-600 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        🎓 Choose Your Learning Category
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">
                        Select a category to start your educational adventure!
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            disabled={isAnimating}
                            className={`
                                relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                                ${selectedCategory === category.id 
                                    ? 'border-yellow-400 bg-gradient-to-br ' + category.color + ' shadow-2xl scale-105' 
                                    : 'border-gray-600 bg-gradient-to-br ' + category.color + ' hover:border-gray-400'
                                }
                                ${isAnimating ? 'pointer-events-none' : ''}
                            `}
                        >
                            {/* Category Icon */}
                            <div className="text-6xl mb-4 text-center">
                                {category.icon}
                            </div>

                            {/* Category Name */}
                            <h3 className="text-xl font-bold text-white mb-2 text-center">
                                {category.name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-200 text-sm text-center mb-4">
                                {category.description}
                            </p>

                            {/* Question Count */}
                            <div className="bg-black/30 rounded-lg p-2 text-center">
                                <span className="text-yellow-300 font-semibold">
                                    {category.questionCount} Questions
                                </span>
                            </div>

                            {/* Selection Indicator */}
                            {selectedCategory === category.id && (
                                <div className="absolute top-2 right-2 text-yellow-300 text-2xl animate-pulse">
                                    ✨
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Instructions */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        📋 How to Play
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Defeat enemy bots by shooting them</li>
                        <li>• Answer questions correctly to gain points</li>
                        <li>• Higher difficulty = more points but harder questions</li>
                        <li>• Use arrow keys to move, Space to shoot, D for special attack</li>
                    </ul>
                </div>

                {/* Close Button (for settings menu later) */}
                {onClose && (
                    <div className="text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Loading Animation */}
                {isAnimating && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-4 animate-spin">⚡</div>
                            <div className="text-white font-semibold">Loading Questions...</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}