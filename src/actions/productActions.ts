'use server';

import { connectDB } from '@/lib/mongodb';
import ProductModel from "@/models/product";
import { ProductSchema, zProductSchemaUdate } from '@/schemas/productSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

const createProduct = async (prevState: any, formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData);
    const productData = ProductSchema.parse(rawData);
    await connectDB();
    await ProductModel.create(productData);
    revalidatePath('/product/product-manament');
    return { message: 'Product created successfully!', success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.flatten().fieldErrors);
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
    return { message: "Failed to create product.", success: false, formData };
  }
}
const updateProduct = async ( formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const productData = zProductSchemaUdate.parse(rawData);
    const { _id, ...updateData } = productData;

    await connectDB();
    const updatedProduct = await ProductModel.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedProduct) {
      return { error: 'Product not found', success: false };
    }
    revalidatePath('/product/product-manament');
    return { message: 'Product updated successfully!', success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.flatten(), success: false };
    }
    return { error: 'Failed to update product.', success: false };
  }
}

const toggleActiveStatus = async (productId: string) => {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId);
    if (!product) {
      return { error: 'Product not found', success: false };
    }
    product.is_active = !product.is_active;
    await product.save();
    revalidatePath('/product/product-manament');
    return { message: 'Product status updated successfully!', success: true };
  } catch (error) {
    return { error: 'Failed to update product status.', success: false };
  }
}

const deleteProduct = async (productId: string) => {
  try {
    await connectDB();
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return { error: 'Product not found', success: false };
    }
    revalidatePath('/product/product-manament');
    return { message: 'Product deleted successfully!', success: true };
  } catch (error) {
    return { error: 'Failed to delete product.', success: false };
  }
}

export { createProduct, updateProduct, toggleActiveStatus, deleteProduct }