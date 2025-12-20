"use client";

import { TeamMember } from '@/types/TeamMember.type';
import { Edit, Plus, Save, Search, X, Mail } from 'lucide-react';
import { useState } from 'react';

// Initial mock data
const initialTeam: TeamMember[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'Admin',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random'
    },
    {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'Editor',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random'
    },
    {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'Author',
        status: 'Inactive',
        avatarUrl: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=random'
    }
];

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>(initialTeam);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', role: 'Author' });

    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (!newUser.email) return;

        const newMember: TeamMember = {
            id: String(team.length + 1),
            name: newUser.email.split('@')[0], // Placeholder name from email
            email: newUser.email,
            role: newUser.role as 'Admin' | 'Editor' | 'Author',
            status: 'Active',
            avatarUrl: `https://ui-avatars.com/api/?name=${newUser.email}&background=random`
        };

        setTeam([...team, newMember]);
        setNewUser({ email: '', role: 'Author' });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setNewUser({ email: '', role: 'Author' });
        setIsAdding(false);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl mb-2 font-bold">Manajemen User</h1>
                        <p className="text-gray-600">Kelola pengguna dan hak akses</p>
                    </div>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Pengguna
                        </button>
                    )}
                </div>

                {/* Inline Add Form */}
                {isAdding && (
                    <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-lg font-semibold mb-4">Tambah Pengguna Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Pengguna</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                    placeholder="nama@perusahaan.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                >
                                    <option value="Author">Author</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={!newUser.email}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Mail className="w-4 h-4" />
                                Undang
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

                {/* Search */}
                {/* <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari pengguna..."
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
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                        Role
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
                                {filteredTeam.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={member.avatarUrl}
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full bg-gray-200"
                                                />
                                                <div className="text-sm font-medium text-gray-900">
                                                    {member.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {member.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                                    member.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${member.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}