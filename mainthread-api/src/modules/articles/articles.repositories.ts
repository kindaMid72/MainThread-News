import dbAccess from '../../config/database/createDbAccess'
import redis from '../../config/redis/createRedisAccess'

//types
import { ArticleQuery, Article, ArticleImage } from './articles.types';
import { TagQuery, Tag } from '../tags/tags.types';

import {REDIS_KEY} from '../../const/const.redis'

// utils
import generateRandomToken from '../../utils/generator/generateRandomToken';

export async function createArticleReturnId({authorId}: {authorId: string}) : Promise<string>{
    try {
        const db = await dbAccess();
        const value : ArticleQuery = {
            title: '',
            slug: await generateRandomToken(),
            excerpt: null,
            content_html: '<p></p>',
            thumbnail_url: '',
            category_id: null,
            author_id: authorId,
            status: 'draft',
            source_type: 'manual',
            source_ref: '',
            view_count: 0,
            is_breaking: false,
            is_headline: false,
            published_at: null,
            updated_at: new Date().toISOString(),

        }
        const {data: article, error} = await db
            .from('articles')
            .insert(
                value
            )
            .select()
            .single();

        if (error) {
            console.error('Error creating article:', error);
            throw error;
        }

        return article.id;
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
}

// pagination cursor
// - first page
export async function getArticlesFirstPage({limit, category, status, asc, search}: {limit: number, category: string, status: string, asc: boolean, search?: string}): Promise<ArticleQuery[]> {
    try {
        const db = await dbAccess();
        // TODO: implement pagination back and forward with cursor implementation

        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;

        // query string
        let additionalCondition = [];

        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: asc })

        if (statusCondition !== '') {
            additionalCondition.push(statusCondition);
        }

        if(categoryCondition !== ''){
            additionalCondition.push(categoryCondition);
        }

        if(search != '' && search != null){
            query = query.or(`title.ilike.%${search}%`);
        }

        if(additionalCondition.length > 0){
            query = query.or(additionalCondition.join(','));
        }
        const {data: articles, error} = await query;

        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }

        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}

// - next page
export async function getArticlesNextPage({cursor, limit, direction, category, status, asc, search}: {cursor: object, limit: number, direction: 'forward' | 'backward', category: string, status: string, asc: boolean, search?: string}) {
    try {
        const db = await dbAccess();

        // cursorNext: {id, createdAt}
        const cursorNext = cursor as {id: string, createdAt: string};

        // TODO: implement pagination back and forward with cursor implementation
        if(direction !== 'forward'){
            throw new Error('Invalid direction');
        }

        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;

        // query string
        let additionalCondition = [];

        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: asc })

        if(search != '' && search != null){
            query = query.or(`title.ilike.%${search}%`);
        }

        // determine operator based on sort direction
        if (asc) {
            // Oldest first: next page means newer items (> cursor)
            query = query.gt('created_at', cursorNext.createdAt);
        } else {
            // Newest first: next page means older items (< cursor)
            query = query.lt('created_at', cursorNext.createdAt);
        }

        if (statusCondition !== '') {
            additionalCondition.push(statusCondition);
        }

        if (categoryCondition !== '') {
            additionalCondition.push(categoryCondition);
        }

        if (additionalCondition.length > 0) {
            query = query.or(additionalCondition.join(','));
        }
        const { data: articles, error } = await query;

        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }

        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}

// - previous page
export async function getArticlesPreviousPage({cursor, limit, direction, category, status, asc, search}: {cursor: object, limit: number, direction: 'forward' | 'backward', category: string, status: string, asc: boolean, search?: string}) {
    try {
        const db = await dbAccess();
        const cursorPrev = cursor as {id: string, createdAt: string};

        if(direction !== 'backward'){
            throw new Error('Invalid direction');
        }

        const statusCondition = status === 'all' || !status ? '' : `status.eq.${status}`;
        const categoryCondition = category === 'all' || !category ? '' : `category_id.eq.${category}`;

        // query string
        let additionalCondition = [];

        let query = db
            .from('articles')
            .select()
            .limit(limit + 1)
            .order('created_at', { ascending: !asc }) // Always reverse sort to get nearest neighbors first

        // determine operator based on sort direction
        if (asc) {
            // Oldest first: prev page means older items (< cursor)
            query = query.lt('created_at', cursorPrev.createdAt);
        } else {
            // Newest first: prev page means newer items (> cursor)
            query = query.gt('created_at', cursorPrev.createdAt);
        }

        if(search != '' && search != null){
            query = query.or(`title.ilike.%${search}%`);
        }

        if(statusCondition !== ''){
            additionalCondition.push(statusCondition);
        }

        if(categoryCondition !== ''){
            additionalCondition.push(categoryCondition);
        }

        if(additionalCondition.length > 0){
            query = query.or(additionalCondition.join(','));
        }
        const {data: articles, error} = await query;

        if (error) {
            console.error('Error getting articles:', error);
            throw error;
        }

        // Always reverse the result because we fetched in reverse order
        articles.reverse();

        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}

export async function getArticleById(id: string): Promise<ArticleQuery> {
    try {

        // check redis cache
        const cachedArticle = await redis.get(REDIS_KEY.ARTICLES(id));
        if (cachedArticle) {
            return cachedArticle;
        }

        const db = await dbAccess();
        const {data: article, error} = await db
            .from('articles')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error getting article:', error);
            throw error;
        }

        // set cache
        await redis.set(REDIS_KEY.ARTICLES(id), article);

        return article;
    } catch (error) {
        console.error('Error getting article:', error);
        throw error;
    }
}

export async function getArticleTagsById(id: string): Promise<TagQuery[]> {
    try {
        // check redis cache
        const cachedArticleTags = await redis.get(REDIS_KEY.ARTICLES_TAGS(id));
        if (cachedArticleTags) {
            return cachedArticleTags as TagQuery[];
        }

        const db = await dbAccess();
        const {data: articleTags, error} = await db
            .from('article_tags')
            .select('tag_id')
            .eq('article_id', id);

        if (error) {
            console.error('Error getting article tags:', error);
            throw error;
        }

        // set cache
        await redis.set(REDIS_KEY.ARTICLES_TAGS(id), articleTags);

        return articleTags as TagQuery[];
    } catch (error) {
        console.error('Error getting article tags:', error);
        throw error;
    }
}

export async function updateArticle(id: string, updates: Partial<ArticleQuery>): Promise<void> {
    try {
        const db = await dbAccess();
        const { error } = await db
            .from('articles')
            .update({
                ...updates,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if(updates.slug){ // invalidate cache for slug
            await redis.del(REDIS_KEY.ARTICLES(updates.slug));
        }

        if (error) {
            console.error('Error updating article:', error);
            throw error;
        }

        // Invalidate cache
        await redis.del(REDIS_KEY.ARTICLES(id));
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
}

export async function updateArticleTags(articleId: string, tagIds: string[]): Promise<void> {
    try {
        const db = await dbAccess();

        // 1. Delete existing tags for this article
        const {error: deleteError} = await db
            .from('article_tags')
            .delete()
            .eq('article_id', articleId);

        if (deleteError) {
            console.error('Error deleting old article tags:', deleteError);
            throw deleteError;
        }

        // 2. Insert new tags, if there are any to add, if its empty, do nothing
        if (tagIds.length > 0) {
            const newTags = tagIds.map(tagId => ({
                article_id: articleId,
                tag_id: tagId
            }));

            const { error: insertError } = await db
                .from('article_tags')
                .insert([
                    ...newTags.map(tags=> ({
                        article_id: articleId,
                        tag_id: tags.tag_id
                    }))
                ])

            if (insertError) {
                console.error('Error inserting new article tags:', insertError);
                throw insertError;
            }
        }

        // Invalidate cache
        await redis.del(REDIS_KEY.ARTICLES_TAGS(articleId));
    } catch (error) {
        console.error('Error updating article tags:', error);
        throw error;
    }
}

export async function deleteArticle(id: string): Promise<void> {
    try {
        const db = await dbAccess();

        // 1. Delete article tags (foreign key might handle this with CASCADE, but manual is safer/explicit)
        const { error: tagsError } = await db
            .from('article_tags')
            .delete()
            .eq('article_id', id);

        if(tagsError){
            console.error('Error deleting article tags:', tagsError);
            throw tagsError;
        }

        // 2. Delete article
        const { data: deletedArticles, error: articleError } = await db
            .from('articles')
            .delete()
            .eq('id', id)
            .select();

        if(deletedArticles){ // invalidate public slug
            await redis.del(REDIS_KEY.ARTICLES(deletedArticles[0].slug));
        }

        if(articleError){
            console.error('Error deleting article:', articleError);
            throw articleError;
        }

        // Invalidate cache
        await redis.del(REDIS_KEY.ARTICLES(id));
        await redis.del(REDIS_KEY.ARTICLES_TAGS(id));

    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}

export async function uploadImage(image: Buffer, path: string, metadata: {name?: string, type?: string, size?: number, path?: string, article_id?: string}): Promise<string> {
    // TODO: implement image upload, create an access url for that image, return the url    
    // 
    const TEN_YEARS = 10 * 365 * 24 * 60 * 60;
    try{
        const db = await dbAccess();
        // upload image to supabase storage
        const {error} = await db.storage.from('images').upload(path, image, {
            contentType: metadata?.type || 'image/jpeg',    
            upsert: false
        });
        if(error){
            console.error('Error uploading image:', error);
            throw error;
        }
        
        // create iamge url

        const {data: imageUrl, error: urlError} = await db.storage.from('images').createSignedUrl(path, TEN_YEARS);
        if(urlError){
            console.error('Error creating image url:', urlError);
            throw urlError;
        }

        const finalUrl = imageUrl?.signedUrl as string;
        
        // insert image url & metadata to media_images
            const { data: insertedImage, error: insertError } = await db
                .from('media_images')
                .insert([
                    {
                        image_url: finalUrl,
                        metadata: metadata,
                        article_id: metadata.article_id
                    }
                ])
                .select()
                .single();

        if(insertError){
            console.error('Error inserting image:', insertError);
            throw insertError;
        }
        // return image url
    
        return finalUrl;

    }catch(error){
        throw new Error('Error uploading image: ' + error);
    }
}
