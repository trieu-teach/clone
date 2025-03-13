"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import { StaffSchema } from "@/schemas/staffSchema"
import { useToast } from "@/lib/custom-hooks"

const FormSchema = StaffSchema.extend({
    confirmPassword: z.string().min(8).max(20),
})

export function InputForm() {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            role: "admin",
            is_active: true,
        },
    })

    function onSubmitForm(data: z.infer<typeof FormSchema>) {
        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm Password must be the same")
            return
        }
        useToast("create success")
        setIsOpen(false)
    
    }

    return (
        <Form {...form}>
            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add new</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
                        {Object.keys(form.getValues()).filter((key) => key !== "confirmPassword" && key !== "is_active" && key !== "createdAt" && key !== "updatedAt").map((key) => (
                            <FormField
                                key={key}
                                control={form.control}
                                name={key as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                                        <FormControl>
                                            <Input type={key === "password" ? "password" : "text"} placeholder={key} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Submit</Button>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Form>
    )
}

