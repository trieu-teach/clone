"use client";

import { useState, useMemo, useCallback } from "react";
import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateAction, formField, FormState } from "@next-server-actions/types";
import searchableSelect from "../searchable-select";

const initialState: FormState = {
    message: "",
    success: false,
};
export function CreateForm<T>(inputFormFields: formField<T>[], createAction: CreateAction) {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createAction, initialState);

    const formFields: formField<T>[] = useMemo(
        () => inputFormFields,
        [],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4 pt-4">
                    {formFields.map((fields) => (
                        <div className="space-y-2" key={fields.name?.toString()}>
                            <Label htmlFor={fields.name?.toString()}>{fields.label}</Label>
                            {fields.type === "selection" ? (
                                searchableSelect(fields.selections || [],fields.CreateAction)
                            ) : (
                                <Input
                                    id={fields.name?.toString()}
                                    name={fields.name?.toString()}
                                    type={fields.type}
                                    defaultValue={state.formData?.get(fields.name?.toString()) as string | undefined}
                                />
                            )}
                        </div>
                    ))}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                    <Button variant={"ghost"} className="mx-2" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    {state.message && (
                        <p className={state.success ? "text-green-600" : "text-red-600"}>
                            {state.message}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
