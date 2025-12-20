"use client"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
/**
 * 
 * FIXME: awesome icon didnt shown
 */

export default function NavBar() {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const { userId } = params;

    // state
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    // navigation items
    const navItems = [
        { name: 'Dashboard', path: 'dashboard', icon: 'fa-chart-line' },
        { name: 'Articles', path: 'articles', icon: 'fa-newspaper' },
        { name: 'Tags', path: 'tags', icon: 'fa-tags' },
        { name: 'Category', path: 'category', icon: 'fa-list' },
        { name: 'Teams', path: 'teams', icon: 'fa-users' },
        { name: 'Settings', path: 'settings', icon: 'fa-gear' },
    ];

    // active/inactive styles (White Theme)
    const activeClass = 'bg-gray-100 text-gray-900 font-semibold border-l-4 border-gray-800';
    const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent';

    const handleNavigate = (path: string) => {
        router.push(`/admin/${userId}/${path}`);
        setShowSidebar(false); // Close sidebar on mobile select
    };

    const isActive = (path: string) => pathname.includes(path);

    return (
        <nav className='sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-[0px_0px_20px_rgba(0,0,0,0.1)]'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>

                    {/* Logo & Desktop Menu */}
                    <div className='flex'>
                        <div className='shrink-0 flex items-center gap-2'>
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className='p-2 -ml-2 mr-2 text-gray-600 rounded-md  hover:bg-gray-100 lg:hidden focus:outline-none'
                            >
                                <i className="fa-solid fa-bars text-xl text-black"></i>
                            </button>
                            <span className="text-xl font-bold text-blue-900 tracking-tight">Main<span className="text-xl font-bold text-red-500 tracking-tight">Thread</span> <span className="text-xs font-normal text-gray-500">Writers</span></span>
                        </div>

                        {/* Desktop Menu Items (Horizontal) */}
                        <div className='hidden lg:ml-10 lg:flex lg:space-x-8'>
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigate(item.path)}
                                    className={`inline-flex items-center px-1 pt-1 cursor-pointer border-b-3 text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                                            ? 'border-red-800 text-blue-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Profile / Logout */}
                    <div className='flex items-center'>
                        <button
                            onClick={() => router.push('/')}
                            className='hidden cursor-pointer lg:flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none transition'
                        >   
                            <p>Logout</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            {showSidebar && (
                <div className='lg:hidden bg-white border-t border-gray-200'>
                    <div className='pt-2 pb-3 space-y-1 px-2 shadow-lg'>
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => handleNavigate(item.path)}
                                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${isActive(item.path)
                                        ? 'bg-gray-50 border-gray-800 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <i className={`fa-solid ${item.icon} w-5 mr-1`}></i>
                                    {item.name}
                                </div>
                            </button>
                        ))}
                        <button
                            onClick={() => router.push('/login')}
                            className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-200 mt-2`}
                        >
                            <div className="flex items-center cursor-pointer">
                                <i className="fa-solid fa-arrow-right-from-bracket mr-1"></i>
                                <p>Logout</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}