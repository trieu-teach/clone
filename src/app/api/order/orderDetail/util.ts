import { connectDB } from '@/lib/mongodb';
import OrderDetailModel from "@/models/orderDetail";
import { OrderDetailSchema } from '@/schemas/orderDetailSchema';
import { PaginationedData } from '@next-server-actions/types';
import { SortOrder } from 'mongoose';
export async function getOrderDetailsFromDB({
    page = 1,
    limit = 10,
    orderId,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
}:{
    page?: number,
    limit?: number,
    orderId?: string,
    search?: string,
    sortBy?: string,
    sortOrder?: SortOrder
}): Promise<PaginationedData<any> | any> {
    try {
        await connectDB();

        const skip = (page - 1) * limit;

        // Validate sortField
        const validSortFields = Object.keys(OrderDetailSchema.keyof().Values);
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        if (orderId) {
            const orderDetails = await OrderDetailModel.find({order_id: orderId});
            if (!orderDetails) {
                return { message: "Order Details not found" };
            }
            return orderDetails;
        }

        const query: any = {};
        if (search) {
            query.$or = [
                { product_id: { $regex: search, $options: 'i' } },
            ];
        }

        const totalDocs = await OrderDetailModel.countDocuments(query);
        const orderDetails = await OrderDetailModel.find(query)
            .sort({
                [sortField]: sortOrder,
            })
            .skip(skip)
            .limit(limit);

        return {
            data: orderDetails,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        };
    } catch (e) {
        return { message: (e as Error).message };
    }
}
export async function getOrderDetail({ orderId }: { orderId?: string }) {
    return getOrderDetailsFromDB({orderId: orderId});
}