import { connectDB } from '@/lib/mongodb';
import FeedbackModel from '@/models/feedback';
import { FeedbackSchema } from '@/schemas/guest/feedbackSchema';

// Get all feedback
const GET = async (req: Request) => { 
    try {
        await connectDB();
        const feedbacks = await FeedbackModel.find({}, 'FeedbackID Date CustomerID ProductID Rating Comment'); 
        return new Response(JSON.stringify(feedbacks))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}

// Create a new feedback entry
const POST = async (req: Request) => {
    try {
        const data = await req.json();
        let feedback = FeedbackSchema.parse(data);
        
        if (!feedback) {
            return new Response("Invalid data", { status: 400 });
        }
        
        await connectDB();
        await FeedbackModel.create(feedback);
        return new Response(JSON.stringify(feedback));
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
}

export { GET, POST };
