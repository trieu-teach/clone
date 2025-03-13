import { connectDB } from '@/lib/mongodb';
import FeedbackModel from "@/models/feedback";
import { SortOrder } from 'mongoose';
 
const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');
        const search = searchParams.get('search') || '';
        const sortField = searchParams.get('sortField') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;

        const skip = (page - 1) * limit;

        if (id) {
            const feedback = await FeedbackModel.findById(id);
            if (!feedback) {
                return new Response(JSON.stringify({ message: "Feedback not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(feedback), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const query = search
            ? {
                $or: [
                    { productId: { $regex: search, $options: 'i' } },
                    { customerId: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const totalDocs = await FeedbackModel.countDocuments(query);
        const feedbacks = await FeedbackModel.find(query)
            .sort({
                [sortField]: sortOrder,
            })
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: feedbacks,
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
