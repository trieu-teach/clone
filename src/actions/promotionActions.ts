'use server';

import { connectDB } from '@/lib/mongodb';
import PromotionModel from "@/models/promotion";
import { PromotionSchema, zPromotionSchemaUdate } from '@/schemas/promotionSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createPromotion(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const promotionData = PromotionSchema.parse(rawData); // Zod validation

    await connectDB();
    await PromotionModel.create(promotionData);
    revalidatePath('/promotions'); // Revalidate the promotion list page
    return { message: 'Promotion created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create promotion.' }; // Generic error message
  }
}

export async function updatePromotion(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const promotionData = zPromotionSchemaUdate.parse(rawData);
        const { _id, ...updateData } = promotionData;

        await connectDB();
        const updatedPromotion = await PromotionModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedPromotion) {
            return { error: 'Promotion not found' };
        }
        revalidatePath('/promotions'); // Or revalidate a specific promotion detail page
        revalidatePath(`/promotions/${_id}`);
        return { message: 'Promotion updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update promotion.' };
    }
}

export async function deletePromotion(promotionId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedPromotion = await PromotionModel.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return { error: 'Promotion not found' };
    }

    revalidatePath('/promotions');
    return { message: 'Promotion deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete promotion.' };
}
}
