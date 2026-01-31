import createDatabaseAccess from "../../config/database/createDbAccess";
import redis from "../../config/redis/createRedisAccess";
// types
import {
    Categories,
    CategoriesQuery
} from "./categories.types";

import { REDIS_KEY } from "../../const/const.redis";

export async function getAllCategories(): Promise<CategoriesQuery[]> {
    const db = await createDatabaseAccess();
    try {
        // check if categories are cached
        const cachedCategories = await redis.get(REDIS_KEY.CATEGORIES);
        if(cachedCategories) return cachedCategories as CategoriesQuery[];

        const {data: categories, error: categoriesError} = await db
            .from('categories')
            .select('id, name, slug, description, is_active');
            
        if(categoriesError) throw new Error(`Error fetching categories: ${categoriesError}`);

        await redis.set(REDIS_KEY.CATEGORIES, categories, { ex: 60 * 60 * 24 });
        return categories as CategoriesQuery[];
    } catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}

export async function insertCategory(category: Categories): Promise<boolean> {
    const db = await createDatabaseAccess();
    try {
        const {data: categoryData, error: categoryError} = await db
            .from('categories')
            .insert({
                name: category.name,
                slug: category.slug,
                description: category.description,
                is_active: category.isActive
            })

        if(categoryError) return false;

        // invalidate cache
        await redis.del(REDIS_KEY.CATEGORIES);
            
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateCategory({id, name, slug ,description, isActive}: Categories): Promise<boolean> {
    const db = await createDatabaseAccess();
    try {
        const {data: categoryData, error: categoryError} = await db
            .from('categories')
            .update({
                name: name,
                slug: slug,
                description: description,
                is_active: isActive
            })
            .eq('id', id);
        
        if(categoryError) return false;

        // invalidate cache
        await redis.del(REDIS_KEY.CATEGORIES);        
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteCategory({id}: Categories): Promise<boolean> {
    const db = await createDatabaseAccess();
    try {
        const {data: categoryData, error: categoryError} = await db
            .from('categories')
            .delete()
            .eq('id', id);
        
        if(categoryError) throw new Error(`Error deleting category: ${categoryError}`);

        // invalidate cache
        await redis.del(REDIS_KEY.CATEGORIES);        
        return true;
    } catch (error) {
        throw new Error(`Error deleting category: ${error}`);
    }
}