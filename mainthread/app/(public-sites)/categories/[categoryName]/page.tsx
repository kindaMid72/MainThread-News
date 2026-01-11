
import CategoryPage from "@/features/public-sites/categories/CategoryPage";

// libs
import api from "@/libs/axiosInterceptor/axiosPublicInterceptor";

export default async function Category({params}: {params: Promise<{categoryName: string}>}) {
    const {categoryName} = await params;

    // fetch data, pass as props to CategoryPage
    const {data: categoryArticles}= await api.get(`/api/public/get-all-categories/${categoryName}`);

    return (
        <div>
            <CategoryPage articles={categoryArticles?.articles} count={categoryArticles?.count} />
        </div>
    );
}