'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ShoppingCartContent() {
    const searchParams = useSearchParams();
    const processValue = searchParams.get('Process');

    // Check key existence explicitly to handle empty string case correctly (?Process=)
    // Next.js searchParams.has() is the robust way to check key existence
    const hasProcessParam = searchParams.has('Process');

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="max-w-2xl w-full text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200">
                <h1 className="text-3xl font-bold mb-6 text-indigo-700">Shopping Cart International</h1>

                <div className="mt-8 p-6 bg-gray-50 rounded border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Process Parameter Status</h2>

                    {hasProcessParam ? (
                        <div className="space-y-2">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                ✅ Process Defined
                            </div>
                            <div className="mt-4 text-xl">
                                Value: <span className="font-mono font-bold text-gray-900 bg-gray-200 px-2 py-1 rounded">
                                    {processValue === '' ? '(empty string)' : processValue}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                ⚠️ No Process Parameter
                            </div>
                            <p className="text-gray-500 mt-2">
                                The URL does not contain ?Process=...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShoppingCartInternational() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading parameters...</div>}>
            <ShoppingCartContent />
        </Suspense>
    );
}
