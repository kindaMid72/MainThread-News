

export default function LoadingSkeletonTable() {
    return (
            <div className="p-6">
                <div className="mb-8">
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