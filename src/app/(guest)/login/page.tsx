"use client";

import { useState, useCallback, memo, useActionState, ReactNode, useReducer, FormEvent } from "react";
import { z } from "zod"
import { CustomerSchema } from "@/schemas/customerSchema";
import { FormState } from "@next-server-actions/types";
import { Label } from "@/components/ui/label"
import { register } from "@/actions/customerRegisterAction";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import router from "next/router";
import { useToast } from "@/lib/custom-hooks";
import { redirect } from "next/navigation";

const CustomerLoginSchema = CustomerSchema.pick({
  password: true,
  email: true,
});
type CustomerFormValues = z.infer<typeof CustomerLoginSchema>;

const initialState: FormState = {
    message: "",
    success: false,
};

const initialCustomerState: CustomerFormValues = {
    email: "",
    password: "",
};

// Reducer function for managing product state
type CustomerLoginAction =
    | { type: 'UPDATE_FIELD'; field: keyof CustomerFormValues; value: any }
    | { type: 'RESET' };

const customerReducer = (state: CustomerFormValues, action: CustomerLoginAction): CustomerFormValues => {
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

const LoginPage = () => {
    const [state, formAction, isPending] = useActionState(register, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [customerState, dispatch] = useReducer(customerReducer, initialCustomerState);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof CustomerFormValues) => {
        const value = e.target.value;
        dispatch({
            type: 'UPDATE_FIELD',
            field: name,
            value: value,
        });
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const res = await signIn("customer-credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirect: false,
      });
      if (res?.error) {
          useToast(res.error as string);
      }
      if (res?.ok) {
          useToast("login successfully");
          redirect("/");
      }
  };

    return (
        <div className="max-w-96 bg-gray-50 p-5 mt-10 mx-auto space-y-12">
            <h1 className="text-2xl font-semibold">Đăng kí</h1>
            <form onSubmit={handleSubmit} id="add-product-form" className="space-y-6">
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
                {state.message && (
                    <p className={state.success ? "text-green-600" : "text-red-600"}>
                        {state.message}
                    </p>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating..." : "Đăng kí"}
                </Button>
            </form>
        </div>
    )
}
export default LoginPage;

