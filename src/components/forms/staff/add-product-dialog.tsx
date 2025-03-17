"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { AddProductForm } from "./add-product-form"
import { useToast } from "@/lib/custom-hooks"

type AddProductDialogProps = {
  onProductAdded?: () => void
}

export function AddProductDialog({ onProductAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProductAdded = () => {
    onProductAdded?.();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onProductAdded={handleProductAdded}/>
        </DialogContent>
      </Dialog>
    </>
  )
}
