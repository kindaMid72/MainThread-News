import { ArticleQuery } from "@/types/Public.type";
import stringToColor from '@/utils/stringToColor';
import { ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// imponents
import FormattedDate from "@/components/FormattedDate";
import MainThreadLogo from "@/components/MainThreadLogo";

import SubscribeCard from "./components/SubscribeCard";

interface MainResponse {
    data: {
        latestNews: ArticleQuery[];
        headline: ArticleQuery[];
        breakingNews: ArticleQuery[];
        categories: { id: string, name: string, slug: string, articles: ArticleQuery[] }[];
    }
}

export default function LandingPage({ response }: { response: MainResponse }) {
    // Data state
    const latestNews: ArticleQuery[] = response.data.latestNews;
    const headline: ArticleQuery[] = response.data.headline;
    const breakingNews: ArticleQuery[] = response.data.breakingNews;
    const tempHeadline = response.data.headline[0].content_html; // Using this as description for now based on previous code

    // Parse description from HTML content roughly for the preview
    // const parsedHeadline = typeof window !== 'undefined' ? new DOMParser().parseFromString(tempHeadline as string, "text/html").body.textContent : "";
    // Note: Doing simple render for now.

    const categories = response.data.categories.filter((category: any) => category.articles.length > 0);

    const mainStory = headline[0];

    return (
        <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20 selection:bg-blue-100 selection:text-blue-900">
            <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* === Hero Section === */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 border-b border-zinc-100 pb-16">

                    {/* Left Column: Breaking & Briefs (Sticky on Desktop?) */}
                    <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                            </span>
                            <h3 className="font-bold text-sm tracking-widest uppercase text-zinc-500">Breaking News</h3>
                        </div>

                        <div className="space-y-6">
                            {breakingNews.slice(0, 3).map((article) => (
                                <article key={article.id}>
                                    <Link href={`/${article.slug}`} className="group block">
                                        <div className="flex flex-col gap-2">
                                            <div className="relative w-full aspect-3/2 rounded-lg overflow-hidden mb-2">
                                                <Image
                                                    src={article.thumbnail_url || ""}
                                                    alt={article.title || ""}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h4 className="font-bold text-lg leading-snug group-hover:text-blue-700 transition-colors">
                                                {article.title}
                                            </h4>
                                            <div className="text-xs text-zinc-400 font-medium flex items-center gap-2">
                                                <FormattedDate date={article.published_at as string} formatStr="HH:mm" />
                                                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                                {categories.find(c => c.id === article.category_id)?.name}
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Center Column: Main Feature Story */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        {mainStory && (
                            <article>
                                <Link href={`/${mainStory.slug}`} className="group block">
                                    <span className="flex flex-col h-full">
                                        <span className="relative w-full aspect-16/10 overflow-hidden rounded-2xl shadow-sm bg-zinc-100 mt-auto">
                                            <Image
                                                src={mainStory.thumbnail_url || ""}
                                                alt={mainStory.title || ""}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </span>
                                        <span className="mb-6">
                                            <div className="flex items-center gap-3 mb-1 mt-3 text-xs font-bold tracking-wider uppercase">
                                                <span className="text-blue-600">
                                                    {categories.find((category) => category.id === mainStory.category_id)?.name}
                                                </span>
                                                <span className="text-zinc-300">|</span>
                                                <span className="text-zinc-500 font-medium">
                                                    <FormattedDate date={mainStory.published_at as string} formatStr="MMMM dd, yyyy" />
                                                </span>
                                                <span className="text-zinc-300">|</span>
                                                <span className="text-zinc-500 font-medium">{mainStory.author_id}</span>
                                            </div>

                                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 leading-[1.1] tracking-tight group-hover:text-blue-700 transition-colors mb-4 text-left">
                                                {mainStory.title}
                                            </h1>

                                            <span className="text-lg text-zinc-600 leading-relaxed line-clamp-3 text-left" dangerouslySetInnerHTML={{ __html: tempHeadline as string }} />
                                        </span>

                                    </span>
                                </Link>
                            </article>
                        )}
                    </div>

                    {/* Right Column: Trending / Top Stories */}
                    <div className="lg:col-span-3 order-3 border-l border-zinc-100 pl-0 lg:pl-8 space-y-8">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-4 h-4 text-zinc-900" />
                            <h3 className="font-bold text-sm tracking-widest uppercase text-zinc-900">Latest News</h3>
                        </div>

                        <div className="flex flex-col gap-0 divide-y divide-zinc-100">
                            {latestNews.slice(0, 5).map((article, index) => (
                                <Link key={article.id} href={`/${article.slug}`} className="group py-5 first:pt-0">
                                    <article className="flex items-start gap-4">
                                        <span className="text-4xl font-black text-zinc-200 group-hover:text-blue-100 transition-colors tabular-nums leading-none -mt-1 select-none">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                                                {categories.find((category) => category.id === article.category_id)?.name}
                                            </div>
                                            <h4 className="font-bold text-base text-zinc-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                                                {article.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                                                <Clock className="w-3 h-3" />
                                                <FormattedDate date={article.published_at as string} formatStr="MMM dd" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        <Link href="/articles?page=1&limit=10" className="inline-flex items-center justify-center w-full py-3 px-4 bg-zinc-900 text-white font-bold text-sm rounded-lg hover:bg-zinc-800 transition-colors group">
                            Read All Stories
                            <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                </section>

                {/* === Category Sections === */}
                <div className="space-y-24">
                    {categories.map((category, catIndex) => {
                        // Different layout logic for odd/even or first category? 
                        // Let's keep a consistent high-end grid.
                        const catColor = stringToColor(category.name);

                        return (
                            <section key={category.id} className="relative">
                                {/* Section Header */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-zinc-200 pb-4">
                                    <div>
                                        <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1 block">Discover</span>
                                        <h2 className="text-3xl md:text-4xl font-black text-zinc-900">
                                            {category.name}
                                        </h2>
                                    </div>
                                    <Link href={`/categories/${category.slug}?page=1&limit=10`} className="group flex items-center text-sm font-bold text-zinc-900 hover:text-blue-700 transition-colors">
                                        View Collection
                                        <span className="bg-zinc-100 rounded-full p-1.5 ml-2 group-hover:bg-blue-50 transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </span>
                                    </Link>
                                </div>

                                {/* Modern Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                                    {category.articles.map((article, index) => (
                                        <Link key={article.id} href={`/${article.slug}`} className="group flex flex-col h-full">
                                            <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-4 bg-zinc-100">
                                                <Image
                                                    src={article.thumbnail_url || ""}
                                                    alt={article.title || ""}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <div className="text-xs font-medium text-zinc-500 mb-2 flex items-center justify-between">
                                                    <span><FormattedDate date={article.published_at as string} formatStr="MMM dd, yyyy" /></span>
                                                </div>
                                                <h3 className="text-lg font-bold text-zinc-900 leading-tight mb-3 group-hover:text-blue-700 transition-colors line-clamp-3">
                                                    {article.title}
                                                </h3>
                                                {/* <p className="text-sm text-zinc-500 line-clamp-2 mt-auto">
                                                    {article.content?.substring(0, 100)}...
                                                </p> */}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>

                {/* Footer / CTA Area */}
                <SubscribeCard />

                <section className="mt-16 text-center border-t border-zinc-100 pt-8">
                    <div className="text-zinc-400 text-sm">
                        &copy; {new Date().getFullYear()} <MainThreadLogo className="text-[18px]! text-nowrap"/>. All rights reserved. <br />
                        <Link href="mailto:kingahmadilyas05@gmail.com" className="hover:text-zinc-900 transition-colors">kingahmadilyas05@gmail.com</Link>
                    </div>
                </section>

            </main>
        </div>
    );
}