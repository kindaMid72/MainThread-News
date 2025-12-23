

"use client";

import { Category } from '@/types/Category.type';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import OverlayCategoryEditPage from './categories-subpage/OverlayCategoryEditPage'

// Initial mock data
const initialCategories: Category[] = [
    {
        id: '1',
        name: 'Teknologi',
        slug: 'teknologi',
        description: 'Berita terkini seputar teknologi dan inovasi'
    },
    {
        id: '2',
        name: 'Gaya Hidup',
        slug: 'gaya-hidup',
        description: 'Tips dan tren gaya hidup masa kini'
    },
    {
        id: '3',
        name: 'Olahraga',
        slug: 'olahraga',
        description: 'Update skor dan berita olahraga terbaru'
    }
];

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!newCategory.name) return; // Basic validation

        const slug = newCategory.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newEntry: Category = {
            id: String(categories.length + 1),
            name: newCategory.name,
            description: newCategory.description,
            slug: slug
        };

        setCategories([...categories, newEntry]);
        setNewCategory({ name: '', description: '' });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setNewCategory({ name: '', description: '' });
        setIsAdding(false);
    };

    // Edit Overlay State
    const [editOverlayOpen, setEditOverlayOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setEditOverlayOpen(true);
    };

    const handleUpdateCategory = (updatedCategory: Category) => {
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setEditOverlayOpen(false);
        setSelectedCategory(null);
    };
    
    const handleDeleteCategory = (categoryId: string) => {
        setCategories(categories.filter(c => c.id !== categoryId));
        setEditOverlayOpen(false);
        setSelectedCategory(null);
    };
    
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
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
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
                </div>
            </div>
            {/* Edit Overlay */}
        </div>
    );
}