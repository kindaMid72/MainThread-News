import { createArticleReturnId, getArticlesFirstPage, getArticlesNextPage, getArticlesPreviousPage } from "./articles.repositories";

// types
import { ArticleQuery } from "./articles.types";

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

export async function getArticlesService({ cursor, limit, direction, category, status, asc }: { cursor: string | null, limit: number | null, direction: 'forward' | 'backward', category: string | null, status: string | null, asc: boolean | null })
    : Promise<{ articles: ArticleQuery[], cursor: string, hasPrev: boolean, hasNext: boolean }> {

    // given cursor(needs to be decoded), limit, direction, category, status
    // return articles, {nextCursor, prevCursor, hasPrev, hasNext}(encoded)

    // determine if the request is first page, next page, or previous page
    if (!cursor) {
        // first page
        let queryResult: ArticleQuery[] = await getArticlesFirstPage({ limit: limit as number, category: category as string, status: status as string, asc: asc as boolean });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length >= (limit || 0);
        const hasPrev = false;

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
        queryResult.pop();
        return { articles: queryResult, cursor: cursorEncoded, hasNext, hasPrev };

    } else if (direction === 'forward') {
        // next page
        const cursorDecoded: any = decodeBase64ToObject(cursor);
        const queryResult: ArticleQuery[] = await getArticlesNextPage({ cursor: cursorDecoded.nextCursor, limit: limit as number, direction: direction as 'forward', category: category as string, status: status as string, asc: asc as boolean });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = queryResult.length === limit;
        const hasPrev = true;

        // create next cursor and prev cursor
        const nextCursor = hasNext ? queryResult[queryResult.length - 1].id : null;
        const prevCursor = cursorDecoded.prevCursor || null;

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
        const queryResult: any[] = await getArticlesPreviousPage({ cursor: cursor as string, limit: limit as number, direction: direction as 'backward', category: category as string, status: status as string });

        // assign hasNext and hasPrev based on queryResult
        const hasNext = true;
        const hasPrev = queryResult.length === limit;
    } else {
        throw new Error('Invalid direction');
    }

    // return response, this is place holder
    return { articles: [], cursor: '', hasPrev: false, hasNext: false };

}
