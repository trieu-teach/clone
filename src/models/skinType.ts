import { SkinTypeSchema } from "@/schemas/skinTypeSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(SkinTypeSchema);
const SkinTypeModel = models.SkinType || model("SkinType", schema ) 
export default SkinTypeModel

