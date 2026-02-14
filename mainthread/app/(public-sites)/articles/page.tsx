import AllArticlePage from "@/features/public-sites/all-article/AllArticlePage";


import api from '@/libs/axiosInterceptor/axiosPublicInterceptor'
import {cache} from 'react';

import {Metadata} from 'next';

export async function generateMetadata({searchParams}: {searchParams: Promise<{page: string, limit?: string}>}): Promise<Metadata> {
    let { page = '1', limit = '10' } = await searchParams;
    if(!page || !limit){
        page = '1';
        limit = '12';
    }
    return {
        title: "MainThread Articles | Page " + page,
        description: "All Articles in MainThread News | Page " + page,
        robots: {
            index: page == '1'? true : false, // index only first page
            follow: true,
        },
    };
}

const getAllArticles = cache(async (page: number, limit?: number) => {
    const limitValue = limit || 10;
    const response = await api.get(`/api/public/get-all-articles?page=${page}&limit=${limitValue}`);
    return response.data;
})
export default async function AllArticles({searchParams}: {searchParams: Promise<{page: string, limit?: string}>}) {
    // TODO: implement ssr for all article page, config url first
    let page: number  = Number((await searchParams).page || 1); 
    let limit: number | undefined = Number((await searchParams).limit || 10);

    const articles = await getAllArticles(page, limit);

    return (
        <AllArticlePage response={articles} page={page} limit={limit || 1} />
    );
}