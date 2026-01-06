"use client"
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
/**
 * 
 * FIXME: awesome icon didnt shown
 */

export default function PublicNavBar() {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const { userId } = params;

    // state
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    // navigation items
    const navItems = [// landing page (no route), about, all article, contact,  
        { name: 'Thread', path: '', icon: 'fa-chart-line' },
        { name: 'Articles', path: 'articles', icon: 'fa-newspaper' },
        { name: 'About', path: 'about', icon: 'fa-info-circle' },
        { name: 'Contact', path: 'contact', icon: 'fa-envelope' },
    ];

    // active/inactive styles (White Theme)
    const activeClass = 'bg-gray-100 text-gray-900 font-semibold border-l-4 border-gray-800';
    const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent';

    const handleNavigate = (path: string) => {
        router.push(`/${path}`);
        setShowSidebar(false); // Close sidebar on mobile select
    };

    const isActive = (path: string) => pathname.includes(path);

    return (
        <nav className='sticky flex flex-col top-0 z-50 w-full bg-white border-b border-gray-200 shadow-[0px_0px_20px_rgba(0,0,0,0.1)]'>
            <div className='shrink-0 flex items-center gap-2 px-4'>
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className='p-2 -ml-2 mr-2 text-gray-600 rounded-md  hover:bg-gray-100 lg:hidden focus:outline-none'
                >
                    <i className="fa-solid fa-bars text-xl text-black"></i>
                </button>
                <div onClick={() => handleNavigate('')} className='flex flex-1 items-center justify-center gap-2 cursor-pointer'>
                    <span className="text-3xl font-bold text-blue-900 tracking-tight">Main<span className="text-3xl font-bold text-red-500 tracking-tight">Thread</span> <span className="text-xl font-normal text-gray-500">news</span></span>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden lg:block'>
                <div className='flex justify-between h-16'>
                    <div className='flex justify-center'>
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
                </div>
            </div>

            {/* Mobile Menu (Dropdown) */}
            {showSidebar && (
                <div className='lg:hidden bg-white border-t border-gray-200'>
                    <div className='pt-2 pb-3 space-y-1 px-2 shadow-lg '>
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
                    </div>
                </div>
            )}
        </nav>
    );
}