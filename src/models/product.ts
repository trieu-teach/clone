import { ProductSchema } from "@/schemas/productSchema";
import { model, models } from "mongoose";
import { zodSchema } from "@zodyac/zod-mongoose";

const schema = zodSchema(ProductSchema);
const ProductModel = models.Product || model("Product", schema ) 
export default ProductModel

