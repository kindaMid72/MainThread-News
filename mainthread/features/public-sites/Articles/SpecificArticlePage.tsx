// types
import { ArticleQuery } from "@/types/Article.type";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

// utils
import HtmlRenderer from "@/utils/htmlRenderer";

interface Props {
    article: ArticleQuery;
    relatedArticles: ArticleQuery[];
}

export default function SpecificArticlePage({ article, relatedArticles }: Props) {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Column */}
                <div className="lg:col-span-8">
                    {/* Hero Image */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-8">
                        <Image
                            src={article.thumbnail_url as string || "https://via.placeholder.com/800x450"}
                            alt={article.title as string || "Article Image"}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Article Header */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wider">
                            {/* You might want to pass category name here if available, or fetch it */}
                            <span>Article</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            {article.title}
                        </h1>
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                            <div className="flex items-center gap-4">
                                {/* <div className="w-10 h-10 bg-gray-200 rounded-full"></div> Placeholder for Author Avatar */}
                                <div>
                                    <span className="font-semibold text-gray-900 block">{article.author_id}</span>
                                    <span>{article.published_at ? format(new Date(article.published_at), "MMM dd, yyyy") : "Date unavailable"}</span>
                                </div>
                            </div>
                            {/* Social Share Buttons could go here */}
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg prose-blue max-w-none text-lg! font-normal! text-gray-800 leading-relaxed">
                        <HtmlRenderer htmlString={article.content_html as string || ""} />
                    </article>
                </div>

                {/* Sidebar Column */}
                <aside className="lg:col-span-4 space-y-12">
                    {/* Related Articles Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-red-500 pb-2">
                            Related News
                        </h3>
                        <div className="flex flex-col gap-6">
                            {relatedArticles && relatedArticles.length > 0 ? (
                                relatedArticles.slice(0, 5).map((related) => (
                                    <Link key={related.id} href={`/${related.slug}`} className="group flex gap-4 items-start">
                                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={related.thumbnail_url as string || "https://via.placeholder.com/150"}
                                                alt={related.title as string || ""}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                                {related.title}
                                            </h4>
                                            <span className="text-xs text-gray-400">
                                                {related.published_at ? format(new Date(related.published_at), "MMM dd, yyyy") : ""}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No related articles found.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}