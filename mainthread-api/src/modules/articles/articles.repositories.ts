import dbAccess from '../../config/database/createDbAccess'
import redis from '../../config/redis/createRedisAccess'

//types
import { ArticleQuery, Article } from './articles.types'

export async function createArticleReturnId({authorId}: {authorId: string}) : Promise<string>{
    try {
        const db = await dbAccess();
        const value : ArticleQuery = {
            title: '',
            slug: '',
            excerpt: null,
            content_html: '<p>I like reading manhwas, the last manhwa I read is kinda touching, one of the best romance manhwa i ever read</p>',
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
export async function getArticlesFirstPage({limit, category, status, asc}: {limit: number, category: string, status: string, asc: boolean}): Promise<ArticleQuery[]> {
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

        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}

// - next page
export async function getArticlesNextPage({cursor, limit, direction, category, status, asc}: {cursor: object, limit: number, direction: 'forward' | 'backward', category: string, status: string, asc: boolean}) {
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
            .gte('created_at', cursorNext.createdAt)
            .order('created_at', { ascending: asc })
        
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

        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}

// - previous page
export async function getArticlesPreviousPage({cursor, limit, direction, category, status}: {cursor: string, limit: number, direction: 'forward' | 'backward', category: string, status: string}) {
    try {
        const db = await dbAccess();
        // TODO: implement pagination back and forward with cursor implementation

        return []
    } catch (error) {
        console.error('Error getting articles:', error);
        throw error;
    }
}