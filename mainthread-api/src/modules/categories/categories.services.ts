// repositories
import {
    getAllCategories,
    insertCategory,
    updateCategory,
    deleteCategory
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

export async function updateCategoryService({id, name, description, isActive}:  Categories): Promise<boolean> {
    try {
        // create slug
        const slug = generateSlugConsistFromGivenString(name as string);
        const updatedCategory: Categories = {
            id,
            name,
            slug,
            description,
            isActive
        };
        const updateResult: boolean = await updateCategory(updatedCategory);   
        if(!updateResult) return false;
        return true;
    } catch (error) {
        throw new Error(`Error updating category: ${error}`);
    }
}

export async function deleteCategoryService({id}: Categories){
    try {
        const deleteResult: boolean = await deleteCategory({id});   
        if(!deleteResult) return false;
        return true;
    } catch (error) {
        throw new Error(`Error deleting category: ${error}`);
    }
}