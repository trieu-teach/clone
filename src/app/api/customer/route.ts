import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";
import { CustomerSchema } from '@/schemas/customerSchema';


const GET = async (req: Request) => {
    try {
        await connectDB();
        const customers = await CustomerModel.find(); 
        return new Response(JSON.stringify(customers))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}

const POST = async (req: Request) => {
    try {
        const data = await req.json()
        let user = CustomerSchema.parse(data)
        if (!user) {
            return new Response("Invalid data", { status: 400 })
        }
        await connectDB();
        await CustomerModel.create(user);
        return new Response(JSON.stringify(user))
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}
export { GET, POST }
