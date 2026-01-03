import {
    createArticleReturnId,
    getArticleById,
    getArticleTagsById,
    getArticlesFirstPage,
    getArticlesNextPage,
    getArticlesPreviousPage,
    updateArticle,
    updateArticleTags
} from "./articles.repositories";

// types
import { ArticleQuery, ArticleTag } from "./articles.types";

// utils
import extractIdFromToken from "../../utils/authTools/extracIdFromToken";
import { decodeBase64ToObject, encodeObjectToBase64 } from "../../utils/cryptoTools/codeSHA256";


export async function createArticleService(authorization: string): Promise<ArticleQuery> {
    const authorId: string = await extractIdFromToken(authorization) as string;
    if (!authorId) {
        throw new Error('Extract Id From Token Failed');
    }
    // console.log(authorId); // token exist
    const articleId = await createArticleReturnId({ authorId });
    return { id: articleId };
}

export async function getArticlesService({ cursor, limit, direction, category, status, asc, search }: { cursor: string | null, limit: number | null, direction: 'forward' | 'backward', category: string | null, status: string | null, asc: boolean | null, search?: string })
    : Promise<{ articles: ArticleQuery[], cursor: string, hasPrev: boolean, hasNext: boolean }> {

    // given cursor(needs to be decoded), limit, direction, category, status
    // return articles, {nextCursor, prevCursor, hasPrev, hasNext}(encoded)

    // determine if the request is first page, next page, or previous page

    search = search?.trim();

    // console.log(cursor, limit, direction, category, status, asc);
    if (!cursor) {
        // first page
        let queryResult: ArticleQuery[] = await getArticlesFirstPage({ limit: limit as number, category: category as string, status: status as string, asc: asc as boolean, search: search as string });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length >= (limit || 0);
        const hasPrev = false;
        if(hasNext){
            queryResult.pop();
        }

        // create next cursor and prev cursor
        const nextCursor = hasNext ? {id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 1].created_at} : null;
        const prevCursor = null;

        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        }
        const cursorEncoded: string = encodeObjectToBase64(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };

    } else if (direction === 'forward') {
        // next page
        const cursorDecoded: any = decodeBase64ToObject(cursor);
        const queryResult: ArticleQuery[] = await getArticlesNextPage({ cursor: cursorDecoded.nextCursor, limit: limit as number, direction: direction as 'forward', category: category as string, status: status as string, asc: asc as boolean });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length === (limit as number) + 1;
        const hasPrev = true;
        const nextCursor = hasNext ? {id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 2].created_at} : null;
        const prevCursor = {id: queryResult[0].id, createdAt: queryResult[0].created_at};
        if(hasNext){
            queryResult.pop();
        }

        // create next cursor and prev cursor

        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        }
        const cursorEncoded: string = encodeObjectToBase64(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };
    } else if (direction === 'backward') {
        // previous page
        const cursorDecoded: any = decodeBase64ToObject(cursor);
        const queryResult: any[] = await getArticlesPreviousPage({ cursor: cursorDecoded.prevCursor, limit: limit as number, direction: direction as 'backward', category: category as string, status: status as string, asc: asc as boolean });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = true;
        const hasPrev = queryResult.length === (limit as number) + 1;

        if(hasPrev){
            queryResult.shift();
        }
        // create next cursor and prev cursor
        const nextCursor = hasNext ? { id: queryResult[queryResult.length - 1].id, createdAt: queryResult[queryResult.length - 1].created_at } : null;
        const prevCursor = hasPrev ? { id: queryResult[0].id, createdAt: queryResult[0].created_at } : null;

        const newCursor = {
            nextCursor,
            prevCursor,
            hasPrev,
            hasNext
        }
        const cursorEncoded: string = encodeObjectToBase64(newCursor);
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };
    } else {
        throw new Error('Invalid direction');
    }

}


export async function getArticleService(id: string): Promise<{article: ArticleQuery, articleTags: ArticleTag[] }> {

    // get article by id
    const article = await getArticleById(id);

    // get article & tags relation by id, return related tags id
    const articleTags = await getArticleTagsById(id);

    return { article, articleTags };
}

export async function updateArticleService(id: string, updates: Partial<ArticleQuery>, tagIds?: string[]): Promise<void> {

    // update article
    if(Object.keys(updates).length > 0){
        await updateArticle(id, updates);
    }

    // update tags if provided, perform update on article_tags table
    if(tagIds){
        await updateArticleTags(id, tagIds);
    }
}