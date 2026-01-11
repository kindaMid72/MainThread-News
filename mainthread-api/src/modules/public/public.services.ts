
// types
import { ArticleQuery } from "./public.types";

// repositories
import { getAllArticles, getArticleContent, getCategoriesArticles, getMainPageContent } from "./public.repositories";

export async function getMainPageContentService(): Promise<{ latestNews: ArticleQuery[], headline: ArticleQuery[], breakingNews: ArticleQuery[], categories: any[] } | undefined> {
    try {
        /**
         1. latest news (right top): fetch 5 latest published articles, 
         - view all: open all article
         2. headline(middle top): show latest headline (just one)
         3. breaking news(left top): fetch 2 breaking news 
         4. categories: fetch 5 for each category
         */

        let { latestNews, headline, breakingNews, categories }: { latestNews: ArticleQuery[], headline: ArticleQuery[], breakingNews: ArticleQuery[], categories: any[] } = await getMainPageContent();

        // TODO: config author id name (change to author_id to its name), edit select to exclude content_html
        // FIXME: fix date format (why its acting that way)

        // fetch categories articles
        const categoriesArticles = await Promise.all(categories.map((category) => getCategoriesArticles(category.id)));

        // concat categories articles
        categories.forEach((category, index) => {
            category.articles = categoriesArticles[index];
        });

        return {
            latestNews,
            headline,
            breakingNews,
            categories
        }
    } catch (error) {
        console.log('error from public service getMainPageContent: ', error);
    }
}

export async function getArticleContentService(slug: string): Promise<ArticleQuery | undefined> {
    try {
        const article = await getArticleContent(slug);
        return article as ArticleQuery;
    } catch (error) {
        console.log('error from public service getArticleContent: ', error);
    }
}

export async function getCategoryArticlesService(categoryId: string) {
    try {
        const articles = await getCategoriesArticles(categoryId);
        return articles;
    } catch (error) {
        console.log('error from public service getCategoryArticlesService: ', error);
        throw error;
    }
}

export async function getAllArticlesService(page: number, limit: number) {
    try {
        const { articles, count } = await getAllArticles(page, limit);
        return { articles, count };
    } catch (error) {
        console.log('error from public service getAllArticlesService: ', error);
        throw error;
    }
}

export async function getAllCategoriesService(page: number, limit: number, category_slug?: string) {
    try {
        if(category_slug) {
            const { articles, count } = await getAllArticles(page, limit, category_slug);
            return { articles, count };
        }
        const { articles, count } = await getAllArticles(page, limit);
        return { articles, count };
    } catch (error) {
        console.log('error from public service getAllCategoriesService: ', error);
        throw error;
    }
}