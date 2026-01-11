"use client";

import { format } from "date-fns";
import { ArrowRight, ChevronRight, Clock, Eye, Flame, Mail} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

// import types
import { ArticleQuery } from "@/types/Public.type";

// utils
import stringToColor from '@/utils/stringToColor';
import HtmlRenderer from "@/utils/htmlRenderer";
// components
import ErrorWithRefreshButton from "@/components/ErrorWithRefreshButton";
import SkeletonLoading from "./components/SkeletonLoading";

// api 
import api from "@/libs/axiosInterceptor/axiosPublicInterceptor";

// --- Mock Data ---

export default function LandingPage() {


    // fetching state
    const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
    const [errorFetch, setErrorFetch] = useState(false);

    // temp state
    const [tempHeadline, setTempHeadline] = useState<string>("");

    // data state
    const [latestNews, setLatestNews] = useState<ArticleQuery[]>([]);
    const [headline, setHeadline] = useState<ArticleQuery[]>([]);
    const [breakingNews, setBreakingNews] = useState<ArticleQuery[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string, slug: string, articles: ArticleQuery[] }[]>([]);
    // const [tags, setTags] = useState<TagQuery[]>([]); // used later (maybe)

    const fetchContent = async () => {
        try {
            setLoadingFetch(true);
            setErrorFetch(false);
            const response = await api.get("/api/public/get-main-page-content");
            if (response.status > 201) {
                throw new Error("Failed to fetch content");
            }

            // filter out categories with no article
            const filteredCategories = response.data.categories.filter((category: any) => category.articles.length > 0);

            setLatestNews(response.data.latestNews);
            setHeadline(response.data.headline);
            setBreakingNews(response.data.breakingNews);
            setCategories(filteredCategories);

            // set headlines
            const parsedHeadline = new DOMParser().parseFromString(response.data.headline[0].content_html as string, "text/html");
            const headlineText = parsedHeadline.querySelector("p")?.textContent || "";
            setTempHeadline(headlineText);

            setErrorFetch(false);

        } catch (error) {
            setErrorFetch(true);
        } finally {
            setLoadingFetch(false);
        }
    };

    useEffect(() => {
        // TODO: fetch content
        fetchContent();
        
    }, []);

    if (errorFetch) {
        return <ErrorWithRefreshButton onRefresh={fetchContent} />;
    }
    if (loadingFetch) {
        return <SkeletonLoading />;
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-gray-900 pb-20 px-4">
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* === Hero Section Grid === */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* Left Column: Quick Updates (Hidden on massive resizing but good for Desktop) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="border-t-4 border-black pt-4">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Flame className="w-5 h-5 text-red-500" />
                                Breaking News
                            </h3>
                            <div className="flex flex-col gap-4">
                                {/* TODO: breaking news view with images */}
                                {breakingNews.map((article, index) => {
                                    if (index > 1) return null;

                                    return (
                                        <Link key={article.id} href={`/${article.slug}`} className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                            <div className="relative w-full aspect-video overflow-hidden">
                                                <Image
                                                    src={article.thumbnail_url as string || ""}
                                                    alt={article.title as string}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="text-xs text-gray-400 mb-2">{`${format(new Date(article.published_at as string), "MMMM dd, yyyy")}`}</div>
                                                <h3 className="font-bold text-gray-900 leading-snug mb-auto group-hover:text-red-700 transition-colors">
                                                    {article.title}
                                                </h3>
                                            </div>
                                        </Link>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Main Feature */}
                    <div className="col-span-1 lg:col-span-6">
                        <Link href={`/${headline[0].slug}`} className="group block h-full">
                            <div className="relative w-full aspect-16/10 overflow-hidden rounded-xl shadow-md mb-4 group">
                                <Image
                                    src={headline[0].thumbnail_url as string || ""}
                                    alt={headline[0].title as string || "Unloaded Image"}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {categories.find((category) => category.id === headline[0].category_id)?.name}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">{headline[0]?.author_id}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(headline[0].published_at as string), "MMMM dd, yyyy")}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-red-700 transition-colors">
                                    {headline[0].title}
                                </h1>
                                <div className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                                    {tempHeadline}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right Column: Trending */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                <Clock className="w-6 h-6 text-gray-600" />
                                Latest News
                            </h3>
                            <div className="flex flex-col gap-6">
                                {latestNews.map((article, index) => (
                                    <Link key={article.id as string} href={`${article.slug as string}`} className="group flex items-start gap-3">
                                        <span className="text-3xl font-black text-gray-200 leading-none -mt-1 group-hover:text-red-100 transition-colors">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 leading-snug group-hover:text-red-700 transition-colors mb-1">
                                                {article.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.view_count}</span>
                                                <span>•</span>
                                                <span>{categories.find((category) => category.id === article.category_id)?.name}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/articles" className="w-full mt-8 py-2 text-sm font-semibold text-gray-600 hover:text-red-700 border border-gray-200 rounded-lg hover:border-red-200 transition-all flex items-center justify-center gap-2">
                                View All News <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </section>

                {/* === Horizontal Banner / Ad Space / Break ===
                <div className="w-full h-32 bg-gray-900 rounded-xl my-12 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="text-center z-10">
                        <span className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-1 block">Sponsored Content</span>
                        <h3 className="text-2xl font-bold text-white">Subscribe to our Weekly Newsletter</h3>
                    </div>
                </div> */}

                {/* === Category Sections (Grid Layouts) === */}
                {categories.map((category) => (
                    <section key={category.id} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className={`w-2 h-8 rounded-full bg-[${stringToColor(category.name)}]`}></span>
                                Latest in {category.name}
                            </h2>
                            <Link href={`/categories/${category.slug}`} className="text-sm font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                                View More <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 group">
                            {category.articles.map((article) => (
                                <Link key={article.id} href={`${article.slug}`} className=" group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
                                    <div className="relative w-full aspect-video overflow-hidden ">
                                        <Image
                                            src={article.thumbnail_url as string || ""}
                                            alt={article.title as string || "Unloaded Image"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 group">
                                        <div className="text-xs text-gray-400 mb-2">{format(new Date(article.published_at as string), 'dd MMM yyyy')}</div>
                                        <h3 className="font-bold text-gray-900 leading-snug mb-auto group-hover:text-red-700 transition-colors">
                                            {article.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
                {/* Contact & Footer */}
                <section className="border-t border-gray-200 pt-12 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-600 font-medium">
                        <Link href="mailto:kingahmadilyas05@gmail.com" className="flex items-center gap-2 hover:text-black transition-colors">
                            <Mail className="w-5 h-5" />
                            kingahmadilyas05@gmail.com
                        </Link>
                        {/* <span className="hidden sm:inline text-gray-300">|</span>
                        <Link href="/privacy" className="hover:text-black transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <Link href="/terms" className="hover:text-black transition-colors">
                            Terms of Service
                        </Link> */}
                    </div>
                </section>

            </main>
        </div>
    );
}