
import api from '@/libs/axiosInterceptor/axiosPublicInterceptor'

// page
import SpecificArticlePage from '@/features/public-sites/Articles/SpecificArticlePage'

import {cache} from 'react';

interface Props {
    params: Promise<{articleSlug: string}>;
}

// metadata ssr
const getArticle = cache(async (slug: string) => {
    const articleResponse = await api.get(`/api/public/get-article-content/${slug}`);
    return articleResponse.data;
});


export async function generateMetadata({params}: any) {
    const slug = (await params).articleSlug;

    const article = await getArticle(slug);

    return {
        title: article.title,
        description: article.title,
        robots: {
            index: true,
            follow: false,
        },
    }
}

export default async function ArticlePage({params}: Props) {
    const slug = (await params).articleSlug;

    const article = await getArticle(slug);

    let relatedArticles = [];
    if (article.category_id) { // TODO: do later
        const relatedArticlesResponse = await api.get(`/api/public/get-category-articles/${article.category_id}`);
        // filter out the current article
        relatedArticles = relatedArticlesResponse.data.filter((item: any) => item.id !== article.id);
    }

    return (
        <SpecificArticlePage article={article} relatedArticles={relatedArticles} />
    );
}