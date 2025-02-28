import { connectDB } from '@/lib/mongodb';
import OrderDetailModel from "@/models/orderDetail";

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');

        const skip = (page - 1) * limit;

        if (id) {
            const orderDetail = await OrderDetailModel.findById(id);
            if (!orderDetail) {
                return new Response(JSON.stringify({ message: "Order detail not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(orderDetail), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const totalDocs = await OrderDetailModel.countDocuments();
        const orderDetails = await OrderDetailModel.find()
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: orderDetails,
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
