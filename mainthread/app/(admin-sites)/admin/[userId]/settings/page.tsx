
import SettingPage from "@/features/admin-sites/settings/SettingPage";

export const metadata = {
    title: "Settings - MainThread",
    description: "Settings in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Settings() {
    return (
        <SettingPage />
    );
}