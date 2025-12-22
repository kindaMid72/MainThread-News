'use client'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PopUpMessage({
    title,
    message,
    type = 'success', // success, error, warning, info
    duration = 3000,
    onClose
}) {
    const [isVisible, setIsVisible] = useState(false);

    const styleMap = {
        success: {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            border: 'border-green-500',
            bg: 'bg-green-50 dark:bg-green-950',
            titleColor: 'text-green-800 dark:text-green-400'
        },
        error: {
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            border: 'border-red-500',
            bg: 'bg-red-50 dark:bg-red-950',
            titleColor: 'text-red-800 dark:text-red-400'
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
            border: 'border-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-950',
            titleColor: 'text-yellow-800 dark:text-yellow-400'
        },
        info: {
            icon: <Info className="w-6 h-6 text-blue-500" />,
            border: 'border-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-950',
            titleColor: 'text-blue-800 dark:text-blue-400'
        }
    };

    const activeStyle = styleMap[type] || styleMap.info;

    useEffect(() => {
        const enterTimeout = setTimeout(() => setIsVisible(true), 50);

        const exitTimeout = setTimeout(() => setIsVisible(false), duration);

        const unmountTimeout = setTimeout(() => {
            if (onClose) onClose();
        }, duration + 300); // 300ms matches transition duration

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
            clearTimeout(unmountTimeout);
        };
    }, [duration, onClose]);

    return (
        <div className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className={`flex items-start gap-3 p-4 min-w-[320px] max-w-sm rounded-lg shadow-lg border-l-4 bg-white dark:bg-gray-800 ${activeStyle.border} ${activeStyle.bg}`}>
                <div className="shrink-0">
                    {activeStyle.icon}
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-base ${activeStyle.titleColor}`}>
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 break-words">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}