import { StaffSchema } from "@/schemas/staffSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(StaffSchema);
const StaffModel = models.Staff || model("Staff", schema ) 
export default StaffModel

