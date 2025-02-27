import { OrderDetailSchema } from "@/schemas/orderDetailSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(OrderDetailSchema);
const OrderDetailModel = models.OrderDetail || model("OrderDetail", schema ) 
export default OrderDetailModel

