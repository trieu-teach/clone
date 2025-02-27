import { z } from 'zod';
import { extendZod, zId } from "@zodyac/zod-mongoose";

// Extend zod with the zId and zUUID functions (!!important)
extendZod(z); 

// Define the schema (!!important)
export const PromotionSchema = z.object({
    name: z.string().min(3).max(20).default("test"),
    code: z.string().default("test"),
    discount_type: z.string().default("test"),
    discount_value: z.number().min(0),
    start_date: z.date().default(new Date()),
    end_date: z.date().default(new Date()),
    is_active: z.boolean().default(true),
    min_order_value: z.number().min(0),
    max_discount_amount: z.number().min(0).optional(),
    usage_limit: z.number().min(0).optional(),
    used_count: z.number().min(0).optional(),
    //default value will be generated by mongoose
    createdAt: z.date().default(new Date()), 
    updatedAt: z.date().default(new Date()),
});


// Define the schema with the ID (!!important)
export const zPromotionSchemaUdate = PromotionSchema.extend({
    _id: zId(), //default value will be generated by mongoose
})

export type Promotion = z.infer<typeof PromotionSchema>;