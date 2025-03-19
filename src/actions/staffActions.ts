'use server';

import { connectDB } from '@/lib/mongodb';
import StaffModel from "@/models/staff";
import { StaffSchema, zStaffSchemaUdate } from '@/schemas/staffSchema';
import { ActionReturn } from '@next-server-actions/types';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

const register = async (prevState: any, formData: FormData): Promise<ActionReturn> => {
  try {
    const rawData = Object.fromEntries(formData);
    // type convertion
    const convertedData = {
      ...rawData,
      role: "staff",
      date_of_birth: new Date(rawData.date_of_birth as string),
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const customerData = StaffSchema.parse(convertedData);
    await connectDB();
    const userFound = await StaffModel.findOne({ email: customerData.email });
    if (userFound) {
      return { message: "Email đã đăng kí!", success: false, formData }
    }
    customerData.password = await bcrypt.hash(customerData.password, 10);
    await StaffModel.create(customerData);
    redirect("/staff");
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

export { createStaff, updateStaff, toggleActiveStatus, deleteStaff, register }