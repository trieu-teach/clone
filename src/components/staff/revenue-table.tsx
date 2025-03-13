"use client"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const data = [
  {
    id: "INV001",
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "$1,999.00",
    status: "paid",
    date: "2023-01-15",
  },
  {
    id: "INV002",
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "$39.00",
    status: "pending",
    date: "2023-01-16",
  },
  {
    id: "INV003",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "$299.00",
    status: "paid",
    date: "2023-01-17",
  },
  {
    id: "INV004",
    customer: "William Kim",
    email: "will@email.com",
    amount: "$99.00",
    status: "paid",
    date: "2023-01-18",
  },
  {
    id: "INV005",
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "$39.00",
    status: "refunded",
    date: "2023-01-19",
  },
]

export function RevenueTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost">
                Invoice
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Customer
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>
                <div>
                  <div>{invoice.customer}</div>
                  <div className="text-xs text-muted-foreground">{invoice.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.status === "paid" ? "default" : invoice.status === "pending" ? "outline" : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View invoice</DropdownMenuItem>
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Send receipt</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete invoice</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

