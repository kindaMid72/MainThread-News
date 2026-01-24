"use client";

import { useRouter } from "next/navigation";

export default function Button({ page, content, disabled, currentPage, totalPages, limit, categorySlug, className }: { page: number, content: React.ReactNode, disabled: boolean, currentPage: number, totalPages: number, limit: number, categorySlug: string, className: string }) {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.push(`/categories/${categorySlug}?page=${newPage}&limit=${limit}`);
        }
    };

    return (
        <button
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            className={className}
        >
            {content}
        </button>
    );
}
