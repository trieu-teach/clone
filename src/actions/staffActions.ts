'use server';

import { connectDB } from '@/lib/mongodb';
import StaffModel from "@/models/staff";
import { StaffSchema, zStaffSchemaUdate } from '@/schemas/staffSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function createStaff(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const staffData = StaffSchema.parse(rawData); // Zod validation

    await connectDB();
    await StaffModel.create(staffData);
    revalidatePath('/staffs'); // Revalidate the staff list page
    return { message: 'Staff created successfully!' };
  } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.flatten() };
      }
      return { error: 'Failed to create staff.' }; // Generic error message
  }
}

export async function updateStaff(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const staffData = zStaffSchemaUdate.parse(rawData);
        const { _id, ...updateData } = staffData;

        await connectDB();
        const updatedStaff = await StaffModel.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedStaff) {
            return { error: 'Staff not found' };
        }
        revalidatePath('/staffs'); // Or revalidate a specific staff detail page
        revalidatePath(`/staffs/${_id}`);
        return { message: 'Staff updated successfully!' };
    } catch (error) {
        if (error instanceof ZodError) {
           return { error: error.flatten() };
        }
        return { error: 'Failed to update staff.' };
    }
}

export async function deleteStaff(staffId: string) { // Note: Pass ID directly
  try {
    await connectDB();
    const deletedStaff = await StaffModel.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return { error: 'Staff not found' };
    }

    revalidatePath('/staffs');
    return { message: 'Staff deleted successfully!' };
} catch (error) {
  return { error: 'Failed to delete staff.' };
}
}
