'use server';

import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";
import { CustomerSchema, zCustomerSchemaUdate } from '@/schemas/customerSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createCustomer(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const customerData = CustomerSchema.parse(rawData); // Zod validation

    await connectDB();
    await CustomerModel.create(customerData);
    revalidatePath('/customers'); // Revalidate the customer list page
    return { message: 'Customer created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create customer.' }; // Generic error message
  }
}

export async function updateCustomer(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const customerData = zCustomerSchemaUdate.parse(rawData);
        const { _id, ...updateData } = customerData;

        await connectDB();
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedCustomer) {
            return { error: 'Customer not found' };
        }
        revalidatePath('/customers'); // Or revalidate a specific customer detail page
        revalidatePath(`/customers/${_id}`);
        return { message: 'Customer updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update customer.' };
    }
}

export async function deleteCustomer(customerId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedCustomer = await CustomerModel.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return { error: 'Customer not found' };
    }

    revalidatePath('/customers');
    return { message: 'Customer deleted successfully!' };
  } catch (error) {
    return { error: 'Failed to delete customer.' };
  }
}