"use server"
import { connectDB } from "@/lib/mongodb";
import CustomerModel from "@/models/customer";
import User from "@/models/customer";
import { AddressSchema, CustomerSchema } from "@/schemas/customerSchema";
import { ActionReturn } from "@next-server-actions/types";
import bcrypt from "bcryptjs";
import { redirect } from 'next/navigation'
import { ZodError } from "zod";

export const register = async (prevState: any, formData: FormData): Promise<ActionReturn> => {
  try {
    const rawData = Object.fromEntries(formData);
    // type convertion
    const convertedData = {
      ...rawData,
      address: {
        provinceId: rawData.provinceId,
        districtId: rawData.districtId,
        communeId: rawData.communeId,
        detail: rawData.detail,
      },
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const customerData = CustomerSchema.parse(convertedData);
    await connectDB();
    const userFound = await User.findOne({ email: customerData.email });
    if (userFound) {
      return { message: "Email đã đăng kí!", success: false, formData }
    }
    customerData.password = await bcrypt.hash(customerData.password, 10);
    await CustomerModel.create(customerData);
    redirect("/");
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