import { PromotionSchema } from "@/schemas/promotionSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(PromotionSchema);
const PromotionModel = models.Promotion || model("Promotion", schema ) 
export default PromotionModel

