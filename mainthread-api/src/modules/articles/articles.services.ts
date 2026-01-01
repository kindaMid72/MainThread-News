import { createArticleReturnId } from "./articles.repositories";

// types
import { ArticleQuery, Article } from "./articles.types";

// utils
import extractIdFromToken from "../../utils/authTools/extracIdFromToken";


export async function createArticleService(authorization: string): Promise<ArticleQuery> {
    const authorId: string = await extractIdFromToken(authorization) as string;
    if(!authorId){
        throw new Error('Extract Id From Token Failed');
    }
    // console.log(authorId); // token exist
    const articleId = await createArticleReturnId({authorId});
    return { id: articleId };
}