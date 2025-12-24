import createDatabaseAccess from "../../config/database/createDbAccess";
import redis from "../../config/redis/createRedisAccess";

// types
import { Tag, TagQuery } from "./tags.types";

// const
import { REDIS_KEY } from "../../const/const.redis";


export async function getAllTags(): Promise<TagQuery[]> {
    try {
        const db = await createDatabaseAccess();
        // check cache first
        const cachedTags: TagQuery[] | null = await redis.get(REDIS_KEY.TAGS);

        
        if (cachedTags) return cachedTags;

        const {data: tags, error: tagsError} = await db.from('tags').select('id, name, slug');

        if (tagsError) throw new Error(tagsError.message);

        await redis.set(REDIS_KEY.TAGS, tags);

        return tags;
    } catch (error) {
        throw error;
    }
}

export async function addNewTag({name, slug}: TagQuery): Promise<boolean> {
    try {
        const db = await createDatabaseAccess();
        const {error: tagError} = await db.from('tags').insert({name, slug});

        if (tagError) return false;

        // clear cache
        await redis.del(REDIS_KEY.TAGS);

        return true;
    } catch (error) {
        throw error;
    }
}