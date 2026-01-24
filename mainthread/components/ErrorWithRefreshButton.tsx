import { RefreshCcw, AlertTriangle } from "lucide-react";

export default function ErrorWithRefreshButton({
    onRefresh,
}: {
    onRefresh: () => void;
}) {
    return (
        <div className="flex h-screen fixed w-full flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-transparent">
                <AlertTriangle className="size-40 text-red-600" />
            </div>

            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900">
                Data Fetch Failed
            </h1>

            <p className="mb-10 max-w-md text-base leading-relaxed text-gray-600">
                Server unreachable. Could be a network issue or the service is temporarily down.
            </p>

            <button
                onClick={onRefresh}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
            >
                <RefreshCcw className="h-4 w-4" />
                Reload
            </button>
        </div>
    );
}
