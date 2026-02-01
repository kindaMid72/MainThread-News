"use client";

import { ChevronLeft, ChevronRight, Edit, Eye, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// hooks
import { useDebounce } from '@/hooks/useDebounce';

// api
import api from '@/libs/axiosInterceptor/axiosAdminInterceptor';

// Data types
import { ArticleQuery } from '@/types/Article.type';

// components
import ErrorWithRefreshButton from '@/components/ErrorWithRefreshButton';
import LoadingSkeletonTable from '@/components/LoadingSkeletonTabel';

// types
import { CategoriesQuery } from '@/types/Category.type';
import { User } from '@/types/User.types';

// Sample placeholder data TODO: fetch real data, apply pagination

export default function ArticlesPage() {

    const params = useParams();
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [ascFilter, setAscFilter] = useState('desc');

    // ui state
    const [isLoadingFetch, setIsLoadingFetch] = useState(true);
    const [isErrorFetch, setIsErrorFetch] = useState(false);

    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [isErrorEdit, setIsErrorEdit] = useState(false);

    const [isLoadingTabel, setIsLoadingTabel] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 750);

    // articles data
    const [articles, setArticles] = useState<ArticleQuery[]>([]);
    const [categories, setCategories] = useState<CategoriesQuery[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [userData, setUserData] = useState<User[]>([]);

    const [popUpMessage, setPopUpMessage] = useState({
        title: '',
        message: '',
        type: '',
        duration: 2000,
        onClose: () => { }
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            review: 'bg-yellow-100 text-yellow-800',
            archived: 'bg-red-100 text-red-800',
        };
        return styles[status] || styles.draft;
    };


    // handler
    // create new article
    const handleCreateNewArticle = async () => {
        setIsLoadingEdit(true);
        const response = await api.post('/api/admin/articles/create-new-article');
        if (response.status === 201) {
            // extract id
            const data: ArticleQuery = response.data;
            const id: string = data.id as string;
            setPopUpMessage({
                title: 'Success',
                message: 'Article created successfully',
                type: 'success',
                duration: 2000,
                onClose: () => { }
            });
            router.push(`/admin/${params.userId}/articles/edit/${id}`); // fetch by edit page after created and redirect to edit page
        } else {
            setIsErrorEdit(true);
            setPopUpMessage({
                title: 'Error',
                message: 'Failed to create article',
                type: 'error',
                duration: 2000,
                onClose: () => { }
            });
            return;
        }
        setIsLoadingEdit(false);
    };

    const handleCreateAIArticle = async () => {
        setIsLoadingEdit(true);
        const response = await api.post('/api/admin/automatic-news/create-automatic-news');
        console.log(response);
        if (response.status === 201) {
            // extract id
            const data: ArticleQuery = response.data;
            const id: string = data.id as string;
            setPopUpMessage({
                title: 'Success',
                message: 'Article created successfully',
                type: 'success',
                duration: 2000,
                onClose: () => { }
            });
            router.push(`/admin/${params.userId}/articles/edit/${id}`); // fetch by edit page after created and redirect to edit page
        } else {
            setIsErrorEdit(true);
            setPopUpMessage({
                title: 'Error',
                message: 'Failed to create article',
                type: 'error',
                duration: 2000,
                onClose: () => { }
            });
            return;
        }
        setIsLoadingEdit(false);
    };

    const initialFetch = async () => {
        try {
            setIsLoadingFetch(true);
            await fetchArticles();
            // fetch categories
            const fetchCategories = async () => {
                const response = await api.get('/api/admin/categories/get-all-categories');
                if (response.status === 200 && !cursor) {
                    setCategories(response.data);
                }
            };
            fetchCategories();
            // fetch user data
            const fetchUserData = async () => {
                const response = await api.get('/api/admin/teams/get-all-users');
                if (response.status === 200 && !cursor) {
                    setUserData(response.data);
                    console.log(response.data);
                }
            };
            fetchUserData();
        } catch (error) {
            setIsErrorFetch(true);
        } finally {
            setIsLoadingFetch(false);
        }
    };

    // fetch data
    const fetchArticles = async (pageCursor: string | null = null, direction: 'forward' | 'backward' | null = null) => {
        try {
            const response = await api.get('/api/admin/articles/get-articles-on-given-page', {
                params: {
                    cursor: pageCursor,
                    limit: 5,
                    direction: direction,
                    category: categoryFilter || 'all',
                    status: statusFilter || 'all',
                    asc: ascFilter === 'asc',
                    search: debouncedSearchQuery || '',
                }
            });

            if (response.status === 200) {
                setArticles(response.data.articles);
                setCursor(response.data.cursor);
                setHasPrev(response.data.hasPrev);
                setHasNext(response.data.hasNext);
                setIsErrorFetch(false);
            } else {
                setIsErrorFetch(true);
            }
        } catch (error) {
            setIsErrorFetch(true);
        }
    };

    const handleNextPage = () => {
        if (hasNext && cursor) {
            try {
                setIsLoadingTabel(true);
                fetchArticles(cursor, 'forward');
            } catch (error) {
                setIsErrorFetch(true);
            } finally {
                setIsLoadingTabel(false);
            }
        }
    };

    const handlePrevPage = () => {
        if (hasPrev && cursor) {
            try {
                setIsLoadingTabel(true);
                fetchArticles(cursor, 'backward');
            } catch (error) {
                setIsErrorFetch(true);
            } finally {
                setIsLoadingTabel(false);
            }
        }
    };


    // useEffect handler
    useEffect(() => {
        try {
            setIsLoadingTabel(true);
            fetchArticles();
        } catch (error) {
            setIsErrorFetch(true);
        } finally {
            setIsLoadingTabel(false);
        }
    }, [categoryFilter, statusFilter, ascFilter, debouncedSearchQuery]);

    useEffect(() => {
        initialFetch();
    }, []);

    if (isLoadingFetch) {
        return <LoadingSkeletonTable />
    }
    if (isErrorFetch) {
        return <ErrorWithRefreshButton onRefresh={initialFetch} />
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl mb-2 font-bold text-gray-900">Manage Articles</h1>
                        <p className="text-gray-600">Manage all articles in the system</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCreateNewArticle}
                            disabled={isLoadingEdit}
                            className={`flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isLoadingEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoadingEdit ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <Plus className="w-5 h-5" />}
                            Create New Article
                        </button>
                        <button
                            onClick={handleCreateAIArticle}
                            disabled={isLoadingEdit}
                            className={`flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isLoadingEdit ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoadingEdit ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <Plus className="w-5 h-5" />}
                            Create Automatic Article
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="review">Review</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="all">All Category</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={ascFilter}
                            onChange={(e) => setAscFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </select>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            Total: <span className="font-semibold">{articles.length}</span> articles
                        </div>
                    </div>
                </div>

                {/* Articles Table */}
                {isLoadingTabel ? <LoadingSkeletonTable /> : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Article
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Author
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Last Edited
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Views
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {articles.map((article: ArticleQuery) => {
                                        return (
                                            <tr key={article.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            src={article.thumbnail_url || 'https://placehold.co/400'}
                                                            alt={article.title}
                                                            className="w-16 h-16 object-cover rounded shrink-0 bg-gray-200"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 line-clamp-2 mb-1">
                                                                {article.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                                {article.source_type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.status as string)}`}>
                                                        {article.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{userData?.filter((user) => user.userId === article.author_id)[0]?.name || 'No Author'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{categories.filter((category) => category.id === article.category_id)[0]?.name || 'No Category'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            timeZone: 'Asia/Jakarta',
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }).format(new Date(article.published_at as string))}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            timeZone: 'Asia/Jakarta',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }).format(new Date(article.published_at as string))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                        {article.view_count?.toLocaleString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/admin/${params.userId}/articles/edit/${article.id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <Link // 'archived' | 'draft' | 'review' | 'published';
                                                            href={`/${article.slug}`}
                                                            target="_blank"
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Preview"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {articles.length === 0 && (
                            <div className="text-center py-16 text-gray-500">
                                Tidak ada artikel ditemukan
                            </div>
                        )}
                    </div>)}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 mt-4 rounded-lg shadow-sm">
                    <div className="flex justify-between flex-1 sm:hidden">
                        <button
                            onClick={handlePrevPage}
                            disabled={!hasPrev}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!hasPrev ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={!hasNext}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${!hasNext ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'}`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{articles.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!hasPrev}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${!hasPrev ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!hasNext}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${!hasNext ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}