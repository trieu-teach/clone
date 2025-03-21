"use client";

import { memo, ReactNode, FormEvent } from "react";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useToast } from "@/lib/custom-hooks";
import { redirect } from "next/navigation";
import { SessionCustomer } from "@next-server-actions/types";



const FormField = memo(({
    name,
    label,
    children,
    description,
}: {
    name: keyof SessionCustomer
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
            <h1 className="text-2xl font-semibold">Đăng nhập</h1>
            <form onSubmit={handleSubmit} id="add-product-form" className="space-y-6">
                <FormField name="email" label="Email">
                    <Input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Customer email"
                    />
                </FormField>
                <FormField name="password" label="Password">
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Customer password"
                    />
                </FormField>
                <Button type="submit">Đăng nhập</Button>
            </form>
        </div>
    )
}
export default LoginPage;

