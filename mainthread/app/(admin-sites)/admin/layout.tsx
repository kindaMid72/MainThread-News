
import MainNavBar from "@/components/MainNavBar";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-900">
            <MainNavBar />
            {children}
        </div>
    );
}   