// components/Loading.tsx
import React from 'react';

export const Loading: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-800 text-white">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
                <p>Loading 3D experience...</p>
            </div>
        </div>
    );
};