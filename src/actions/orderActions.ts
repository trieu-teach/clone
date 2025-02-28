'use server';

import { connectDB } from '@/lib/mongodb';
import OrderModel from "@/models/order";
import { OrderSchema, zOrderSchemaUdate } from '@/schemas/orderSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createOrder(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const orderData = OrderSchema.parse(rawData); // Zod validation

    await connectDB();
    await OrderModel.create(orderData);
    revalidatePath('/orders'); // Revalidate the order list page
    return { message: 'Order created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create order.' }; // Generic error message
  }
}

export async function updateOrder(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const orderData = zOrderSchemaUdate.parse(rawData);
        const { _id, ...updateData } = orderData;

        await connectDB();
        const updatedOrder = await OrderModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedOrder) {
            return { error: 'Order not found' };
        }
        revalidatePath('/orders'); // Or revalidate a specific order detail page
        revalidatePath(`/orders/${_id}`);
        return { message: 'Order updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update order.' };
    }
}

export async function deleteOrder(orderId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return { error: 'Order not found' };
    }

    revalidatePath('/orders');
    return { message: 'Order deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete order.' };
}
}
