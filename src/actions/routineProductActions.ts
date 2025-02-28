'use server';

import { connectDB } from '@/lib/mongodb';
import RoutineProductModel from "@/models/routineProduct";
import { RoutineProductSchema, zRoutineProductSchemaUdate } from '@/schemas/routineProductSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createRoutineProduct(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const routineProductData = RoutineProductSchema.parse(rawData); // Zod validation

    await connectDB();
    await RoutineProductModel.create(routineProductData);
    revalidatePath('/routineProducts'); // Revalidate the routineProduct list page
    return { message: 'Routine product created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create routine product.' }; // Generic error message
  }
}

export async function updateRoutineProduct(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const routineProductData = zRoutineProductSchemaUdate.parse(rawData);
        const { _id, ...updateData } = routineProductData;

        await connectDB();
        const updatedRoutineProduct = await RoutineProductModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedRoutineProduct) {
            return { error: 'Routine product not found' };
        }
        revalidatePath('/routineProducts'); // Or revalidate a specific routineProduct detail page
        revalidatePath(`/routineProducts/${_id}`);
        return { message: 'Routine product updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update routine product.' };
    }
}

export async function deleteRoutineProduct(routineProductId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedRoutineProduct = await RoutineProductModel.findByIdAndDelete(routineProductId);

    if (!deletedRoutineProduct) {
      return { error: 'Routine product not found' };
    }

    revalidatePath('/routineProducts');
    return { message: 'Routine product deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete routine product.' };
}
}
