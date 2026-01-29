
// import articles page
import ArticlesPage from "@/features/admin-sites/articles/ArticlesPage";

export const metadata = {
    title: "Articles - MainThread",
    description: "Articles in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Articles() {
    return (
        <ArticlesPage />
    );
}