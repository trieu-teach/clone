import { CategorySchema } from "@/schemas/categorySchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(CategorySchema);
const CategoryModel = models.Category || model("Category", schema ) 
export default CategoryModel

