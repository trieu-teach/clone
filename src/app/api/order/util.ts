import { connectDB } from '@/lib/mongodb';
import OrderModel from "@/models/order";
import { SortOrder } from 'mongoose';
import { OrderSchema } from '@/schemas/orderSchema';
import { PaginationedData } from '@next-server-actions/types';

// Separate function to fetch order data from the database
export async function getOrdersFromDB({
    page = 1,
    limit = 10,
    id,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
}:{
    page?: number,
    limit?: number,
    id?: string,
    search?: string,
    sortBy?: string,
    sortOrder?: SortOrder
}): Promise<PaginationedData<any> | any> {
    try {
        await connectDB();

        const skip = (page - 1) * limit;

        // Validate sortField
        const validSortFields = Object.keys(OrderSchema.keyof().Values);
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        if (id) {
            const order = await OrderModel.findById(id);
            if (!order) {
                return { message: "Order not found" };
            }
            return order;
        }

        const query: any = {};
        if (search) {
            query.$or = [
                { customer_id: { $regex: search, $options: 'i' } },
            ];
        }

        const totalDocs = await OrderModel.countDocuments(query);
        const orders = await OrderModel.find(query)
            .sort({
                [sortField]: sortOrder,
            })
            .skip(skip)
            .limit(limit);

        return {
            data: orders,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        };
    } catch (e) {
        return { message: (e as Error).message };
    }
}

export async function getOrder({ id }: { id?: string }) {
    return getOrdersFromDB({id: id});
}