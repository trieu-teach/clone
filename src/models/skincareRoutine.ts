import { SkincareRoutineSchema } from "@/schemas/skincareRoutineSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(SkincareRoutineSchema);
const SkincareRoutineModel = models.SkincareRoutine || model("SkincareRoutine", schema ) 
export default SkincareRoutineModel

