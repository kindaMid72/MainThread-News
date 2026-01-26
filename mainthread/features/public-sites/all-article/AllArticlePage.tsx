

import api from "@/libs/axiosInterceptor/axiosPublicInterceptor";
import { ArticleQuery } from "@/types/Public.type";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// components
import Button from './components/button';

export default function AllArticlePage({response, page, limit}: {response: any, page: number, limit: number}) {
    const articles: ArticleQuery[] = response.articles;
    const totalCount = response.count;
    const currentPage = page;

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

    if(Object.keys(groupedArticles).length === 0) {
        return <div>No articles found</div>
    }

    // Sort groups - The query already returns sorted desc, but we iterate reliably just in case
    // Since Object.entries might not guarantee order of insertion (though mostly yes for string keys),
    // and our data is sorted desc, the first key encountered is likely the newest month.
    // Ideally we rely on the sorted array order to generate keys.
    // The iteration below: `Object.entries` standard order for non-integer keys is insertion order (ES2015+).
    // Since we process `articles` (sorted desc) from start to end, we insert "January 2025" then "December 2024", etc.
    // So iterating keys should be fine.

    const totalPages = Math.ceil(totalCount / limit); // FIXME: kenapa ini bisa NaN?
    // console.log(limit); // FIXME: limit nan

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            redirect(`/articles?page=${newPage}&limit=${limit}`)
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen font-sans! ">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">All Articles</h1>

            {false ? (
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
                                            <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center justify-start gap-2 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                                                <span className="text-gray-500 font-medium text-nowrap">{article.view_count || 0} views |</span>
                                                <span className="text-gray-500 font-medium text-nowrap">{article.author_id} |</span>
                                                <span className="text-gray-500 font-medium text-nowrap">{article.published_at ? format(new Date(article.published_at), 'MMM dd, yyyy') : ""}</span>
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
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                    <Button
                        page={currentPage - 1}
                        content={<ChevronLeft className="w-5 h-5" />}
                        disabled={currentPage === 1}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={limit}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    />

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
                                <Button
                                    key={page}
                                    page={page}
                                    content={page}
                                    disabled={page === currentPage}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    limit={limit}
                                    className="w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors"
                                />
                            );
                        }
                        return null;
                    })}

                    <Button
                        page={currentPage + 1}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={limit}
                        disabled={currentPage === totalPages}
                        content={<ChevronRight className="w-5 h-5" />}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    />
                </div>
            )}
        </div>
    );
}