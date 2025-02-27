import { connectDB } from '@/lib/mongodb';
import FeedbackModel from '@/models/feedback';

// Path: api/feedback/[id]
// Get feedback by ID
const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        return middleware(request, { params });
    } catch (e) {
        console.error(e);
    }
};

// Update feedback by ID
const PUT = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const response = await middleware(request, { params });

    if (response.status !== 200) {
        return response;
    }

    try {
        const feedback = await response.json();
        const updatedData = await request.json();
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
            feedback._id,
            updatedData,
            { new: true }
        );
        return new Response(JSON.stringify(updatedFeedback), { status: 200 });
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

// Delete feedback by ID
const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const response = await middleware(request, { params });

    if (response.status !== 200) {
        return response;
    }

    try {
        const feedback = await response.json();
        await FeedbackModel.findByIdAndDelete(feedback._id);
        return new Response(null, { status: 204 });
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

// Middleware to get feedback by ID
const middleware = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const id = (await params).id;
        await connectDB();
        const feedback = await FeedbackModel.findOne({ _id: id });
        if (!feedback) {
            return new Response('Feedback not found', { status: 404 });
        }
        return new Response(JSON.stringify(feedback));
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

export { GET, PUT, DELETE };
