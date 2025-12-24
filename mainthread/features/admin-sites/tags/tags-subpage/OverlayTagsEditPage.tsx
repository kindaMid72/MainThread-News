"use client";

import ConfirmationMessage from "@/components/ConfirmationMessage";
import { Tag, TagQuery } from "@/types/Tag.type";
import { AlignLeft, Save, Tag as TagIcon, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface OverlayTagsEditPageProps {
    isOpen: boolean;
    onClose: () => void;
    tag: TagQuery | null;
    onSave: (updatedTag: Tag) => void;
    onDelete: (tagId: string) => void;
}

export default function OverlayTagsEditPage({ isOpen, onClose, tag, onSave, onDelete }: OverlayTagsEditPageProps) {
    if (!isOpen || !tag) return null;

    const [editedTag, setEditedTag] = useState<Tag>(tag);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Update local state when tag prop changes
    useEffect(() => {
        if (tag) {
            setEditedTag(tag);
        }
    }, [tag]);

    const handleSave = () => {
        onSave(editedTag);
        onClose();
    };

    const handleDelete = () => {
        onDelete(tag.id as string);
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
                    title="Hapus Tag?"
                    message={`Apakah Anda yakin ingin menghapus tag "${tag.name}"? Tindakan ini tidak dapat dibatalkan.`}
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
                    <h2 className="text-lg font-bold text-gray-900">Edit Tag</h2>
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
                                <TagIcon className="w-4 h-4 text-gray-400" />
                                Nama Tag
                            </label>
                            <input
                                type="text"
                                value={editedTag.name}
                                onChange={(e) => setEditedTag({ ...editedTag, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Masukkan nama tag"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-gray-400" />
                                Slug
                            </label>
                            <input
                                type="text"
                                value={editedTag.slug}
                                onChange={(e) => setEditedTag({ ...editedTag, slug: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 font-mono text-sm"
                                placeholder="slug-tag"
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
                        Hapus Tag
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
                            disabled={!editedTag.name}
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