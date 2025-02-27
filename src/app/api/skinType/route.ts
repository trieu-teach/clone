import { connectDB } from '@/lib/mongodb';
import skinTypeModel from "@/models/skinType";
import { SkinTypeSchema } from '@/schemas/skinTypeSchema';

const GET = async (req: Request) => { 
    try {
        await connectDB();
        const customers = await skinTypeModel.find();
        return new Response(JSON.stringify(customers))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}

const POST = async (req: Request) => {
    try {
        const data = await req.json()
        let user = SkinTypeSchema.parse(data)
        if (!user) {
            return new Response("Invalid data", { status: 400 })
        }
        await connectDB();
        await skinTypeModel.create(user);
        return new Response(JSON.stringify(user))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}
export { GET, POST }
