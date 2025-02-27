// File: api/order-detail/[id].ts
import { connectDB } from '@/lib/mongodb';
import OrderDetailModel from '@/models/oderdetail';


// Lấy thông tin OrderDetail theo ID
const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const id = (await params).id;
        await connectDB();
        const orderDetail = await OrderDetailModel.findById(id);
        if (!orderDetail) {
            return new Response("OrderDetail not found", { status: 404 });
        }
        return new Response(JSON.stringify(orderDetail));
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

// Cập nhật OrderDetail theo ID
const PUT = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const id = (await params).id;
        const updatedData = await request.json();
        await connectDB();
        const updatedOrderDetail = await OrderDetailModel.findByIdAndUpdate(id, updatedData, { new: true });
        return new Response(JSON.stringify(updatedOrderDetail), { status: 200 });
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

// Xóa OrderDetail theo ID
const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const id = (await params).id;
        await connectDB();
        await OrderDetailModel.findByIdAndDelete(id);
        return new Response(null, { status: 204 });
    } catch (e) {
        return new Response((e as Error).message, { status: 500 });
    }
};

export { GET, PUT, DELETE };
