"use client";

import { ArticleQuery, ArticleTag } from '@/types/Article.type';
import { CategoriesQuery } from '@/types/Category.type';
import { TagQuery } from '@/types/Tag.type';
import { AlertCircle, ArrowLeft, CheckCircle, Image as ImageIcon, Loader2, Save, Star, Trash, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditorTextBox from '../components/EditorTextBox';

import ConfirmationMessage from '@/components/ConfirmationMessage';
import { useDebounce } from '@/hooks/useDebounce';
import { Check, CloudUpload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import EditArticleSkeletonLoading from '../components/EditArticleSkeletonLoading';

// get user

// Mock current author for now - in real app, get from auth context

// api
import api from '@/libs/axiosInterceptor/axiosAdminInterceptor';

// component
import InputImage from '@/utils/inputTools/inputImage';

export default function ArticleEditPage() {
    const router = useRouter();
    const params = useParams();

    // Form State
    const [formData, setFormData] = useState<Partial<ArticleQuery>>({
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content_html: '',
        thumbnail_url: '',
        category_id: '',
        author_id: '',
        status: 'draft',
        source_type: 'auto',
        source_ref: '',
        view_count: 0,
        is_breaking: false,
        is_headline: false,
        published_at: '',
        updated_at: '',
        created_at: '',
        // tags will be handled separately if not in ArticleQuery, but assuming array of IDs for submission
    });
    const [initialData, setInitialData] = useState({
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content_html: '',
        thumbnail_url: '',
        category_id: '',
        author_id: '',
        status: 'draft',
        source_type: 'auto',
        source_ref: '',
        view_count: 0,
        is_breaking: false,
        is_headline: false,
        published_at: '',
        updated_at: '',
        created_at: '',
        tag_ids: []
    });

    // Tags selection state (since ArticleQuery might not have it directly mapped yet for submission)
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [initialTagIds, setInitialTagIds] = useState<string[]>([]);

    // Data for selectors
    const [categories, setCategories] = useState<CategoriesQuery[]>([]);
    const [tags, setTags] = useState<TagQuery[]>([]);

    // thumbnail file upload state
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    // UI States
    const [isLoadingFetch, setIsLoadingFetch] = useState(true);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [lastSavedContent, setLastSavedContent] = useState('');
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

    const debouncedContent = useDebounce(formData.content_html, 2000); // Auto-save delay 2s

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // confirm message
    const [isConfirmMessageOpen, setIsConfirmMessageOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingFetch(true);
            try {

                const articleRes = await api.get(`/api/admin/articles/get-article-by-id/${params.editArticleId}`);
                const articleData = articleRes.data;
                // console.log(articleData);

                // set article data
                setFormData(articleData.article);
                setLastSavedContent(articleData.article.content_html || '');

                // set active tags
                let tagIds: string[] = [];
                if (articleData.articleTags && articleData.articleTags.length > 0) {
                    tagIds = articleData.articleTags.map((tag: ArticleTag) => tag.tag_id);
                    //console.log(articleData.articleTags);
                    setSelectedTagIds(tagIds);
                    setInitialTagIds(tagIds); // for tracking changes
                }
                setInitialData({ ...articleData.article, tag_ids: tagIds });

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

    // Auto Save Logic
    useEffect(() => {
        const autoSave = async () => {
            if (!isAutoSaveEnabled || !formData.id || !formData.content_html) return;

            // Only save if content has changed and is different from last saved
            if (formData.content_html !== lastSavedContent && debouncedContent === formData.content_html) { // check weather the debounced content is sync with the form data(main content), if its sync & different from last saved, then save, its indicated that user stop typing and content had changed
                setIsAutoSaving(true);
                try {
                    await api.put(`/api/admin/articles/update-article-by-id/${formData.id}`, {
                        content_html: formData.content_html
                    });
                    setLastSavedContent(formData.content_html); // dont change isDirty until full save initialized, or user refused to save content before leaving
                } catch (error) {
                    console.error("Auto-save failed", error);
                } finally {
                    setIsAutoSaving(false);
                }
            }
        };

        if (isAutoSaveEnabled) {
            autoSave();
        }
    }, [debouncedContent, isAutoSaveEnabled]);

    // Unsaved Changes Warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleBack = () => {
        if (isDirty) {
            setIsConfirmMessageOpen(true);
        } else {
            router.back();
        }
    };

    // property handlers
    const handleInputChange = (field: keyof ArticleQuery, value: any) => {
        if (field === 'slug') {
            setFormData(prev => ({ ...prev, [field]: value.toLowerCase().replace(/[^a-zA-Z0-9\-_.~]/g, '-').replace(/-{2,}/g, '-') }));
            return;
        }
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        // Auto-generate slug from title if slug is empty
        if (field === 'title' && !formData.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug, [field]: value }));
        }
    };

    const handleTagToggle = (tagId: string) => {
        setIsDirty(true);
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    // form save handlers
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

            const response = await api.put(`/api/admin/articles/update-article-by-id/${formData.id}`, payload);

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Article saved successfully!' });
                setIsDirty(false);
                setLastSavedContent(formData.content_html || '');
            } else {
                throw new Error(response.data?.message || 'Failed to save');
            }

        } catch (error: any) {
            console.error("Save error:", error);
            if (error.response?.status === 404) {
                setMessage({ type: 'success', text: 'Article payload valid (Mock Success - Endpoint not ready)' });
            } else {
                setMessage({ type: 'error', text: error.message || 'Failed to save article' });
            }
        } finally {
            setIsSaving(false);
        }
    };
    const handleDelete = async () => {
        setMessage(null);
        setIsSaving(true);
        try {
            const response = await api.delete(`/api/admin/articles/delete-article-by-id/${formData.id}`);
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Article deleted successfully!' });
                router.back(); // go back to articles page, view update will be triggered
            } else {
                throw new Error(response.data?.message || 'Failed to delete');
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            if (error.response?.status === 404) {
                setMessage({ type: 'success', text: 'Article payload valid (Mock Success - Endpoint not ready)' });
            } else {
                setMessage({ type: 'error', text: error.message || 'Failed to delete article' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleUploadThumbnail = async (file: File) => {
        if (!file) return;
        try {
            setUploadingThumbnail(true);
            handleInputChange('thumbnail_url', ''); // kosongkan thumbnail_url sebelum upload
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post(`/api/admin/articles/upload-image/${params.editArticleId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // return 200? response.data?.url: message error
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: 'success', text: 'Thumbnail uploaded successfully!' });
                handleInputChange('thumbnail_url', response.data?.imageUrl);
            } else {
                throw new Error(response.data?.message || 'Failed to upload thumbnail');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload thumbnail' });
        } finally {
            setUploadingThumbnail(false);
        }
    };


    if (isLoadingFetch) {
        return (
            <EditArticleSkeletonLoading />
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
            {/* Warning message for saves */}
            {isConfirmMessageOpen && (
                <ConfirmationMessage
                    title="Save Changes?"
                    message="Save changes before leaving?"
                    onConfirm={() => { setIsConfirmMessageOpen(false); handleSubmit(); }}
                    onCancel={() => { setIsConfirmMessageOpen(false); setIsDirty(false); }}
                    delayCancel={false}
                    delayConfirm={false}
                    confirmColor='green'
                />
            )}

            {/* Warning message for delete */}
            {isDeleteConfirmOpen && (
                <ConfirmationMessage
                    title="Delete Article?"
                    message="Are you sure you want to delete this article? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                    delayCancel={false}
                    delayConfirm={true}
                    delaySecond={2}
                    confirmColor='red'
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1 cursor-pointer">
                    <div onClick={() => handleBack()} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </div>
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
                            value={formData.title || ''}
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
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-semibold text-gray-700">Content</label>
                            <div className="flex items-center gap-3">
                                {isAutoSaving && (
                                    <span className="text-xs text-blue-600 flex items-center animate-pulse">
                                        <CloudUpload className="w-3 h-3 mr-1" />
                                        Saving...
                                    </span>
                                )}
                                {!isAutoSaving && formData.content_html === lastSavedContent && lastSavedContent !== '' && (
                                    <span className="text-xs text-green-600 flex items-center">
                                        <Check className="w-3 h-3 mr-1" />
                                        Saved
                                    </span>
                                )}
                                <label className="flex items-center cursor-pointer gap-2">
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isAutoSaveEnabled}
                                            onChange={(e) => setIsAutoSaveEnabled(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Auto-save</span>
                                </label>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-auto h-fit shadow-sm">
                            <EditorTextBox
                                value={formData.content_html}
                                onChange={(html) => handleInputChange('content_html', html)} // set new html to local state
                                articleId={params.editArticleId as string}
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
                            {/* {uploadingThumbnail && (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            )} */}
                            <label className="text-xs font-medium text-gray-500 uppercase flex flex-nowrap items-center gap-1"><span>{uploadingThumbnail ? 'Uploading...' : 'Upload Image'}</span> <span>{uploadingThumbnail ? <span className="text-blue-800 flex flex-row items-center gap-1 flex-nowrap"><Loader2 className="w-3 h-3 animate-spin" /></span> : ''}</span></label>
                            <div className="flex gap-2">
                                <InputImage className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    onProcessed={(proceeded: any) => {
                                        handleUploadThumbnail(proceeded);

                                    }} />
                            </div>
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

                {/* Danger Zone */}
                <div className="p-5 bg-white border border-red-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-semibold text-red-900">Danger Zone</h3>
                    <p className="text-sm text-gray-500">
                        Deleting this article is irreversible. Please be certain.
                    </p>
                    <button
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className="w-full flex items-center cursor-pointer justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
                    >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete Article
                    </button>
                </div>
            </div>
        </div>

    );
}