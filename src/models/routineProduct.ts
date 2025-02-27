import { RoutineProductSchema } from "@/schemas/routineProductSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(RoutineProductSchema);
const RoutineProductModel = models.RoutineProduct || model("RoutineProduct", schema ) 
export default RoutineProductModel

