"use client";

import dynamic from 'next/dynamic'

const DynamicEditor = dynamic(() => import('../../components/common/JSCodeEditor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

export default function RunJSPage() {
    return <DynamicEditor />;
}