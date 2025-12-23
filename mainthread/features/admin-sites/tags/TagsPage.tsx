

"use client";

import { Tag } from '@/types/Tag.type';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import OverlayTagsEditPage from './tags-subpage/OverlayTagsEditPage';

// Initial mock data TODO: fetch data from server
const initialTags: Tag[] = [
    { id: '1', name: 'NextJS', slug: 'nextjs' },
    { id: '2', name: 'React', slug: 'react' },
    { id: '3', name: 'Tutorial', slug: 'tutorial' },
    { id: '4', name: 'Programming', slug: 'programming' }
];

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>(initialTags);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newTagName, setNewTagName] = useState('');

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!newTagName) return; // Basic validation

        const slug = newTagName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newEntry: Tag = {
            id: String(tags.length + 1),
            name: newTagName,
            slug: slug
        };

        setTags([...tags, newEntry]);
        setNewTagName('');
        setIsAdding(false);
    };

    const handleCancel = () => {
        setNewTagName('');
        setIsAdding(false);
    };
    
    // Edit Overlay State
    const [editOverlayOpen, setEditOverlayOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    
    const handleEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setEditOverlayOpen(true);
    };

    const handleUpdateTag = (updatedTag: Tag) => {
        setTags(tags.map(t => t.id === updatedTag.id ? updatedTag : t));
        setEditOverlayOpen(false);
        setSelectedTag(null);
    };
    
    const handleDeleteTag = (tagId: string) => {
        setTags(tags.filter(t => t.id !== tagId));
        setEditOverlayOpen(false);
        setSelectedTag(null);
    };
    
    return (
        <div className="p-6">
            {/* Edit Overlay */}
            {editOverlayOpen && (
                <OverlayTagsEditPage
                    isOpen={editOverlayOpen}
                    onClose={() => setEditOverlayOpen(false)}
                    tag={selectedTag}
                    onSave={handleUpdateTag}
                    onDelete={handleDeleteTag}
                />
            )}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl mb-2 font-bold">Manajemen Tag</h1>
                        <p className="text-gray-600">Kelola tag artikel di sistem</p>
                    </div>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Tag
                        </button>
                    )}
                </div>

                {/* Inline Add Form */}
                {isAdding && (
                    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-lg font-semibold mb-4">Tambah Tag Baru</h3>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tag</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="Contoh: Javascript"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!newTagName}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                Simpan
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                                Batalkan
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search & List */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow-sm border overflow-hidden">
                        {/* <div className="p-4 border-b bg-gray-50">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari tag..."
                                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                        </div> */}

                        <div className="divide-y divide-gray-100">
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-4">Nama Tag</div>
                                <div className="col-span-5">Slug</div>
                                <div className="col-span-3 text-right">Aksi</div>
                            </div>

                            {filteredTags.length > 0 ? (
                                filteredTags.map((tag) => (
                                    <div key={tag.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-4 font-medium text-gray-900">
                                            {tag.name}
                                        </div>
                                        <div className="col-span-5">
                                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                {tag.slug}
                                            </span>
                                        </div>
                                        <div className="col-span-3 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    Tidak ada tag ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}