
import { ArticleQuery } from "@/types/Public.type";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Button from "./components/Button";

interface CategoryPageProps {
    response: {
        articles: ArticleQuery[];
        count: number;
    };
    page: number;
    limit: number;
    categorySlug: string;
}

export default function CategoryPage({ response, page, limit, categorySlug }: CategoryPageProps) {

    const articles = response?.articles || [];
    const totalCount = response?.count || 0;
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

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-12 capitalize">{categorySlug}</h1>

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
                        categorySlug={categorySlug}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    />

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        const pg = p;
                        if (
                            pg === 1 ||
                            pg === totalPages ||
                            (pg >= currentPage - 1 && pg <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={pg}
                                    page={pg}
                                    content={pg}
                                    disabled={pg === currentPage}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    limit={limit}
                                    categorySlug={categorySlug}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${currentPage === pg
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                                        }`}
                                />
                            );
                        }
                        return null;
                    })}

                    <Button
                        page={currentPage + 1}
                        content={<ChevronRight className="w-5 h-5" />}
                        disabled={currentPage === totalPages}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={limit}
                        categorySlug={categorySlug}
                        className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    />
                </div>
            )}
        </div>
    );
}
