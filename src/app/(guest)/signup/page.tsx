"use client";

import { useState, useCallback, useEffect, memo, useActionState, ReactNode, useReducer, useMemo } from "react";
import { z } from "zod"
import { AddressSchema, CustomerSchema } from "@/schemas/customerSchema";
import { ActionReturn, FormState } from "@next-server-actions/types";
import { Label } from "@/components/ui/label"
import { register } from "@/actions/customerRegisterAction";
import { useToast } from "@/lib/custom-hooks";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/searchable-select";
import addressData from "@/data/address.json";


const CustomerSignupSchema = CustomerSchema.extend({
    confirm_password: z.string(),
}).merge(AddressSchema)
type CustomerFormValues = z.infer<typeof CustomerSignupSchema>;

const initialState: FormState = {
    message: "",
    success: false,
};

const initialCustomerState: CustomerFormValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: undefined,
    date_of_birth: undefined,
    avatar: undefined,
    provinceId: undefined,
    districtId: undefined,
    communeId: undefined,
    detail: "",
    skinType: undefined,
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Reducer function for managing product state
type ProductAction =
    | { type: 'UPDATE_FIELD'; field: keyof CustomerFormValues; value: any }
    | { type: 'RESET' };

const customerReducer = (state: CustomerFormValues, action: ProductAction): CustomerFormValues => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'RESET':
            return initialCustomerState;
        default:
            return state;
    }
};

// Custom form field component
const FormField = memo(({
    name,
    label,
    children,
    description,
}: {
    name: keyof CustomerFormValues
    label: string
    children: ReactNode
    description?: string
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name.toString()}>{label}</Label>
            {children}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
});

const SignupPage = () => {
    const [state, formAction, isPending] = useActionState(register, initialState);
    const [addressSelections, setAddressSelections] = useState<{ province: { value: string, label: string }[], district: { value: string, label: string }[], commune: { value: string, label: string }[] }>({ province: [], district: [], commune: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [customerState, dispatch] = useReducer(customerReducer, initialCustomerState);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof CustomerFormValues) => {
        const value = e.target.value;
        dispatch({
            type: 'UPDATE_FIELD',
            field: name,
            value: name === "phone" ? Number(value) : value,
        });
    }, []);

    const provinceSelections = useMemo(() => {
        return addressData.province.map((value) => ({
            label: value.name,
            value: value.idProvince
        }))
    }, [])

    const districtSelections = useMemo(() => {
        return addressData.district.filter((value) => value.idProvince === customerState.provinceId).map((value) => ({
            label: value.name,
            value: value.idDistrict
        }))
    }, [customerState.provinceId])

    const communeSelections = useMemo(() => {
        return addressData.commune.filter((value) => value.idDistrict === customerState.districtId).map((value) => ({
            label: value.name,
            value: value.idCommune
        }))
    }, [customerState.districtId])




    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        for (const key in customerState) {
            if (customerState.hasOwnProperty(key)) {
                const value = customerState[key as keyof CustomerFormValues];
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value !== undefined && value !== null) {
                    if (key === 'createdAt' || key === 'updatedAt') {
                        formData.append(key, Date.now().toString());
                    }
                    formData.append(key, value.toString());
                }
            }
        }
        const result = await register(initialState, formData);
        useToast(result.message)
        if (result.success) {
            dispatch({ type: 'RESET' })
        }
        setIsSubmitting(false);
    };
    return (
        <div className="max-w-96 bg-gray-50 p-5 mt-10 mx-auto space-y-12">
            <h1 className="text-2xl font-semibold">Đăng kí</h1>
            <form action={formAction} id="add-product-form" className="space-y-6">
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Product Details</TabsTrigger>
                        <TabsTrigger value="media">Media & Options</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4 pt-4">
                        <FormField name="email" label="Email">
                            <Input
                                type="text"
                                id="email"
                                name="email"
                                value={customerState.email}
                                onChange={(e) => handleInputChange(e, "email")}
                                placeholder="Product name"
                            />
                        </FormField>
                        <FormField name="password" label="Password">
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={customerState.password}
                                onChange={(e) => handleInputChange(e, "password")}
                                placeholder="Product name"
                            />
                        </FormField>
                        <FormField name="confirm_password" label="Confirm passsword">
                            <Input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={customerState.confirm_password}
                                onChange={(e) => handleInputChange(e, "confirm_password")}
                                placeholder="Product name"
                            />
                        </FormField>
                        <FormField name="name" label="Name">
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={customerState.name}
                                onChange={(e) => handleInputChange(e, "name")}
                                placeholder=""
                            />
                        </FormField>
                    </TabsContent>
                    <TabsContent value="media" className="space-y-4 pt-4">
                        <FormField name="provinceId" label="Province">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <SearchableSelect
                                    selections={provinceSelections}
                                    value={customerState.provinceId}
                                    onChange={(value) => {
                                        dispatch({
                                            type: 'UPDATE_FIELD',
                                            field: "provinceId",
                                            value: value,
                                        })
                                    }}
                                    placeholder="Select province"
                                />
                            )}
                        </FormField>
                        <FormField name="districtId" label="District">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <SearchableSelect
                                    selections={districtSelections}
                                    value={customerState.districtId}
                                    onChange={(value) => {
                                        dispatch({
                                            type: 'UPDATE_FIELD',
                                            field: "districtId",
                                            value: value,
                                        })
                                    }}
                                    placeholder="Select district"
                                />
                            )}
                        </FormField>
                        <FormField name="communeId" label="CommuneId">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <SearchableSelect
                                    selections={communeSelections}
                                    value={customerState.communeId}
                                    onChange={(value) => {
                                        dispatch({
                                            type: 'UPDATE_FIELD',
                                            field: "communeId",
                                            value: value,
                                        })
                                    }}
                                    placeholder="Select commune"
                                />
                            )}
                        </FormField>

                        <FormField name="detail" label="Address detail">
                            <Input
                                type="text"
                                id="detail"
                                name="detail"
                                value={customerState.detail}
                                onChange={(e) => handleInputChange(e, "detail")}
                                placeholder=""
                            />
                        </FormField>

                    </TabsContent>
                </Tabs>
                {state.message && (
                    <p className={state.success ? "text-green-600" : "text-red-600"}>
                        {state.message}
                    </p>
                )}
                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating..." : "Đăng kí"}
                </Button>
            </form>
        </div>
    )
}
export default SignupPage;

