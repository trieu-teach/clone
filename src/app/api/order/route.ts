import { connectDB } from '@/lib/mongodb';
import OrderModel from "@/models/order";
import { SortOrder } from 'mongoose';
import { OrderSchema } from '@/schemas/orderSchema';

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');
        const search = searchParams.get('name') || ''; // Use 'name' for search
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;

        const skip = (page - 1) * limit;

        // Validate sortField
        const validSortFields = Object.keys(OrderSchema.keyof().Values);
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        if (id) {
            const order = await OrderModel.findById(id);
            if (!order) {
                return new Response(JSON.stringify({ message: "Order not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(order), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
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

        return new Response(JSON.stringify({
            data: orders,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (e) {
        return new Response(JSON.stringify({ message: (e as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export { GET }
