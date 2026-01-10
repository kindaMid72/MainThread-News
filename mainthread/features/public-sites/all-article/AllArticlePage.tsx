"use client";

import api from "@/libs/axiosInterceptor/axiosPublicInterceptor";
import { ArticleQuery } from "@/types/Public.type";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AllArticlePage() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<ArticleQuery[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    const fetchArticles = async (page: number) => {
        try {
            setLoading(true);
            const response = await api.get(`/api/public/get-all-articles?page=${page}&limit=${limit}`);
            if (response.status === 200) {
                setArticles(response.data.articles);
                setTotalCount(response.data.count);
            }
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage]);

    // Group articles by Month Year
    const groupedArticles = articles.reduce((acc, article) => {
        if (!article.published_at) return acc;
        const date = new Date(article.published_at);
        // format: "January 2024"
        const key = format(date, "MMMM yyyy");
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(article);
        return acc;
    }, {} as Record<string, ArticleQuery[]>);

    // Sort groups - The query already returns sorted desc, but we iterate reliably just in case
    // Since Object.entries might not guarantee order of insertion (though mostly yes for string keys),
    // and our data is sorted desc, the first key encountered is likely the newest month.
    // Ideally we rely on the sorted array order to generate keys.
    // The iteration below: `Object.entries` standard order for non-integer keys is insertion order (ES2015+).
    // Since we process `articles` (sorted desc) from start to end, we insert "January 2025" then "December 2024", etc.
    // So iterating keys should be fine.

    const totalPages = Math.ceil(totalCount / limit);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">All Articles</h1>

            {loading ? (
                // Simple skeleton
                <div className="space-y-12">
                    {[1, 2].map((i) => (
                        <div key={i}>
                            <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-16">
                    {Object.entries(groupedArticles).map(([monthYear, groupArticles]) => (
                        <section key={monthYear}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                                {monthYear}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {groupArticles.map((article) => (
                                    <Link key={article.id} href={`/${article.slug}`} className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center justify-start gap-2 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                                                <span className="text-gray-500 font-medium">{article.view_count || 0} views |</span>
                                                <span className="text-gray-500 font-medium">{article.author_id} |</span>
                                                <span className="text-gray-500 font-medium">{article.published_at ? format(new Date(article.published_at), 'MMM dd, yyyy') : ""}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}

                    {articles.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No articles found.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Simple logic to show limited pages if too many could be added here
                        // For now, show all (assuming not huge amount of pages initially)
                        // Or basic: 1, 2, ..., curr, ..., last
                        // Let's do simple list for now as user likely doesn't have 1000 pages yet
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${currentPage === page
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}