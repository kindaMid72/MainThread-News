

export default function ErrorWithRefreshButton({onRefresh}: {onRefresh: () => void}) {
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
                onClick={onRefresh}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
                Coba Lagi
            </button>
        </div>
    );
}