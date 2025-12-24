// repositories
import { getAllTags, addNewTag, updateTag, deleteTag } from "./tags.repositories";

// types
import { TagQuery, Tag } from "./tags.types";

// const
import { REDIS_KEY } from "../../const/const.redis";

// utils
import slugifyConsist from "../../utils/generator/generateSlugConsistForGivenString";

export async function getAllTagsService(): Promise<TagQuery[]> {
    try {
        const cachedTags: TagQuery[] | null = await getAllTags();
        if (cachedTags) return cachedTags;
        return await getAllTags();
    } catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}

export async function addNewTagService({name}: TagQuery): Promise<boolean> {
    try {
        const slug = slugifyConsist(name as string);
        return await addNewTag({name, slug});
    } catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}

export async function updateTagService({id, name}: TagQuery): Promise<boolean> {
    try {
        const slug = slugifyConsist(name as string);
        return await updateTag({id, name, slug});
    } catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}

export async function deleteTagService({id}: TagQuery): Promise<boolean> {
    try {
        return await deleteTag({id});
    } catch (error) {
        throw new Error(`Internal Server Error: ${error}`);
    }
}