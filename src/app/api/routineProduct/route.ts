import { connectDB } from '@/lib/mongodb';
import RoutineProductModel from "@/models/routineProduct";
import { FilterQuery, SortOrder } from 'mongoose';
 
const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const nameFilter = searchParams.get('name');
        const isActiveFilter = searchParams.get('is_active');

        const skip = (page - 1) * limit;

        const filter: FilterQuery<typeof RoutineProductModel> = {};
        if (nameFilter) {
            filter.name = { $regex: nameFilter, $options: 'i' };
        }
        if (isActiveFilter) {
            filter.is_active = isActiveFilter === 'true';
        }

        if (id) {
            const routineProduct = await RoutineProductModel.findById(id);
            if (!routineProduct) {
                return new Response(JSON.stringify({ message: "Routine product not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(routineProduct), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sort: { [key: string]: SortOrder } = {
            [sortBy]: sortOrder as SortOrder,
            _id: 1 as SortOrder,
        };

        const totalDocs = await RoutineProductModel.countDocuments(filter);
        const routineProducts = await RoutineProductModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: routineProducts,
            page,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            sortBy,
            sortOrder,
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
