import { connectDB } from '@/lib/mongodb';
import SkinTypeModel from "@/models/skinType";

const GET = async (req: Request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id');

        const skip = (page - 1) * limit;

        if (id) {
            const skinType = await SkinTypeModel.findById(id);
            if (!skinType) {
                return new Response(JSON.stringify({ message: "Skin type not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(skinType), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const totalDocs = await SkinTypeModel.countDocuments();
        const skinTypes = await SkinTypeModel.find()
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            data: skinTypes,
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
