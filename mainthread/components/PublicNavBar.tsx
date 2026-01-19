"use client"
import { format } from 'date-fns';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// types
import { ArticleQuery } from '@/types/Article.type';

// libs
import api from '@/libs/axiosInterceptor/axiosPublicInterceptor';

// utils
import { useDebounce } from '@/hooks/useDebounce';
/**
 * 
 * FIXME: awesome icon doesnt shown
 */

export default function PublicNavBar() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    // state TODO: implement search features
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ArticleQuery[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const limit = 5;

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // ref 
    const inputSearchRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);


    const handleSearch = (query: string) => {
        // implement search api call   
        setPage(1);
        setSearchResults([]);
        if (!query) return;

        setIsLoading(true);
        setSearchQuery(query);

        api.get(`/api/public/search?query=${query}&page=${1}&limit=${limit}`)
            .then((res) => {
                setSearchResults(res.data);
            })
            .catch((err) => {
                console.log('error from public controller /search: ', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleMore = () => { // case: show more button got pressed
        const nextPage = page + 1;
        setPage(nextPage);
        setIsLoading(true);
        // fetch more articles, then append to searchResults
        api.get(`/api/public/search?query=${debouncedSearchQuery}&page=${nextPage}&limit=${limit}`)
            .then((res) => {
                if (res.data.length === 0) return; // No more data
                setSearchResults((prev) => [...prev, ...res.data]);
            })
            .catch((err) => {
                console.log('error from public controller /search: ', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // start new search process, start everything from 0
        handleSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery]);



    useEffect(() => {
        // check the current window possition
        function checkInputSearchRef(e: MouseEvent) {
            if (inputSearchRef.current && !inputSearchRef.current.contains(e.target as Node)) {
                setShowSearch(false);
            }
        }
        window.addEventListener('mousedown', checkInputSearchRef);
        return () => window.removeEventListener('mousedown', checkInputSearchRef);
    }, [inputSearchRef.current]);

    const isActive = (path: string) => {
        // iterate through all possible path page, and return true if the path is matching
        if (path.includes('articles')) {
            return pathname.includes('articles');
        }
        return pathname === `/${path}`;
    };

    return (
        <nav className='sticky font-sans flex flex-col top-0 z-50 w-full bg-white border-b border-gray-200 shadow-[0px_0px_20px_rgba(0,0,0,0.1)]'>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div
                        onClick={() => setShowSidebar(true)}
                        className='md:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer'
                    >
                        <i className='fa-solid fa-bars text-xl'></i>
                    </div>
                    <div className='text-2xl font-black italic tracking-tighter'>
                        <Link href='/' className='text-2xl font-black italic tracking-tighter'>
                            MAIN<span className='text-red-600'>THREAD</span>
                        </Link>
                    </div>
                </div>

                <div className='hidden md:flex flex-1 max-w-md mx-8'>
                    <div
                        onClick={() => setShowSearch(true)}
                        className='w-full flex items-center gap-2 px-4 py-2 bg-gray-100 border border-transparent rounded-full text-gray-500 cursor-text hover:bg-white hover:border-gray-300 transition-all duration-200'
                    >
                        <Search className='w-4 h-4' />
                        <span className='text-sm'>Search articles...</span>
                    </div>
                </div>

                <div className='hidden md:flex gap-6 items-center'>
                    <Link href='/' className={`text-lg font-semibold hover:text-red-600 transition-colors ${isActive('') ? 'text-red-600' : 'text-gray-600'}`}>
                        Home
                    </Link>
                    <Link href='/articles?page=1&limit=10' className={`text-lg font-semibold hover:text-red-600 transition-colors ${isActive('articles') ? 'text-red-600' : 'text-gray-600'}`}>
                        Articles
                    </Link>
                    <Link href='/about' className={`text-lg font-semibold hover:text-red-600 transition-colors ${isActive('about') ? 'text-red-600' : 'text-gray-600'}`}>
                        About
                    </Link>

                    <div className='w-px h-4 bg-gray-300 mx-2'></div>
                </div>

                <div
                    onClick={() => setShowSearch(true)}
                    className='md:hidden p-2 text-gray-600'
                >
                    <Search className='w-5 h-5' />
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='p-5 border-b border-gray-100 flex items-center justify-between'>
                    <div className='font-black italic text-xl'>MENU</div>
                    <button onClick={() => setShowSidebar(false)} className='text-gray-400 hover:text-black'>
                        <i className='fa-solid fa-times text-xl'></i>
                    </button>
                </div>
                <div className='flex flex-col p-4 gap-2'>
                    <Link href='/' onNavigate={() => setShowSidebar(false)} className='p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 text-lg'>Home</Link>
                    <Link href='/articles' onNavigate={() => setShowSidebar(false)} className='p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 text-lg'>Articles</Link>
                    <Link href='/about' onNavigate={() => setShowSidebar(false)} className='p-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 text-lg'>About</Link>
                </div>
            </div>

            {/* Overlay for Mobile Nav */}
            {showSidebar && (
                <div onClick={() => setShowSidebar(false)} className='fixed inset-0 bg-black/20 z-40 backdrop-blur-sm'></div>
            )}

            {/* Search Overlay */}
            {showSearch && (
                <div className='fixed inset-0 z-50 flex flex-col items-center pt-4 sm:pt-24 bg-black/40 backdrop-blur-sm px-4'>
                    <div
                        ref={inputSearchRef}
                        className='w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[70vh] animate-in fade-in zoom-in duration-200'
                    >
                        <div className='p-4 border-b border-gray-100 flex items-center gap-3 bg-white z-10'>
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder='Search for topics, articles, or authors...'
                                className='w-full text-lg placeholder:text-gray-300 focus:outline-none'
                                autoFocus
                            />
                            <button onClick={() => setShowSearch(false)} className='p-2 text-gray-400 hover:text-gray-600 md:hidden'>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent'>

                            {isLoading && searchResults.length === 0 && (
                                <div className='flex items-center justify-center p-8 text-gray-400'>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            )}

                            {!isLoading && searchQuery && searchResults.length === 0 && (
                                <div className='text-center p-8 text-gray-400'>
                                    No results found for "{searchQuery}"
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className='flex flex-col'>
                                    {searchResults.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={`/${article.slug}`}
                                            onClick={() => setShowSearch(false)}
                                            className='flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group'
                                        >
                                            <div className='relative w-20 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0'>
                                                {article.thumbnail_url && (
                                                    <Image
                                                        src={article.thumbnail_url}
                                                        alt={article.title || 'Article thumbnail'}
                                                        fill
                                                        className='object-cover'
                                                    />
                                                )}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm mb-1'>
                                                    {article.title}
                                                </h4>
                                                <div className='flex items-center gap-2 text-xs text-gray-400'>
                                                    <span>{article.author_id}</span>
                                                    <span>•</span>
                                                    <span>{article.published_at ? format(new Date(article.published_at), 'MMM dd, yyyy') : ''}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    <div className='p-2 pt-4 border-t border-gray-50'>
                                        <button
                                            onClick={handleMore}
                                            disabled={isLoading}
                                            className='w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2'
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More Results'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}