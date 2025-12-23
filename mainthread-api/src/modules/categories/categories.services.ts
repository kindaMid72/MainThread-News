// repositories
import {
    getAllCategories
} from "./categories.repositories";

// types
import {
    Categories,
    CategoriesQuery
} from "./categories.types";

export async function getAllCategoriesService(): Promise<CategoriesQuery[]> {
    try {
        const categories: CategoriesQuery[] = await getAllCategories();
        return categories;
    } catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}