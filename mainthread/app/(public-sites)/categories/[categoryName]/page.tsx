
import CategoryPage from "@/features/public-sites/categories/CategoryPage";

// libs
import api from "@/libs/axiosInterceptor/axiosPublicInterceptor";
import { cache } from 'react';
import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ categoryName: string }>, searchParams: Promise<{ page?: string, limit?: string }> }): Promise<Metadata> {
    const { categoryName } = await params;
    let { page = '1', limit = '10' } = await searchParams;

    if(!page || !limit){
        page = '1';
        limit = '10';
    }

    return {
        title: categoryName.split('-').slice(0, -1).join(' ') + ' Articles | Page ' + page,
        description: `Articles in ${categoryName.split('-').slice(0, -1).join(' ')}`,
        robots: {
            index: false, // index only first page
            follow: false,
        },
        alternates: {
            canonical: `/categories/${categoryName}`,
        }

    };
}

const getCategoryArticles = cache(async (categoryName: string, page: number, limit: number) => {
    try {
        const { data } = await api.get(`/api/public/get-all-categories/${categoryName}?page=${page}&limit=${limit}`);
        return data; // assuming data is { articles: [...], count: ... }
    } catch (error) {
        console.error("Failed to fetch category articles", error);
        return { articles: [], count: 0 };
    }
});

export default async function Category({ params, searchParams }: { params: Promise<{ categoryName: string }>, searchParams: Promise<{ page?: string, limit?: string }> }) {
    const { categoryName } = await params;
    let { page, limit } = await searchParams;

    if(!page || !limit){
        page = '1';
        limit = '10';
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const categoryArticles = await getCategoryArticles(categoryName, pageNumber, limitNumber);

    return (
        <div>
            <CategoryPage
                response={categoryArticles}
                page={pageNumber}
                limit={limitNumber}
                categorySlug={categoryName}
            />
        </div>
    );
}