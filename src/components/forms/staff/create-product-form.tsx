import { formField, Selection } from "@next-server-actions/types"
import { CreateForm } from "../general-form"
import { z } from "zod";
import { ProductSchema } from "@/schemas/productSchema";
import { createProduct } from "@/actions/productActions";
import { useEffect, useState } from "react";
import { createCategory } from "@/actions/categoryActions";


export const CreateProductForm = () => {
    const [categorySelections, setCategorySelections] = useState<Selection[]>([])
    const fetchData = async () => {
        const res = await fetch('/api/category')
        const rawData = await res.json();
        const formattedData = rawData.data.map((item: any) => ({
            value: item._id,
            label: item.name
        }))
        setCategorySelections(formattedData)
    }
    useEffect(() => {
        fetchData()
    }, [])
    const FormSchema = ProductSchema.extend({
    });

    const inputFormFields: formField<z.infer<typeof FormSchema>>[] = [
        {
            name: "name",
            label: "Product Name",
            type: "text",
            placeholder: "Enter product name",
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            placeholder: "Enter description",
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            placeholder: "Enter price",
        },
        {
            name: "quantity",
            label: "Quantity",
            type: "number",
            placeholder: "Enter quantity",
        },
        {
            name: "category_id",
            label: "Category",
            type: "selection",
            selections: categorySelections,
            CreateAction: createCategory,
            placeholder: "Select category",
        },
        {
            name: "image_url",
            label: "Image URL",
            type: "text",
            placeholder: "Enter image URL",
        },
        {
            name: "is_active",
            label: "Status",
            type: "selection",
            selections: [
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
            ],
            placeholder: "Select status",
        }
    ]
    return CreateForm(inputFormFields, createProduct)
}
