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
import { createStaff } from "@/actions/staffActions";
import { StaffSchema } from "@/schemas/staffSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

const FormSchema = StaffSchema.extend({
  confirmPassword: z.string().min(8).max(20),
});

type formField =
  | {
      type: Exclude<string, "selection">;
      name: keyof z.infer<typeof FormSchema>;
      label: string;
      selections?: string[];
      placeholder?: string;
    }
  | {
      type: "selection";
      name: keyof z.infer<typeof FormSchema>;
      label: string;
      selections: string[];
      placeholder: string;
    };

interface State {
  message: string;
  success: boolean;
  formData?: FormData;
}

const initialState: State = {
  message: "",
  success: false,
};


export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createStaff, initialState);

  const formFields: formField[] = useMemo(
    () => [
      { type: "text", name: "name", label: "Full Name" },
      { type: "text", name: "email", label: "Email" },
      { type: "password", name: "password", label: "Password" },
      {
        type: "password",
        name: "confirmPassword",
        label: "Confirm Password",
      },
      {
        type: "selection",
        name: "role",
        selections: ["admin", "staff"],
        label: "Role",
      },
      { type: "text", name: "phone", label: "Phone Number" },
    ],
    [],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 pt-4">
          {formFields.map((fields) => (
            <div className="space-y-2" key={fields.name}>
              <Label htmlFor={fields.name}>{fields.label}</Label>
              {fields.type === "selection" ? (
                <Select
                  name={fields.name}
                  defaultValue={state.formData?.get(fields.name) as string}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={fields.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.selections &&
                      fields.selections.map((selection) => (
                        <SelectItem key={selection} value={selection}>
                          {selection}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={fields.name}
                  name={fields.name}
                  type={fields.type}
                  defaultValue={state.formData?.get(fields.name) as string}
                />
              )}
            </div>
          ))}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create User"}
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
