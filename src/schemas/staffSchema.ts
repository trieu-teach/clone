import { z } from 'zod';
import { extendZod, zId } from "@zodyac/zod-mongoose";

// Extend zod with the zId and zUUID functions (!!important)
extendZod(z); 

// Define the phone regex for Vietnamese phone number
const phoneRegex = new RegExp(
    /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
)


// Define the schema (!!important)
export const StaffSchema = z.object({
    name: z.string().min(3).max(20).default("test"),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    phone: z.optional(z.string().regex(phoneRegex)),
    date_of_birth: z.optional(z.date()),
    role:  z.enum(["admin","staff"]),
    //default value will be generated by mongoose
    createdAt: z.date().default(new Date()), 
    updatedAt: z.date().default(new Date()),
});


// Define the schema with the ID (!!important)
export const zStaffSchemaUdate = StaffSchema.extend({
    _id: zId(), //default value will be generated by mongoose
})

export type Staff = z.infer<typeof StaffSchema>;