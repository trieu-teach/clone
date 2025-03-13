"use client"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TablePaginationProps } from "@next-server-actions/types"

export function TablePagination({data, getCallBack, numberOfSelectedRows = 0}: {data: TablePaginationProps, getCallBack: ({page , limit }: {page: number, limit: number}) => void, numberOfSelectedRows: number}) {
  
  return (
    <div className="flex items-center justify-between px-2">
    <div className="flex-1 text-sm text-muted-foreground">
      {numberOfSelectedRows} of {data.totalDocs} row(s) selected.
    </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${data.limit}`}
            onValueChange={(value) =>getCallBack({page:1,limit:Number(value)})}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={data.limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {data.page} of {data.totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>getCallBack({page:1,limit:data.limit})}
            disabled={data.page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => getCallBack({page:data.page - 1,limit:data.limit})}
            disabled={data.page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => getCallBack({page:data.page + 1,limit:data.limit})}
            disabled={data.page === data.totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => getCallBack({page:data.totalPages||1,limit:data.limit})}
            disabled={data.page === data.totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

