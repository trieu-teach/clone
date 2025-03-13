"use client"

import type React from "react"

import type { Column, ColumnDef, Row, TableMeta } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define a custom TableMeta type
interface CustomTableMeta<T> extends TableMeta<T> {
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function createColumns<T extends object>(
  config: {
    accessor: keyof T
    header: string
    cell?: (info: any) => React.ReactNode
    enableSorting?: boolean
  }[],
): ColumnDef<T>[] {
  return [
    ...config.map((col) => ({
      accessorKey: col.accessor,
      header: ({ column }: { column: Column<T, unknown> }) => {
        return col.enableSorting === false ? (
          col.header
        ) : (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {col.header}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: col.cell ? col.cell : ({ row }: { row: Row<T> }) => <div>{String(row.getValue(col.accessor as string))}</div>,
    })),
    {
      id: "actions",
      cell: ({ row, table }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  if ((table.options.meta as CustomTableMeta<T>)?.onEdit) {
                    (table.options.meta as CustomTableMeta<T>).onEdit!(item)
                  }
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if ((table.options.meta as CustomTableMeta<T>)?.onDelete) {
                    (table.options.meta as CustomTableMeta<T>).onDelete!(item)
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

