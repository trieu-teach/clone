'use server';

import { connectDB } from '@/lib/mongodb';
import CategoryModel from "@/models/category";
import { CategorySchema, zCategorySchemaUdate } from '@/schemas/categorySchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createCategory(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const categoryData = CategorySchema.parse(rawData); // Zod validation

    await connectDB();
    await CategoryModel.create(categoryData);
    revalidatePath('/categories'); // Revalidate the category list page
    return { message: 'Category created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create category.' }; // Generic error message
  }
}

export async function updateCategory(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const categoryData = zCategorySchemaUdate.parse(rawData);
        const { _id, ...updateData } = categoryData;

        await connectDB();
        const updatedCategory = await CategoryModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedCategory) {
            return { error: 'Category not found' };
        }
        revalidatePath('/categories'); // Or revalidate a specific category detail page
        revalidatePath(`/categories/${_id}`);
        return { message: 'Category updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update category.' };
    }
}

export async function deleteCategory(categoryId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return { error: 'Category not found' };
    }

    revalidatePath('/categories');
    return { message: 'Category deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete category.' };
}
}
