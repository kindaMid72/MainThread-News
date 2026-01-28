
// page components
import ArticleEditPage from "@/features/admin-sites/articles/articles-subpage/ArticleEditPage";

export const metadata = {
    title: "Edit Article - MainThread",
    description: "Edit Article in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function EditArticle() {
    return (
        <div className="bg-gray-50">
            <ArticleEditPage />
        </div>
    );
}