"use client";

import { AlertCircle, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConfirmEmailPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation States
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [isRobust, setIsRobust] = useState(false);

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Password Criteria
    const criteria = [
        { label: "Minimal 8 karakter", valid: password.length >= 8 },
        { label: "Huruf besar & kecil", valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { label: "Angka", valid: /\d/.test(password) },
        { label: "Karakter spesial (!@#$%)", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    useEffect(() => {
        const robust = criteria.every(c => c.valid);
        setIsRobust(robust);
        setPasswordsMatch(password === confirmPassword && password !== "");
    }, [password, confirmPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isRobust || !passwordsMatch) {
            setError("Mohon perbaiki kesalahan pada form.");
            return;
        }

        setIsLoading(true);

        // Simulate API Call TODO: setup api for account creation after confirmation
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Ditetapkan!</h2>
                    <p className="text-gray-600 mb-8">
                        Akun Anda telah berhasil dikonfirmasi dan password baru telah disimpan.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Masuk ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Atur Password Baru</h1>
                        <p className="text-gray-600 text-sm">
                            Silakan masukkan password baru untuk mengamankan akun Anda.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicators */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {criteria.map((c, i) => (
                                    <div key={i} className={`flex items-center gap-1.5 text-xs transition-colors ${c.valid ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${c.valid ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        {c.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${confirmPassword && !passwordsMatch
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-red-600 focus:border-red-600'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Password tidak cocok
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isRobust || !passwordsMatch || isLoading}
                            className="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:shadow-none disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Konfirmasi & Atur Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}