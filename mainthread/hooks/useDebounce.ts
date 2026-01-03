import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number, onUpdate?: (value: T) => void): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
            onUpdate?.(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
