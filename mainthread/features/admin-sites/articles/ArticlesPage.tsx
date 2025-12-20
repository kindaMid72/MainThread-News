"use client";

import { format } from 'date-fns';
import { Edit, Eye, FileCheck, FileX, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Data types
import { ArticleTableViews } from '@/types/Article.type';

// Sample placeholder data TODO: fetch real data, apply pagination
const articles: ArticleTableViews[] = [
    {
        id: '1',
        title: 'Getting Started with Next.js',
        subtitle: 'A comprehensive guide to building modern web apps',
        status: 'published',
        authorName: 'Alice Johnson',
        categoryName: 'Technology',
        publishAt: '2024-03-20T10:00:00Z',
        views: 1250,
        coverImage: 'https://placehold.co/600x400',
        slug: 'getting-started-nextjs'
    },
    {
        id: '2',
        title: 'The Future of Web Development',
        subtitle: 'Trends to watch in 2025',
        status: 'draft',
        authorName: 'Bob Smith',
        categoryName: 'Tech',
        publishAt: '2024-03-25T10:00:00Z',
        views: 0,
        coverImage: 'https://placehold.co/600x400',
        slug: 'future-web-dev'
    },
    {
        id: '3',
        title: 'Understanding React Server Components',
        subtitle: 'Deep dive into RSC',
        status: 'review',
        authorName: 'Charlie',
        categoryName: 'Coding',
        publishAt: '2024-03-22T15:30:00Z',
        views: 50,
        coverImage: 'https://placehold.co/600x400',
        slug: 'react-server-components'
    }
];

export default function ArticlesPage() {

    const params = useParams();
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredArticles = articles.filter(article => {
        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || article.id === categoryFilter; // Simplified for demo
        return matchesStatus && matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            review: 'bg-yellow-100 text-yellow-800',
        };
        return styles[status] || styles.draft;
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl mb-2 font-bold">Manajemen Artikel</h1>
                        <p className="text-gray-600">Kelola semua artikel di sistem</p>
                    </div>
                    <Link
                        href={`/admin/${params.userId}/articles/new`}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Buat Artikel Baru
                    </Link>
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
                                placeholder="Cari artikel..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="review">Review</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="tech">Technology</option>
                            <option value="coding">Coding</option>
                        </select>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            Total: <span className="font-semibold">{filteredArticles.length}</span> artikel
                        </div>
                    </div>
                </div>

                {/* Articles Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Artikel
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Tanggal Publish
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={article.coverImage}
                                                    alt={article.title}
                                                    className="w-16 h-16 object-cover rounded shrink-0 bg-gray-200"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 line-clamp-2 mb-1">
                                                        {article.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                        {article.subtitle}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(article.status)}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{article.authorName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{article.categoryName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{format(new Date(article.publishAt), 'dd MMM yyyy')}</div>
                                            <div className="text-xs text-gray-500">{format(new Date(article.publishAt), 'HH:mm')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                                {article.views.toLocaleString('id-ID')}
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
                                                <Link
                                                    href={`/admin/${params.userId}/articles/edit/${article.id}`}
                                                    target="_blank"
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {article.status === 'draft' && (
                                                    <button
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                        title="Publish"
                                                    >
                                                        <FileCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {article.status === 'published' && (
                                                    <button
                                                        className="p-2 text-orange-600 cursor-pointer hover:bg-orange-50 rounded transition-colors"
                                                        title="Unpublish"
                                                    >
                                                        <FileX className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            Tidak ada artikel ditemukan
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}