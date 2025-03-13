'use server';

import { connectDB } from '@/lib/mongodb';
import StaffModel from "@/models/staff";
import { StaffSchema, zStaffSchemaUdate } from '@/schemas/staffSchema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

const createStaff = async (prevState: any, formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData);
    const staffData = StaffSchema.parse(rawData);
    await connectDB();
    await StaffModel.create(staffData);
    revalidatePath('/staff/staff-manament');
    return { message: 'Staff created successfully!', success: true };
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
    return { message: "Failed to create staff.", success: false, formData };
  }
}
const updateStaff = async ( formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const staffData = zStaffSchemaUdate.parse(rawData);
    const { _id, ...updateData } = staffData;

    await connectDB();
    const updatedStaff = await StaffModel.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedStaff) {
      return { error: 'Staff not found', success: false };
    }
    revalidatePath('/staff/staff-manament');
    return { message: 'Staff updated successfully!', success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.flatten(), success: false };
    }
    return { error: 'Failed to update staff.', success: false };
  }
}

const toggleActiveStatus = async (staffId: string) => {
  try {
    await connectDB();
    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      return { error: 'Staff not found', success: false };
    }
    staff.is_active = !staff.is_active;
    await staff.save();
    revalidatePath('/staff/staff-manament');
    return { message: 'Staff status updated successfully!', success: true };
  } catch (error) {
    return { error: 'Failed to update staff status.', success: false };
  }
}

const deleteStaff = async (staffId: string) => {
  try {
    await connectDB();
    const deletedStaff = await StaffModel.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return { error: 'Staff not found', success: false };
    }
    revalidatePath('/staff/staff-manament');
    return { message: 'Staff deleted successfully!', success: true };
  } catch (error) {
    return { error: 'Failed to delete staff.', success: false };
  }
}

export { createStaff, updateStaff, toggleActiveStatus, deleteStaff }