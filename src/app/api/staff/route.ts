import { connectDB } from '@/lib/mongodb';
import StaffModel from "@/models/staff";
import { FilterQuery, SortOrder } from 'mongoose';

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sortBy = searchParams.get('sortBy') || 'createdAt'; 
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; 
        const id = searchParams.get('id');
        const nameFilter = searchParams.get('name');
        const isActiveFilter = searchParams.get('is_active');

        const skip = ((page - 1) * limit);

        const filter: FilterQuery<typeof StaffModel> = {};
        if (nameFilter) {
            filter.name = { $regex: nameFilter, $options: 'i' };
        }
        if (isActiveFilter) {
            filter.is_active = isActiveFilter === 'true';
        }

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
        const sort: { [key: string]: SortOrder } = {
            [sortBy]: sortOrder as SortOrder,
            _id: 1 as SortOrder,
        };

        const totalDocs = await StaffModel.countDocuments(filter);
        const staffs = await StaffModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: staffs,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            totalDocs,
            sortBy,
            sortOrder,
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
