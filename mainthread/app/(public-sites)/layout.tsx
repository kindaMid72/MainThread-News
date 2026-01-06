
// import navbar
import PublicNavBar from "@/components/PublicNavBar";
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>
        <PublicNavBar />
        {children}
    </>;
}