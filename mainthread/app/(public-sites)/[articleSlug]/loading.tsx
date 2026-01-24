// SpecificArticlePageSkeleton.tsx
// SSR-safe, pure JSX + Tailwind, struktur 1:1, animate-pulse

export default function SpecificArticlePageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    {/* Hero Image */}
                    <div className="w-full aspect-video rounded-2xl bg-gray-200 mb-8" />

                    {/* Header */}
                    <div className="mb-8 border-b-2 border-gray-300 pb-8">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />

                        <div className="space-y-3 mb-6">
                            <div className="h-8 w-full bg-gray-200 rounded" />
                            <div className="h-8 w-5/6 bg-gray-200 rounded" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded" />
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-11/12 bg-gray-200 rounded" />
                                <div className="h-4 w-10/12 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

                        <div className="flex flex-col gap-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-full bg-gray-200 rounded" />
                                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                        <div className="h-3 w-24 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
