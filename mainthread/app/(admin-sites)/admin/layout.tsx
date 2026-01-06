
import MainNavBar from "@/components/MainNavBar";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col w-full">
            <MainNavBar />
            <div className="flex-1 h-full flex flex-col w-full">
                {children}
            </div>
        </div>
    );
}   