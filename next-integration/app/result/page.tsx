'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResultContent() {
    const searchParams = useSearchParams();
    const processStatus = searchParams.get('Process');

    const isSuccess = processStatus === 'success';
    const isFail = processStatus === 'fail';

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl m-10 border border-gray-200">
            <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-2">
                    Transaction Result
                </div>

                <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
                    Process Status: <span className={isSuccess ? "text-green-600" : isFail ? "text-red-600" : "text-gray-600"}>
                        {processStatus || 'Unknown'}
                    </span>
                </h1>

                <p className="mt-4 text-gray-500">
                    This page was rendered because the URL was rewritten from <code>/ShoppingCartInternational.html</code> to <code>/result</code>.
                </p>

                <div className="mt-6 flex gap-4">
                    <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                        Return to Checkout
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ResultPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Suspense fallback={<div>Loading result...</div>}>
                <ResultContent />
            </Suspense>
        </div>
    );
}
