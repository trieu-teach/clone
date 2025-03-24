'use server';

import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";
import { CustomerSchema, zCustomerSchemaUdate } from '@/schemas/customerSchema';
import { ActionReturn } from '@next-server-actions/types';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

export const register = async (prevState: any, formData: FormData): Promise<ActionReturn> => {
  try {
    const rawData = Object.fromEntries(formData);
    // type convertion
    const convertedData = {
      ...rawData,
      address: [{
        provinceId: rawData.provinceId,
        districtId: rawData.districtId,
        communeId: rawData.communeId,
        default:true,
        detail: rawData.detail,
      }],
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const customerData = CustomerSchema.parse(convertedData);
    await connectDB();
    const userFound = await CustomerModel.findOne({ email: customerData.email });
    if (userFound) {
      return { message: "Email đã đăng kí!", success: false, formData }
    }
    customerData.password = await bcrypt.hash(customerData.password, 10);
    await CustomerModel.create(customerData);
    // redirect("/");
    return { message: "Đăng kí thành công!", success: true, formData }
  } catch (error) {
    console.log("error instanceof ZodError:",error instanceof ZodError,error);
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
    return { message: "Đăng kí thất bại.", success: false, formData };
  }
}