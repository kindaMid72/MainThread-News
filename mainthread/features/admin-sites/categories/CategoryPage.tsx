

"use client";

import { Categories, CategoriesQuery } from '@/types/Category.type';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import OverlayCategoryEditPage from './categories-subpage/OverlayCategoryEditPage';

// api caller
import api from '@/libs/axiosInterceptor/axiosAdminInterceptor';

// components
import PopUpMessage from '@/components/PopUpMessage';
import ErrorWithRefreshButton from '@/components/ErrorWithRefreshButton';
import LoadingSkeletonTable from '@/components/LoadingSkeletonTabel';

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoriesQuery[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', isActive: true });

    
    // async state
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchCategories = async () => {
        try {
            const data: CategoriesQuery[] = await api.get('/api/admin/categories/get-all-categories')
                .then(res => res?.data)
                .catch(error => {
                    throw new Error(`Error fetching categories: ${error}`);
                });

            if (!data) throw new Error('Error fetching categories');

            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error(`Error fetching categories: ${error}`);
        }
    };

    const handleSave = () => {
        if (!newCategory.name) return; // Basic validation

        const slug = newCategory.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newEntry: Categories = {
            id: String(categories.length + 1),
            name: newCategory.name,
            description: newCategory.description,
            slug: slug,
            isActive: newCategory.isActive
        };

        setCategories([...categories, newEntry]);
        setNewCategory({ name: '', description: '', isActive: true });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setNewCategory({ name: '', description: '', isActive: true });
        setIsAdding(false);
    };

    // Edit Overlay State
    const [editOverlayOpen, setEditOverlayOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);

    const handleEdit = (category: Categories) => {
        setSelectedCategory(category);
        setEditOverlayOpen(true);
    };

    const handleUpdateCategory = (updatedCategory: Categories) => {
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setEditOverlayOpen(false);
        setSelectedCategory(null);
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories(categories.filter(c => c.id !== categoryId));
        setEditOverlayOpen(false);
        setSelectedCategory(null);
    };

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        (async () => {
            try {
                await fetchCategories();
            } catch (error) {
                setIsError(true);
            }finally{
                setIsLoading(false);
            }
        })();
    }, []);

    if(isError) return <ErrorWithRefreshButton onRefresh={() => fetchCategories()} />;
    if(isLoading) return <LoadingSkeletonTable />;

    return (
        <div className="p-6">
            
            {
                editOverlayOpen && (
                    <OverlayCategoryEditPage
                        isOpen={editOverlayOpen}
                        onClose={() => setEditOverlayOpen(false)}
                        category={selectedCategory}
                        onSave={handleUpdateCategory}
                        onDelete={handleDeleteCategory}
                    />
                )
            }
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl mb-2 font-bold">Manajemen Kategori</h1>
                        <p className="text-gray-600">Kelola kategori artikel di sistem</p>
                    </div>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Kategori
                        </button>
                    )}
                </div>

                {/* Inline Add Form */}
                {isAdding && (
                    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-lg font-semibold mb-4">Tambah Kategori Baru</h3>
                        <div className="grid gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Contoh: Ekonomi"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Deskripsi singkat kategori..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={newCategory.isActive ? 'Active' : 'Inactive'}
                                    onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.value === 'Active' })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!newCategory.name}
                                className="flex items-center gap-2 bg-gray-900 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                Simpan
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Batalkan
                            </button>
                        </div>
                    </div>
                )}

                {/* Search */}
                {/* <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari kategori..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                </div> */}

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                                {category.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {category.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Edit Overlay */}
        </div>
    );
}