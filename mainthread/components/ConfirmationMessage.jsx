"use client";

import { AlertTriangle, Check, Info } from "lucide-react";
import { useEffect, useState } from "react";

const colorMap = {
    red: {
        bg: 'bg-red-600',
        hover: 'hover:bg-red-700',
        disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
        text: 'text-white',
        icon: <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    },
    green: {
        bg: 'bg-green-600',
        hover: 'hover:bg-green-700',
        disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
        text: 'text-white',
        icon: <Check className="w-12 h-12 text-green-500 mb-4" />
    },
    gray: {
        bg: 'bg-gray-200',
        hover: 'hover:bg-gray-300',
        text: 'text-gray-800',
        disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
        icon: <Info className="w-12 h-12 text-gray-500 mb-4" />
    },
    blue: {
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
        text: 'text-white',
        icon: <Info className="w-12 h-12 text-blue-500 mb-4" />
    }
};

export default function ConfirmationMessage({
    title,
    message,
    onConfirm,
    onCancel,
    delayConfirm = false,
    delayCancel = false,
    confirmColor = 'red',
    cancelColor = 'gray',
    delaySecond = 5,
    backgroundClass = ''
}) {
    const [timeLeft, setTimeLeft] = useState(delaySecond);

    useEffect(() => {
        if (!delayConfirm || timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [delayConfirm, timeLeft]);

    const activeStyle = colorMap[confirmColor] || colorMap.red;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onCancel}
                className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity ${backgroundClass}`}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    {activeStyle.icon}

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-500 mb-6">
                        {message}
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={onCancel}
                            disabled={delayCancel && timeLeft > 0}
                            className={`flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer ${colorMap.gray.disabled}`}
                        >
                            Batalkan
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={delayConfirm && timeLeft > 0}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${activeStyle.bg} ${activeStyle.hover} ${activeStyle.text} ${activeStyle.disabled}`}
                        >
                            {delayConfirm && timeLeft > 0 ? `Tunggu (${timeLeft}s)` : 'Konfirmasi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
