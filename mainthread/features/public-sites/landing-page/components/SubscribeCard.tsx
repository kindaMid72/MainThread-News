'use client'
import MainThreadLogo from "@/components/MainThreadLogo";
import { useState } from "react";

import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';

export default function SubscribeCard() {

    const [email, setEmail] = useState('');
    const [submittingType, setSubmittingType] = useState<'subscribe' | 'unsubscribe' | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // handler
    const handleSubscribe = async () => {
        setSubmittingType('subscribe');
        setError('');
        setSuccess('');
        try {
            const response = await api.post(`/api/subscribe/${email}`);
            console.log(response);
            if (response?.status !== 200 && response?.status !== 201) {
                throw new Error(`Failed to attempt subscribe, ${response?.data?.message}`);
            }
            setEmail('');
            setSuccess('check your email to confirm your subscription');
        } catch (error) {
            console.log(error);
            setError('Failed to subscribe. Please try again.');
        } finally {
            setSubmittingType(null);
        }
    };

    const handleUnsubscribe = async () => {
        if (!email) {
            setError('Please enter your email to unsubscribe');
            return;
        }
        setSubmittingType('unsubscribe');
        setError('');
        setSuccess('');
        try {
            const response = await api.post(`/api/unsubscribe/${email}`);
            if (response?.status !== 200) {
                throw new Error('Failed to unsubscribe');
            }
            setEmail('');
            setSuccess('Unsubscribe email sent. Please check your inbox.');
        } catch (error) {
            setError('Failed to unsubscribe. Please try again.');
        } finally {
            setSubmittingType(null);
        }
    };

    return (
        <section id="subscribe-section" className="mt-24 py-20 bg-zinc-900 rounded-3xl text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
                <MainThreadLogo className="text-white!" />
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                    Stay Ahead of the Curve
                </h2>
                <p className="text-zinc-400 text-lg mb-8">
                    Get the latest tech news, industry insights, and in-depth analysis delivered straight to your inbox.
                </p>

                {/* Error/Success Message */}
                {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
                {success && <p className="text-green-500 mb-4 font-medium">{success}</p>}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={!!submittingType}
                        className="px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px] disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubscribe}
                        disabled={!!submittingType || !email}
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                    >
                        {submittingType === 'subscribe' ? 'Processing...' : 'Subscribe Now'}
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleUnsubscribe}
                        disabled={!!submittingType || !email}
                        className="text-zinc-500 underline text-sm hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submittingType === 'unsubscribe' ? 'Processing...' : 'Unsubscribe'}
                    </button>
                </div>
            </div>
        </section>
    )
}