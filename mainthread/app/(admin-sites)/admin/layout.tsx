
import MainNavBar from "@/components/MainNavBar";
export default function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <MainNavBar />
            {children}
        </div>
    );
}