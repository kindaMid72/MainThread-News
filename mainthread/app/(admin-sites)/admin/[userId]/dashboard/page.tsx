
// dashboard page
import DashboardPage from "@/features/admin-sites/dashboard/DashboardPage";

export const metadata = {
    title: "Dashboard - MainThread",
    description: "Dashboard in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Dashboard() {
    return (
        <div className="h-full flex-1 flex flex-col w-full">
            <DashboardPage />
        </div>
    );
}