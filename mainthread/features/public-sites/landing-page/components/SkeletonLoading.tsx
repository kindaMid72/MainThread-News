

export default function SkeletonLoading() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-gray-900 pb-20 px-4">
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* === Hero Section Grid === */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-pulse">

                    {/* Left Column Skeleton */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="border-t-4 border-gray-200 pt-4">
                            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="flex flex-col gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                        <div className="w-full aspect-video bg-gray-200"></div>
                                        <div className="p-4 flex flex-col gap-2">
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                                            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Column Skeleton */}
                    <div className="col-span-1 lg:col-span-6">
                        <div className="w-full aspect-16/10 bg-gray-200 rounded-xl mb-4"></div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-full bg-gray-200 rounded"></div>
                            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                            <div className="flex flex-col gap-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* === Categories Skeleton === */}
                {[1, 2].map((cat) => (
                    <div key={cat} className="mb-12 animate-pulse">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                    <div className="w-full aspect-video bg-gray-200"></div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                                        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </main>
        </div>
    );
}