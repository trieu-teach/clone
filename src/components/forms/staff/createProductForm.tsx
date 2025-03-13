import { formField } from "@next-server-actions/types"
import { CreateForm } from "../general-form"
import { createStaff } from "@/actions/staffActions";
import { StaffSchema } from "@/schemas/staffSchema";

const inputFormFields:formField[] = [
    {
        name: "name",
        label: "Product Name",
        type: "text",
        placeholder: "Enter product name",
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
        type: "text",
        placeholder: "Enter category",
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
            { value: "true", name: "Active" },
            { value: "false", name: "Inactive" },
        ],
        placeholder: "Select status",
    },

]

export const CreateProductForm = () => {
    return CreateForm(inputFormFields)
}
