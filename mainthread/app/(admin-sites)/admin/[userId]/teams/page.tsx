
import TeamPage from "@/features/admin-sites/teams/TeamPage";

export const metadata = {
    title: "Teams - MainThread",
    description: "Teams in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Teams() {
    return (
        <TeamPage />
    );
}