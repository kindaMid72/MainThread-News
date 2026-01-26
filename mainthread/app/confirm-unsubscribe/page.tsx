
'use client';

import MainThreadLogo from "@/components/MainThreadLogo";
import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmUnsubscribe() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }
    }, [token]);

    const handleConfirm = async () => {
        setStatus('loading');
        try {
            const response = await api.post('/api/unsubscribe/confirm', { token });
            if (response.status === 200) {
                setStatus('success');
                setMessage('You have been unsubscribed successfully. We\'re sad to see you go!');
            } else {
                throw new Error(response.data.message || 'Unsubscribe failed');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to confirm unsubscribe. Please try again.');
        }
    };

    return (
        <div className="min-h-screen z-50 bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl border border-gray-200">
                <div className="flex justify-center mb-8">
                    <MainThreadLogo className="text-black!" />
                </div>

                <h1 className="text-2xl font-bold text-black mb-4">
                    Confirm Unsubscribe
                </h1>

                {status === 'loading' && token && (
                    <div className="mb-6">
                        <p className="text-zinc-500 mb-6">
                            Are you sure you want to unsubscribe? You will stop receiving updates and newsletters.
                        </p>
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                        >
                            Confirm Unsubscription
                        </button>
                    </div>
                )}
                {status === 'loading' && !token && (
                    <p className="text-zinc-400">Validating...</p>
                )}


                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:text-gray-600 underline transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-8">{message}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:text-gray-600 underline transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}