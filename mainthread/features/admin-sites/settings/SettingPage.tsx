"use client";

import { Construction, Facebook, Globe, Instagram, Save, Search, Share2, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';

const featureReady = false;

export default function SettingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };
    if (!featureReady) { // FIXME: full screen issue
        return ( 
        <div className=" flex-1 flex items-center justify-center h-full w-full bg-slate-50/30">
            <div className="flex flex-col items-center justify-center p-8 w-full text-center text-slate-500">
            <Construction className="w-16 h-16 mb-4 text-slate-300" />
            <h2 className="text-lg font-medium text-slate-900 mb-2">Feature Under Construction</h2>
            <p className="max-w-md mx-auto">We are currently working on this feature. Please check back later for updates.</p>
            </div>
        </div>
    );
  }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl mb-2 font-bold">Pengaturan Situs</h1>
                    <p className="text-gray-600">Konfigurasi umum website dan SEO</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Site Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <h2 className="font-semibold text-gray-900">Informasi Situs</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Situs</label>
                            <input
                                type="text"
                                defaultValue="Berita Indonesia"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                            <input
                                type="text"
                                defaultValue="Portal Berita Terpercaya"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                defaultValue="Portal berita terpercaya untuk informasi terkini"
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Default */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-500" />
                        <h2 className="font-semibold text-gray-900">SEO Default</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                defaultValue="Berita Indonesia - Portal Berita Terkini"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <p className="mt-1 text-xs text-gray-500">Judul yang muncul di hasil pencarian Google</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                                defaultValue="Dapatkan berita terkini, terpercaya, dan terlengkap dari berbagai kategori"
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <p className="mt-1 text-xs text-gray-500">Deskripsi singkat yang muncul di bawah judul pada hasil pencarian</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                    <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-gray-500" />
                        <h2 className="font-semibold text-gray-900">Social Media</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                            </label>
                            <input
                                type="url"
                                defaultValue="https://facebook.com/beritaindo"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-sky-500" /> Twitter (X)
                            </label>
                            <input
                                type="url"
                                defaultValue="https://twitter.com/beritaindo"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                            </label>
                            <input
                                type="url"
                                defaultValue="https://instagram.com/beritaindo"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Youtube className="w-4 h-4 text-red-600" /> YouTube
                            </label>
                            <input
                                type="url"
                                defaultValue="https://youtube.com/beritaindo"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}