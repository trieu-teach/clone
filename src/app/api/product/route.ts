import { connectDB } from '@/lib/mongodb';
import ProductModel from "@/models/product";
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

        

        const skip = (page - 1) * limit;

        if (id) {
            const product = await ProductModel.findById(id);
            if (!product) {
                return new Response(JSON.stringify({ message: "Product not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(product), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const filter: FilterQuery<typeof ProductModel> = {};
        if (nameFilter) {
            filter.name = { $regex: nameFilter, $options: 'i' };
        }
        if (isActiveFilter) {
            filter.is_active = isActiveFilter === 'true';
        }

        const sort: { [key: string]: SortOrder } = {
            [sortBy]: sortOrder as SortOrder,
            _id: 1 as SortOrder,
        };

        const totalDocs = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);


        return new Response(JSON.stringify({
            data: products,
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

