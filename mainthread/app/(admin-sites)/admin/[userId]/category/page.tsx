import CategoryPage from "@/features/admin-sites/categories/CategoryPage";

export const metadata = {
    title: "Category - MainThread",
    description: "Category in MainThread",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CategoriesPage() {
    return (
        <CategoryPage />
    );
}