// repositories
import {
    getAllCategories,
    insertCategory
} from "./categories.repositories";

// utils
import generateSlugConsistFromGivenString from "../../utils/generator/generateSlugConsistForGivenString";

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

export async function addCategoryService({name, description, isActive}: Categories): Promise<boolean> {
    try {
        const newCategory: Categories = {
            name,
            description,
            isActive
        };
        const newSlug = generateSlugConsistFromGivenString(newCategory.name as string);
        const newEntry: Categories = {
            name: newCategory.name,
            description: newCategory.description,
            slug: newSlug,
            isActive: newCategory.isActive
        };
        // check if there any category with the same name, if there is none, insert new value
        const insertedCategory: boolean = await insertCategory(newEntry); // return false if unique constraint violation
        if(!insertedCategory) return false;
        return true;
    } catch (error) {
        throw new Error(`Error adding category: ${error}`);
    }
}