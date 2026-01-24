// CategoryPageSkeleton.tsx
// SSR-safe, no client hooks, tinggal render saat loading

export default function ArticlesSkeletonPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen animate-pulse">
            {/* Title */}
            <div className="h-10 w-64 bg-gray-200 rounded mb-12" />

            {/* Month Sections */}
            <div className="space-y-16">
                {Array.from({ length: 2 }).map((_, sectionIdx) => (
                    <section key={sectionIdx}>
                        {/* Month Year */}
                        <div className="h-7 w-40 bg-gray-200 rounded mb-6" />

                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, cardIdx) => (
                                <div
                                    key={cardIdx}
                                    className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                                >
                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Title */}
                                        <div className="space-y-2 mb-4">
                                            <div className="h-4 w-full bg-gray-200 rounded" />
                                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                        </div>

                                        {/* Meta */}
                                        <div className="mt-auto pt-3 border-t border-gray-50 flex gap-2">
                                            <div className="h-3 w-16 bg-gray-200 rounded" />
                                            <div className="h-3 w-12 bg-gray-200 rounded" />
                                            <div className="h-3 w-20 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-16 flex justify-center items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-md" />
                <div className="w-10 h-10 bg-gray-200 rounded-md" />
                <div className="w-10 h-10 bg-gray-200 rounded-md" />
                <div className="w-10 h-10 bg-gray-200 rounded-md" />
            </div>
        </div>
    );
}
