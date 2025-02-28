'use server';

import { connectDB } from '@/lib/mongodb';
import ProductModel from "@/models/product";
import { ProductSchema, zProductSchemaUdate } from '@/schemas/productSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createProduct(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const productData = ProductSchema.parse(rawData); // Zod validation

    await connectDB();
    await ProductModel.create(productData);
    revalidatePath('/products'); // Revalidate the product list page
    return { message: 'Product created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create product.' }; // Generic error message
  }
}

export async function updateProduct(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const productData = zProductSchemaUdate.parse(rawData);
        const { _id, ...updateData } = productData;

        await connectDB();
        const updatedProduct = await ProductModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedProduct) {
            return { error: 'Product not found' };
        }
        revalidatePath('/products'); // Or revalidate a specific product detail page
        revalidatePath(`/products/${_id}`);
        return { message: 'Product updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update product.' };
    }
}

export async function deleteProduct(productId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return { error: 'Product not found' };
    }

    revalidatePath('/products');
    return { message: 'Product deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete product.' };
}
}

