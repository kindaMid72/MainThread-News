"use client";

import api from '@/libs/axiosInterceptor/axiosAdminInterceptor';

import { TeamMember } from '@/types/TeamMember.type';
import { Edit, Mail, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import OverlayTeamEditPage from './teams-subpage/OverlayTeamEditPage';

// components
import PopUpMessage from '@/components/PopUpMessage';

const avatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${name}&background=random`;

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // async state
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', role: 'Author' });
    const [popUpMessage, setPopUpMessage] = useState<{
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        show: boolean;
        duration?: number;
        onClose?: () => void;
    }>({
        title: '',
        message: '',
        type: 'success',
        show: false
    });

    // Edit Overlay State
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);

    // fetch data
    async function fetchData() {
        setIsLoading(true);
        try {
            const response = await api.get(`/api/admin/teams/get-all-users`);
            const data: TeamMember[] = response.data;
            if(data){
                setIsError(false);
            }
            setTeam(data);
        } catch (err) {
            console.log(err);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSave = async () => {
        if (!newUser.email) return;


        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/admin/teams/invite-new-user`, {
                email: newUser.email,
                role: newUser.role
            });
            if(response.status === 200){
                setPopUpMessage({
                    title: 'success',
                    message: response.data.message || 'User invited successfully',
                    type: 'success',
                    show: true
                });
                
            }else{
                setPopUpMessage({
                    title: 'error',
                    message: response.data.message || 'User invited failed',
                    type: 'error',
                    show: true
                });
            }

        } catch (err) {
            setPopUpMessage({
                title: 'error',
                message: 'User invitation failed',
                type: 'error',
                show: true
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setNewUser({ email: '', role: 'Author' });
        setIsAdding(false);
    };

    const handleEditClick = (member: TeamMember) => {
        setEditingMember(member);
        setIsEditOverlayOpen(true);
    };

    const handleUpdateMember = async (updatedMember: TeamMember) => {
        // check input
        try{
            setIsLoading(true);
            const response = await api.put(`/api/admin/teams/update-user`, {
                id: updatedMember.id,
                name: updatedMember.name,
                role: updatedMember.role,
                isActive: updatedMember.isActive
            });
            if(response.status === 200){
                setPopUpMessage({
                    title: 'success',
                    message: response.data.message || 'User updated successfully',
                    type: 'success',
                    show: true
                });
            }else{
                setPopUpMessage({
                    title: 'error',
                    message: response.data.message || 'User updated failed',
                    type: 'error',
                    show: true
                });
            }
        }catch(err){
            setPopUpMessage({
                title: 'error',
                message: 'User update failed',
                type: 'error',
                show: true
            });
        }finally{
            setIsLoading(false);
        }
        fetchData();
    };

    const handleDeleteMember = (memberId: string) => {
        // TODO: implement api call to delete member, then trigger update for data fetching
        setTeam(team.filter(m => m.id !== memberId));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Skeleton Loading
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <th key={i} className="px-6 py-3">
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[1, 2, 3, 4, 5].map((row) => (
                                        <tr key={row}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div></td>
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

    // Error State
    if (isError) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 text-red-600">⚠️</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h3>
                <p className="text-gray-500 max-w-md mb-6">
                    Terjadi kesalahan saat menghubungi server. Mohon periksa koneksi internet Anda atau coba beberapa saat lagi.
                </p>
                <button
                    onClick={() => fetchData()}
                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {popUpMessage.show && 
                <PopUpMessage
                    title={popUpMessage.title}
                    message={popUpMessage.message}
                    type={popUpMessage.type}
                    duration={popUpMessage.duration}
                    onClose={() => setPopUpMessage({ ...popUpMessage, show: false })}
                />
            }

            <OverlayTeamEditPage
                isOpen={isEditOverlayOpen}
                onClose={() => setIsEditOverlayOpen(false)}
                member={editingMember}
                onSave={handleUpdateMember}
                onDelete={handleDeleteMember}
            />
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
                                    <option value="writer">writer</option>
                                    <option value="admin">admin</option>
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
                                {team.map((member) => (
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
                                                ${member.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                                    member.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${member.isActive ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleEditClick(member)}
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
