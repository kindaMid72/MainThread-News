"use client";

import ConfirmationMessage from "@/components/ConfirmationMessage";
import { Category } from "@/types/Category.type";
import { AlignLeft, FileText, Save, Trash2, Type, X } from "lucide-react";
import { useEffect, useState } from "react";

interface OverlayCategoryEditPageProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSave: (updatedCategory: Category) => void;
    onDelete: (categoryId: string) => void;
}

export default function OverlayCategoryEditPage({ isOpen, onClose, category, onSave, onDelete }: OverlayCategoryEditPageProps) {
    if (!isOpen || !category) return null;

    const [editedCategory, setEditedCategory] = useState<Category>(category);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Update local state when category prop changes
    useEffect(() => {
        if (category) {
            setEditedCategory(category);
        }
    }, [category]);

    const handleSave = () => {
        onSave(editedCategory);
        onClose();
    };

    const handleDelete = () => {
        onDelete(category.id);
        setShowDeleteConfirm(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            {/* Blur Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/30 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Confirmation for Delete */}
            {showDeleteConfirm && (
                <ConfirmationMessage
                    title="Hapus Kategori?"
                    message={`Apakah Anda yakin ingin menghapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`}
                    confirmColor="red"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    delayConfirm={true}
                    delaySecond={3}
                />
            )}

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between sticky top-0">
                    <h2 className="text-lg font-bold text-gray-900">Edit Kategori</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Type className="w-4 h-4 text-gray-400" />
                                Nama Kategori
                            </label>
                            <input
                                type="text"
                                value={editedCategory.name}
                                onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Masukkan nama kategori"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-gray-400" />
                                Slug
                            </label>
                            <input
                                type="text"
                                value={editedCategory.slug}
                                onChange={(e) => setEditedCategory({ ...editedCategory, slug: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 font-mono text-sm"
                                placeholder="slug-kategori"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Deskripsi
                            </label>
                            <textarea
                                value={editedCategory.description}
                                onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                                placeholder="Deskripsi kategori..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus Kategori
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
                        >
                            Batalkan
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!editedCategory.name}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}