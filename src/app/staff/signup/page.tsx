"use client";

import { memo, ReactNode, FormEvent } from "react";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useToast } from "@/lib/custom-hooks";
import { redirect } from "next/navigation";
import { z } from "zod";
import { StaffSchema } from "@/schemas/staffSchema";
import { register } from "@/actions/staffActions";
import { DateInput } from "@/components/ui/date-input";

type FormFieldProps = z.infer<typeof StaffSchema> & { confirm_password: z.infer<typeof StaffSchema>["password"] };

const FormField = memo(({
    name,
    label,
    children,
    description,
}: { 
    name: keyof FormFieldProps
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
        const res = await register('', formData);
        useToast(res.message)
    };

    return (
        <div className="max-w-96 bg-gray-50 p-5 mt-10 mx-auto space-y-12">
            <h1 className="text-2xl font-semibold">Đăng kí</h1>
            <form onSubmit={handleSubmit} id="add-product-form" className="space-y-6">
                <FormField name="email" label="Email nhân viên">
                    <Input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Nhập email nhân viên"
                    /> 
                </FormField>
                <FormField name="password" label="Mật khẩu">
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                    />
                </FormField> 
                <FormField name="confirm_password" label="Xác nhận mật khẩu">
                    <Input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Nhập lại mật khẩu"
                    />
                </FormField> 
                <FormField name="name" label="Họ và tên nhân viên">
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nhập họ và tên"
                    />
                </FormField>
                <FormField name="date_of_birth" label="Ngày sinh">
                    <Input
                        type="date"
                        id="date_of_birth"
                        name="date_of_birth" 
                    />
                </FormField>
                <FormField name="phone" label="Số điện thoại nhân viên">
                    <Input 
                        type="string"
                        id="phone"
                        name="phone"
                        placeholder="Nhập số điện thoại nhân viên"
                    />
                </FormField>
                <Button type="submit">Đăng kí</Button>
            </form>
        </div>
    )
}
export default LoginPage;

