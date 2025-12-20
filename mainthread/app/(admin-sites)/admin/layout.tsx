
import MainNavBar from "@/features/admin-sites/components/MainNavBar";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <MainNavBar />
            {children}
        </div>
    );
}