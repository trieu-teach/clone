'use server';

import { connectDB } from '@/lib/mongodb';
import { ActionReturn } from '@next-server-actions/types';
import CategoryModel from "@/models/category";
import { CategorySchema, zCategorySchemaUdate } from '@/schemas/categorySchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createCategory(prevState: any, formData: FormData):Promise<ActionReturn> {
  try {
    const rawData = Object.fromEntries(formData);
    const categoryData = CategorySchema.parse(rawData);
    console.log(categoryData);
    await connectDB();
    const createdCategory = await CategoryModel.create(categoryData);
    const categoryId = createdCategory._id.toString();
    formData.append('categoryId', categoryId);
    revalidatePath('/categories');

    return { message: 'Category created successfully!', success: true, formData: formData }; //!!!!
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenedError = error.flatten().fieldErrors;
      const firstErrorKey = Object.keys(flattenedError)[0]; // Get the first key

      if (firstErrorKey) {
        const firstErrorMessage = flattenedError[firstErrorKey]?.[0];
        if (firstErrorMessage) {
          return {
            message: `${firstErrorKey}: ${firstErrorMessage}`,
            success: false,
            formData,
          };
        }
      }
      return { message: "Validation error occurred.", success: false, formData }; //fallback message
    }
    return { message: "Failed to create category.", success: false, formData };


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
