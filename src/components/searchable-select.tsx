"use client"

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CreateAction, FormState, Selection } from "@next-server-actions/types"
import { JSX, useActionState, useCallback, useEffect, useMemo, useState } from "react"
import { useToast } from "@/lib/custom-hooks"

const initialState: FormState = {
    message: "",
    success: false,
};

interface SearchableSelectProps {
    value?: string
    onChange?: (value: string) => void
    selections: Selection[]
    placeholder?: string
    className?: string
    createNewSelection?: CreateAction
}
export default function searchableSelect({ selections, createNewSelection, value, onChange, className, placeholder }: SearchableSelectProps): JSX.Element {
    const [open, setOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(value || "")
    const [inputValue, setInputValue] = useState("")
    //const [selectionsState, setSelectionsState] = useState<Selection[]>(selections) // Removed this line
    const [state, formAction, isPending] = useActionState(createNewSelection || ((prevState: any, formData: FormData) => Promise.resolve(initialState)), initialState);


    // Update internal value when external value changes
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    // Handle value change
    const handleValueChange = useCallback(
        (newValue: string) => {
            setInternalValue(newValue)
            onChange?.(newValue)
        },
        [onChange],
    )

    const handleCreateNew = async () => {
        if (!inputValue) return
        // Create a new seletion option
        const newSelection: Selection = {
            value: inputValue,
            label: inputValue,
        }
        // Call the server action separately
        if (createNewSelection) {
            const formData = new FormData();
            formData.append('name', inputValue);
            const result = await createNewSelection(initialState, formData);
            if (result.success) {
                newSelection.value = result?.formData?.get("categoryId")?.toString() || inputValue;
            }
            useToast(result.message)
        }

        // Add to the list
        //setSelectionsState((prev) => [...prev, newSelection]) // Removed this line
        // Select the new value
        setInputValue("")
        setOpen(false)
    }
    // Get the current value to display
    const displayValue = useMemo(() => {
        return selections?.find((option) => option.value === internalValue)?.label || ""
    }, [internalValue, selections])

    return (
        <div className={cn("w-full relative mx-auto", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {displayValue || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command
                        filter={(_, search, keywords) => {
                            return keywords?.map((keyword) => keyword.toLocaleLowerCase().includes(search.toLocaleLowerCase())).some((result) => !!result) ? 1 : 0;
                        }}
                    >
                        <CommandInput placeholder="Search seletion..." value={inputValue} onValueChange={setInputValue} />
                        <CommandList>
                            <CommandEmpty>No seletion found.</CommandEmpty>
                            <CommandGroup>
                                {selections.map((seletion) => ( // Changed selectionsState to selections
                                    <CommandItem
                                        keywords={[seletion.label.toString()]}
                                        key={seletion.value}
                                        value={seletion.value?.toString()}
                                        onSelect={(currentValue) => {
                                            handleValueChange(currentValue === internalValue ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", value === seletion.value ? "opacity-100" : "opacity-0")} />
                                        {seletion.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>

                            <Separator className="my-1" />
                            {createNewSelection && (
                                <CommandGroup>
                                    {inputValue &&
                                        !selections.some((seletion) => seletion.label.toLowerCase() === inputValue.toLowerCase()) && ( // Changed selectionsState to selections
                                            <CommandItem onSelect={handleCreateNew} className="text-primary" disabled={isPending}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Create "{inputValue}"
                                                {state.message && (
                                                    <p className={state.success ? "text-green-600" : "text-red-600"}>
                                                        {state.message}
                                                    </p>
                                                )}
                                            </CommandItem>
                                        )}
                                </CommandGroup>
                            )
                            }
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
