import { CustomerSchema } from "@/schemas/customerSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(CustomerSchema);
const CustomerModel = models.Customer || model("Customer", schema ) 
export default CustomerModel

