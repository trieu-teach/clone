import { z } from 'zod';
import { extendZod, zId } from "@zodyac/zod-mongoose";

// Extend zod with the zId and zUUID functions (!!important)
extendZod(z); 

// Define the schema (!!important)
export const OrderDetailSchema = z.object({
    order_id: zId("Order"),
    product_id: zId("Product"),
    quantity: z.number().min(0),
    price: z.number().min(0),
    //default value will be generated by mongoose
    createdAt: z.date().default(new Date()), 
    updatedAt: z.date().default(new Date()),
});


// Define the schema with the ID (!!important)
export const zOrderDetailSchemaUdate = OrderDetailSchema.extend({
    _id: zId(), //default value will be generated by mongoose
})

export type OrderDetail = z.infer<typeof OrderDetailSchema>;