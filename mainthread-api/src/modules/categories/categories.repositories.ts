import createDatabaseAccess from "../../config/database/createDbAccess";
// types
import {
    Categories,
    CategoriesQuery
} from "./categories.types";

export async function getAllCategories(): Promise<CategoriesQuery[]> {
    const db = await createDatabaseAccess();
    try {
        const {data: categories, error: categoriesError} = await db
            .from('categories')
            .select('id, name, slug, description, is_active');
            
        if(categoriesError) throw new Error(`Error fetching categories: ${categoriesError}`);
        return categories as CategoriesQuery[];
    } catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}