import { connectDB } from '@/lib/mongodb';
import StaffModel from "@/models/staff";

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');

        const skip = (page - 1) * limit;

        if (id) {
            const staff = await StaffModel.findById(id);
            if (!staff) {
                return new Response(JSON.stringify({ message: "Staff not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(staff), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const totalDocs = await StaffModel.countDocuments();
        const staffs = await StaffModel.find()
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: staffs,
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
