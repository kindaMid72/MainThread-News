"use client";

import { format } from "date-fns";

interface FormattedDateProps {
    date: string | number | Date;
    formatStr: string;
    className?: string;
}

export default function FormattedDate({ date, formatStr, className }: FormattedDateProps) {
    if (!date) return null;

    return (
        <span suppressHydrationWarning className={className}>
            {format(new Date(date), formatStr)}
        </span>
    );
}
