import { connectDB } from "@/lib/mongodb";
import OrderDetailModel from "@/models/oderdetail";
import { OrderDetailSchema } from "@/schemas/guest/OrderDetailSchema";
import { NextRequest, NextResponse } from "next/server";



export const GET = async () => {
    try {
        // Kết nối database
        await connectDB();

        // Lấy tất cả OrderDetail
        const orderDetails = await OrderDetailModel.find();

        return NextResponse.json(orderDetails, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();

        // Validate dữ liệu đầu vào
        const orderDetail = OrderDetailSchema.parse(data);
        
        // Kết nối database
        await connectDB();

        // Tạo OrderDetail
        const newOrderDetail = await OrderDetailModel.create(orderDetail);

        return NextResponse.json(newOrderDetail, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
};
