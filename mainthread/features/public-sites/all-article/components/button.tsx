'use client';
import { redirect } from "next/navigation";

export default function Button({page, content, disabled, currentPage, totalPages, limit, className}: {page: number, content: React.ReactNode, disabled: boolean, currentPage: number, totalPages: number, limit: number, className: string}) {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            redirect(`/articles?page=${newPage}&limit=${limit}`)
        }
    };


    return (
        <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            className={className}
        >{content}</button>
    );
}