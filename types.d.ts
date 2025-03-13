import { Customer } from "@/schemas/customerSchema";

// Update the DataTableProps type
interface FilterDataTableProps<TData, TValue> {
    table: Table<unknown>
    filterColumn: FilterableColumn[];
    stringFilterDebauced: string
    setStringFilterDebauced: (value) => void
}

// Define the FilterableColumn type
interface BaseFilterableColumn {
    id: string;
    title: string;
}

type FilterableColumn =
    | (BaseFilterableColumn & { isStringFilter: boolean; options?: never })
    | (BaseFilterableColumn & { options: { label: string; value: string }[]; isStringFilter?: never });

interface RowSelectionState {
    [key: string]: boolean;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterableColumns?: FilterableColumn[];
    rowSelection: RowSelectionState
    setRowSelection: (value) => void
    sortData,
    setSortData: (value) => void
    stringFilterDebauced,
    setStringFilterDebauced
}

interface ColumnConfig<T> {
    accessorKey: keyof T
    header: string | ((props: { table: any }) => JSX.Element)
    cell?: (info: any) => React.ReactNode
    enableSorting?: boolean
}

interface ActionColumnConfig {
    header?: (ActionRenderers<T> & { resetSelectedRows?: boolean })[];
    cellRenderers?: ActionRenderers<T>[]
}

interface ActionRenderers<T> {
    accessorKey: keyof T
    title: string,
    action: (T: any) => void
}

interface TablePaginationProps {
    page: number
    limit: number
    totalDocs?: number
    totalPages?: number
}

interface FormState {
    message: string;
    success: boolean;
    formData?: FormData;
}


type Selections = {
    value: string;
    name: string;
  };
  
  type formField<T> = {
    name: keyof z.infer<typeof T>;
    label: string;
    type: string;
    placeholder?: string;
    selections?: Selections[];
  };

