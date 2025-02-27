import { z } from 'zod';
import { extendZod, zId } from "@zodyac/zod-mongoose";

// Extend zod with the zId and zUUID functions (!!important)
extendZod(z); 

// Define the schema (!!important)
export const ProductSchema = z.object({
    name: z.string().min(3).max(20).default("test"),
    description: z.string().min(3).max(2000).default("test"),
    price: z.number().min(0).default(0),
    quantity: z.number().min(0).default(0),
    category_id: zId("Category"),
    skin_type_id: zId("SkinType"),
    image_url: z.string().optional(),
    //default value will be generated by mongoose
    createdAt: z.date().default(new Date()), 
    updatedAt: z.date().default(new Date()),
});


// Define the schema with the ID (!!important)
export const zProductSchemaUdate = ProductSchema.extend({
    _id: zId(), //default value will be generated by mongoose
})

export type Product = z.infer<typeof ProductSchema>;