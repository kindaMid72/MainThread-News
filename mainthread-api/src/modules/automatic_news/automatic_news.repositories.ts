import redis from "../../config/redis/createRedisAccess";
import createDatabaseAccess from "../../config/database/createDbAccess";

// const & types
import { REDIS_KEY } from "../../const/const.redis";

// types
import { ArticleQuery } from "./automatic_news.types";

export async function getArticleCategory(): Promise<{ id: string, name: string, description: string }[]> {
    try {
        const supabase = await createDatabaseAccess();
        const { data: articleCategory, error } = await supabase.from('categories').select('id, name, description').eq('is_active', true);
        if (error) throw new Error('Internal server error');

        return articleCategory;
    } catch (error) {
        throw error;
    }
}

export async function uploadImage(image: Buffer, path: string, metadata: { name?: string, type?: string, size?: number, path?: string, article_id?: string }): Promise<string> {
    // TODO: implement image upload, create an access url for that image, return the url    
    // 
    const TEN_YEARS = 10 * 365 * 24 * 60 * 60;
    try {
        const db = await createDatabaseAccess();
        // upload image to supabase storage
        const { error } = await db.storage.from('images').upload(path, image, {
            contentType: metadata?.type || 'image/jpeg',
            upsert: false
        });
        if (error) {
            console.error('Error uploading image:', error);
            throw error;
        }

        // create iamge url

        const { data: imageUrl, error: urlError } = await db.storage.from('images').createSignedUrl(path, TEN_YEARS);
        if (urlError) {
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

        if (insertError) {
            console.error('Error inserting image:', insertError);
            throw insertError;
        }
        // return image url

        return finalUrl;

    } catch (error) {
        throw new Error('Error uploading image: ' + error);
    }
}

export async function storeArticleReturnId(article: { title: string, content: string, category: string, slug: string, thumbnail_url: string }): Promise<string> {
    try {
        const db = await createDatabaseAccess();
        const { data: insertedArticle, error: insertError } = await db
            .from('articles')
            .insert([
                {
                    title: article.title,
                    content_html: article.content,
                    category_id: article.category,
                    slug: article.slug,
                    thumbnail_url: article.thumbnail_url,
                    source_type: 'auto',
                    source_ref: 'generated_by_ai:Gemini',
                    view_count: 0,
                    is_breaking: false,
                    is_headline: false,
                    status: 'draft',
                    author_id: '970e5849-ff30-43ac-88b7-0562b9451de1'
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting article:', insertError);
            throw insertError;
        }
        // return article id
        return insertedArticle.id as ArticleQuery['id'];
    } catch (error) {
        throw new Error('Error storing article: ' + error);
    }
}