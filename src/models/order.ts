import { OrderSchema } from "@/schemas/orderSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(OrderSchema);
const OrderModel = models.Order || model("Order", schema ) 
export default OrderModel

