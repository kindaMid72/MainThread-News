

"use client";

import { Tag, TagQuery } from '@/types/Tag.type';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import OverlayTagsEditPage from './tags-subpage/OverlayTagsEditPage';

// libs
import api from '@/libs/axiosInterceptor/axiosAdminInterceptor'

// components
import LoadingSkeletonTable from '@/components/LoadingSkeletonTabel';
import ErrorPage from '@/components/ErrorWithRefreshButton';
import PopUpMessage from '@/components/PopUpMessage';

// Initial mock data TODO: fetch data from server

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newTagName, setNewTagName] = useState('');

    // Loading State
    const [isLoadingFetch, setIsLoadingFetch] = useState(true);
    const [isErrorFetch, setIsErrorFetch] = useState(false);

    // loading save & edit
    const [isLoadingSave, setIsLoadingSave] = useState(false);

    // popupmessage
    const [popUpMessage, setPopUpMessage] = useState({
        show: false,
        title: '',
        message: '',
        type: 'success',
    })

    const fetchTags = async () => {
        try{
            setIsLoadingFetch(true);
            const response = await api.get('/api/admin/tags/get-all-tags')
            const data = await response.data;
            setTags(data);
        }catch(error){
            setIsErrorFetch(true);
        }finally{
            setIsLoadingFetch(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleSave = async () => {
        if (!newTagName.trim()) return; // Basic validation

        const newEntry: Tag = {
            name: newTagName,
        };

        try{
            setIsLoadingSave(true);

            const response: any = await api.post('/api/admin/tags/add-new-tag', newEntry)

            if(response.status !== 200){
                setPopUpMessage({
                    show: true,
                    title: 'Error',
                    message: response?.response?.data?.message || 'Problem occured, maybe tag already exists',
                    type: 'error',
                })
            }else{
                setPopUpMessage({
                    show: true,
                    title: 'Success',
                    message: response?.response?.data?.message || 'Tag added successfully',
                    type: 'success',
                })
            }
        }catch(error){
            setPopUpMessage({
                show: true,
                title: 'Error',
                message: 'Problem occured, maybe tag already exists',
                type: 'error',
            })
        }finally{
            fetchTags();
            setIsAdding(false);
            setIsLoadingSave(false);
        }
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

    const handleUpdateTag = async (updatedTag: Tag) => {
        try{
            setIsLoadingSave(true);
            setIsLoadingFetch(true);
            const response: any = await api.put(`/api/admin/tags/update-tag`, updatedTag); // pass newName and id
            if(response.status !== 200){
                setPopUpMessage({
                    show: true,
                    title: 'Error',
                    message: 'Problem occured, maybe tag not found',
                    type: 'error',
                })
            }else{
                setPopUpMessage({
                    show: true,
                    title: 'Success',
                    message: 'Tag updated successfully',
                    type: 'success',
                })
            }
        }catch(error){
            setPopUpMessage({
                show: true,
                title: 'Error',
                message: 'Problem occured, maybe tag not found',
                type: 'error',
            })
        }finally{
            fetchTags();
            setIsLoadingSave(false);
            setEditOverlayOpen(false);
            setSelectedTag(null);
        }
    };
    
    const handleDeleteTag = async (tagId: string) => {
        try{
            setIsLoadingSave(true);
            setIsLoadingFetch(true);
            const response = await api.delete(`/api/admin/tags/delete-tag/${tagId}`);
            if(response.status !== 200){
                setPopUpMessage({
                    show: true,
                    title: 'Error',
                    message: 'Problem occured, maybe tag not found',
                    type: 'error',
                })
            }else{
                setPopUpMessage({
                    show: true,
                    title: 'Success',
                    message: 'Tag deleted successfully',
                    type: 'success',
                })
            }
        }catch(error){
            setPopUpMessage({
                show: true,
                title: 'Error',
                message: 'Problem occured, maybe tag not found',
                type: 'error',
            })
        }finally{
            fetchTags();
            setIsLoadingSave(false);
        }
    };
    if(isLoadingFetch){
        return <LoadingSkeletonTable />;
    }
    if(isErrorFetch){
        return <ErrorPage onRefresh={fetchTags} />;
    }

    return (
        <div className="p-6">

            {popUpMessage.show && (
                <PopUpMessage
                    title={popUpMessage.title}
                    message={popUpMessage.message}
                    type={popUpMessage.type}
                    onClose={() => setPopUpMessage({ show: false, title: '', message: '', type: 'success' })}
                />
            )}
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
                                disabled={!newTagName || isLoadingSave}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isLoadingSave}
                                className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search & List */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow-sm border overflow-auto">
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
                                <div className="col-span-4">Name Tag</div>
                                <div className="col-span-6">Slug</div>
                                <div className="col-span-2 text-center ">Action</div>
                            </div>

                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <div key={tag.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-4 font-medium text-gray-900">
                                            {tag.name}
                                        </div>
                                        <div className="col-span-6">
                                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                {tag.slug}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex w-full justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
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