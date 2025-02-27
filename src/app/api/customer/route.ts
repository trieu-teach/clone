import { connectDB } from '@/lib/mongodb';
import CustomerModel from "@/models/customer";
import { CustomerSchema } from '@/schemas/customers/customerSchema';

//ref: https://www.youtube.com/watch?v=fgTGADljAeg Build A REST API With Node.js, Express, & MongoDB - Quick
// Path: api/customer
//get all customers
const GET = async (req: Request) => { //arrow function ref: https://www.youtube.com/watch?v=h33Srr5J9nY
    try {
        await connectDB();
        const customers = await CustomerModel.find(); //ref: https://www.youtube.com/watch?v=DZBGEVgL2eE Mongoose Crash Course - Beginner Through Advanced
        return new Response(JSON.stringify(customers))
      //  return new Response(process.env.MONGODB_URI)
    } catch (e) {
        return new Response((e as Error).message, { status: 500 })
    }
}

//create a new customer
const POST = async (req: Request) => {
    try {
        const data = await req.json()
        // let user = CustomerSchema.parse({
        //     name: "test123@gmail.com",
        //     email: "test@gmail.com",
        //     password: "test@gmail.com",
        //     address: {
        //         provinceId: "01",
        //         districtId: "001",
        //         communeId: "00001",
        //         detail: "test"
        //     },
        // })
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
