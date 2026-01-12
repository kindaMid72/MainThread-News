
export default function ArticleSkeletonLoading() {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-3">
                    {/* Back link */}
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    {/* Title */}
                    <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
                    {/* Description */}
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
                    {/* Save Button */}
                    <div className="h-10 w-36 rounded-lg bg-gray-200 animate-pulse" />
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {/* Main Content Column */}
                <div className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-14 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Slug Input */}
                    <div className="space-y-2">
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Editor */}
                    <div className="space-y-2">
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-96 w-full bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing Status Card */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-7 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div>
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-7 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Card */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                            <div className="aspect-video w-full bg-gray-200 rounded-lg animate-pulse mt-3" />
                        </div>
                    </div>

                    {/* Taxonomy Card */}
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />

                        {/* Category */}
                        <div className="space-y-2">
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="flex flex-wrap gap-2">
                                <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
                                <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                                <div className="h-6 w-14 rounded-full bg-gray-200 animate-pulse" />
                                <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}