import { SortOrder } from "mongoose";
import { getOrdersFromDB } from "./util";


const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const id = searchParams.get('id')|| undefined;
        const search = searchParams.get('name') || ''; // Use 'name' for search
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder;

        const result = await getOrdersFromDB({page, limit, id, search, sortBy, sortOrder});

        if ("message" in result) {
            if(result.message === "Order not found"){
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
        if(id){
            return new Response(JSON.stringify(result), {
                status: 200,
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
