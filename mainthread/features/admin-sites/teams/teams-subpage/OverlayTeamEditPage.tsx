"use client";

import ConfirmationMessage from "@/components/ConfirmationMessage";
import { TeamMember } from "@/types/TeamMember.type";
import { Activity, Mail, Save, Shield, Trash2, User, X } from "lucide-react";
import { useState } from "react";

interface OverlayTeamEditPageProps {
    isOpen: boolean;
    onClose: () => void;
    member: TeamMember | null;
    onSave: (updatedMember: TeamMember) => void;
    onDelete: (memberId: string) => void;
}

export default function OverlayTeamEditPage({ isOpen, onClose, member, onSave, onDelete }: OverlayTeamEditPageProps) {
    if (!isOpen || !member) return null;

    const [editedMember, setEditedMember] = useState<TeamMember>(member);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = () => {
        onSave(editedMember);
        onClose();
    };
    
    const handleDelete = () => {
        onDelete(member.id);
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
                    title="Hapus Anggota Tim?"
                    message={`Apakah Anda yakin ingin menghapus "${member.name}"? Tindakan ini tidak dapat dibatalkan.`}
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
                    <h2 className="text-lg font-bold text-gray-900">Edit Anggota Tim</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* User Profile Preview */}
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-16 h-16 rounded-full bg-white shadow-sm object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                            <div className="flex items-center gap-1.5 text-blue-600 text-sm">
                                <Mail className="w-3.5 h-3.5" />
                                {member.email}
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="space-y-4">
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={editedMember.name}
                                onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                Role
                            </label>
                            <select
                                value={editedMember.role}
                                onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value as any })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="writer">Writer</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Super Admin dan Admin memiliki akses penuh. Writer hanya bisa menulis & publish artikel.
                            </p>
                        </div>

                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-gray-400" />
                                Status
                            </label>
                            <select
                                value={editedMember.isActive ? 'Active' : 'Inactive'}
                                onChange={(e) => setEditedMember({ ...editedMember, isActive: e.target.value === 'Active' })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
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
                        Hapus User
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
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
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