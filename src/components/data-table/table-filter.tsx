"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { FilterDataTableProps } from "@next-server-actions/types"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/custom-hooks"

export function TableFilter<TData, TValue>({ table, filterColumn, stringFilterDebauced, setStringFilterDebauced}: FilterDataTableProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const optionFilterArray = filterColumn.filter((filter) => filter.options)
  const stringFilterArray = filterColumn.filter((filter) => filter.isStringFilter)
  const [stringFilter, setStringFilter] = useState<string>("")
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault
    setStringFilter(e.target.value)
  }
  useDebounce(()=>setStringFilterDebauced(stringFilter), 500,[stringFilter])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {stringFilterArray.map((filter, index) => {
          return (
            <Input
              key={index}
              placeholder={`Filter by ${filter.title}...`}
              value={stringFilter}
              onChange={handleOnChange}
              className="h-9 w-[150px] lg:w-[250px]"
            />
          )
        })}
        {optionFilterArray.map((filter, index) => {
          return table.getColumn(filter.id) && (
            <DataTableFacetedFilter
              key={index}
              column={table.getColumn(filter.id)}
              title={filter.title}
              options={filter.options ?? []}
            />
          )
        })}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-9 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

