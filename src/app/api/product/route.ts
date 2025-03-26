import { SortOrder } from "mongoose";
import { getProductsFromDB } from "./util";



const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;
        const id = searchParams.get('id') || undefined;
        const name = searchParams.get('name') || undefined;
        const isActive = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined;
        const randomOrder = searchParams.get('randomOrder') === 'true';

        const result = await getProductsFromDB({ page, limit, sortBy, sortOrder, id, name, isActive, randomOrder });

        if ("message" in result) {
            if (result.message === "Product not found") {
                return new Response(JSON.stringify(result), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify(result), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(result), {
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
