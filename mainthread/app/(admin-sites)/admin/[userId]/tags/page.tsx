
import TagsPage from "@/features/admin-sites/tags/TagsPage";

export const metadata = {
    title: "Tags - MainThread",
    description: "Tags in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Tags() {
    return (
        <TagsPage />
    );
}