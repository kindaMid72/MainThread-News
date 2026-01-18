import AllArticlePage from "@/features/public-sites/all-article/AllArticlePage";


import api from '@/libs/axiosInterceptor/axiosPublicInterceptor'
import {cache} from 'react';

export const metadata = {
    title: "MainThread Articles",
    description: "All Articles in MainThread News",
}

const getAllArticles = cache(async (page: number, limit?: number) => {
    const limitValue = limit || 10;
    const response = await api.get(`/api/public/get-all-articles?page=${page}&limit=${limitValue}`);
    return response.data;
})
export default async function AllArticles({searchParams}: {searchParams: Promise<{page: string, limit?: string}>}) {
    // TODO: implement ssr for all article page, config url first
    const page: number = Number((await searchParams).page); // FIXME: ini undefined
    const limit: number | undefined = Number((await searchParams).limit);

    const articles = await getAllArticles(page, limit);

    return (
        <AllArticlePage response={articles} page={page} limit={limit || 1} />
    );
}