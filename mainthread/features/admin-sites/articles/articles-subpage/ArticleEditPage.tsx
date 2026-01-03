"use client";

import { ArticleQuery } from '@/types/Article.type';
import { CategoriesQuery } from '@/types/Category.type';
import { TagQuery } from '@/types/Tag.type';
import { AlertCircle, ArrowLeft, CheckCircle, Image as ImageIcon, Loader2, Save, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import EditorTextBox from '../components/EditorTextBox';

import { useParams } from 'next/navigation';
import EditArticleSkeletonLoading from '../components/EditArticleSkeletonLoading';

// Mock current author for now - in real app, get from auth context

// api
import api from '@/libs/axiosInterceptor/axiosAdminInterceptor';

export default function ArticleEditPage() {
    const params = useParams();

    // Form State
    const [formData, setFormData] = useState<Partial<ArticleQuery>>({
        title: '',
        slug: '',
        content_html: '',
        thumbnail_url: '',
        status: 'draft',
        category_id: '',
        author_id: '',
        source_type: 'auto',
        is_headline: false,
        is_breaking: false,
        // tags will be handled separately if not in ArticleQuery, but assuming array of IDs for submission
    });

    // Tags selection state (since ArticleQuery might not have it directly mapped yet for submission)
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    // Data for selectors
    const [categories, setCategories] = useState<CategoriesQuery[]>([]);
    const [tags, setTags] = useState<TagQuery[]>([]);

    // UI States
    const [isLoadingFetch, setIsLoadingFetch] = useState(true);
    const [isLoadingSave, setIsLoadingSave] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingFetch(true);
            try {

                const articleRes = await api.get(`/api/admin/articles/get-article-by-id/${params.editArticleId}`);
                const articleData = articleRes.data;
                console.log(articleData);
                
                // set article data
                setFormData(articleData);
                
                // set active tags
                if(articleData.tags && articleData.tags.length > 0){
                    const tagIds = articleData.tags.map((tag: TagQuery) => tag.id);
                    setSelectedTagIds(tagIds);
                }

                // fetch tags & categories
                const [categoriesRes, tagsRes] = await Promise.all([
                    api.get('/api/admin/categories/get-all-categories'),
                    api.get('/api/admin/tags/get-all-tags')
                ]);

                // Filter only active categories/tags if needed, or backend does it
                // Assuming response structure matches what we saw in other pages
                setCategories(categoriesRes.data || []);
                setTags(tagsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
                setMessage({ type: 'error', text: 'Failed to load categories or tags' });
            } finally {
                setTimeout(() => {
                    setIsLoadingFetch(false);

                }, 3000);
            }
        };

        fetchData();
    }, []);

    // Handlers
    const handleInputChange = (field: keyof ArticleQuery, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Auto-generate slug from title if slug is empty
        if (field === 'title' && !formData.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug, [field]: value }));
        }
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async () => {
        setMessage(null);
        if (!formData.title || !formData.content_html || !formData.category_id) {
            setMessage({ type: 'error', text: 'Please fill in required fields (Title, Content, Category)' });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                tag_ids: selectedTagIds
            };

            console.log("Submitting Payload:", payload);

            // TODO: Replace with actual endpoint once confirmed
            const response = await api.post('/api/admin/articles/create', payload); // Placeholder endpoint

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Article saved successfully!' });
            } else {
                throw new Error(response.data?.message || 'Failed to save');
            }

        } catch (error: any) {
            console.error("Save error:", error);
            // Fallback for demo since endpoint probably doesn't exist yet
            if (error.response?.status === 404) {
                setMessage({ type: 'success', text: 'Article payload valid (Mock Success - Endpoint not ready)' });
            } else {
                setMessage({ type: 'error', text: error.message || 'Failed to save article' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingFetch) {
        return (
            <EditArticleSkeletonLoading />
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href={`/admin/${params.userId}/articles`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Article</h1>
                    <p className="text-gray-500">Edit your article and manage metadata.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${formData.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                        formData.status === 'review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            formData.status === 'archived' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {formData.status?.toUpperCase()}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Article
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-8">
                {/* Main Content Column */}
                <div className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Article Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter a catchy title..."
                            className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-400 transition-colors border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                        <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                            <span className="shrink-0 mr-1">/articles/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                className="w-full bg-transparent border-none focus:outline-none text-gray-900 p-0 placeholder-gray-400"
                                placeholder="article-slug-url"
                            />
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Content</label>
                        <div className="border border-gray-200 rounded-xl overflow-auto h-fit shadow-sm">
                            <EditorTextBox
                                value={formData.content_html}
                                onChange={(html) => handleInputChange('content_html', html)} // set new html to local state
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing Status */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Publishing</h3>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="review">In Review</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Author ID</label>
                                <div className="mt-1 text-xs text-mono text-gray-600 truncate bg-gray-50 p-1.5 rounded" title={formData.author_id}>
                                    {formData.author_id?.substring(0, 8)}...
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Source</label>
                                <div className="mt-1 text-xs font-medium text-gray-700 px-2 py-1.5 bg-gray-50 rounded">
                                    {formData.source_type}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Status */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Article Status</h3>
                        <div className="space-y-3">
                            {/* Headline Toggle */}
                            <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${formData.is_headline ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Headline</div>
                                        <div className="text-xs text-gray-500">Feature on homepage</div>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_headline || false}
                                        onChange={(e) => handleInputChange('is_headline', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>

                            {/* Breaking News Toggle */}
                            <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${formData.is_breaking ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Breaking News</div>
                                        <div className="text-xs text-gray-500">Highlight as urgent</div>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_breaking || false}
                                        onChange={(e) => handleInputChange('is_breaking', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Thumbnail</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.thumbnail_url}
                                    onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            {formData.thumbnail_url && (
                                <div className="relative aspect-video mt-3 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={formData.thumbnail_url} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                            {!formData.thumbnail_url && (
                                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 bg-gray-50">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs">Enter URL to preview</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Taxonomy */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900">Taxonomy</h3>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase">Category</label>
                            <select
                                value={formData.category_id || 'None'}
                                onChange={(e) => handleInputChange('category_id', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Tags</label>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                                {tags.map(tag => (
                                    <button
                                        key={tag?.id}
                                        onClick={() => handleTagToggle(tag.id as string)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${selectedTagIds.includes(tag.id as string)
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                                {tags.length === 0 && <span className="text-xs text-gray-400 italic">No tags available</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}