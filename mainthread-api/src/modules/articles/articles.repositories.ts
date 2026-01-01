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