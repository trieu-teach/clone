"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "@/components/data-table/table-pagination";
import { RowSelectionState, TablePaginationProps } from "@next-server-actions/types";
import { useToast } from "@/lib/custom-hooks"
import { Selection } from "@next-server-actions/types";
import { Order } from "@/schemas/orderSchema";

export default function ExampleTablePage() {
    const [data, setData] = useState<Order[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [paginationData, setPaginationData] = useState<TablePaginationProps>({
        page: 1,
        limit: 5,
    });
    const [sortData, setSortData] = useState<{ sortBy: string; sortOrder: string } | null>({
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [rowSelection, setRowSelection] = useState({});
    const [stringFilterDebauced, setStringFilterDebauced] = useState<string>("")



    const fetchData = async (
        filters: any = {},
        page: number = 1,
        limit: number = 5,
        sortBy: string = "createdAt",
        sortOrder: string = "desc"
    ) => {
        try {
            const filterQuery = Object.keys(filters)
                .map((key) => `${key}=${filters[key]}`)
                .join("&");
            const response = await fetch(`/api/order?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${filterQuery ? "&" + filterQuery : ""}`)
            const rawData = await response.json();
            const orderData = {
                ...rawData,
                sortBy,
                sortOrder,
                data: rawData.data.map((item: any) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                })),
            };
            const { data, ...pagination } = orderData;
            setPaginationData(pagination);
            setData(orderData.data);
        } catch (error) {
        }
    };


    useEffect(() => {
        const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
        setPaginationData((prev) => ({ ...prev, page: 1 }));
        fetchData({ name: stringFilterDebauced }, 1, paginationData.limit, sortBy, sortOrder);
        console.log(sortData, paginationData.limit, stringFilterDebauced)
    }, [sortData, paginationData.limit, stringFilterDebauced]);

    useEffect(() => {
        const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
        fetchData({ name: stringFilterDebauced }, paginationData.page, paginationData.limit, sortBy, sortOrder);
    }, [paginationData.page]);

    useEffect(() => {
        if (data.length > 0) {
            data.map((item: Order, index) => {
                if (selectedRows.has(item._id.toString())) {
                    setRowSelection((prev: RowSelectionState) => ({ ...prev, [index]: true }));
                } else {
                    setRowSelection((prev: RowSelectionState) => {
                        const newSelection = { ...prev };
                        delete newSelection[index];
                        return newSelection;
                    });
                }
            });
        }
    }, [data, selectedRows]);

    // useEffect(() => {fetchCategoryData()},[category,data])

    const handleRowSelectionChange = (rowId: string, isSelected: boolean) => {
    };

    const handleDeleteProduct = async (orderId: string) => {
    };
    const handleToggleStatus = async (orderId: string) => {
    };

    const handleToggleMultipleStatus = async (orderIds: string[]) => {
    };

    const handleDeleteMultipleProduct = async (orderIds: string[]) => {
    };
    const columns = createColumns<Order>(
        [
            {
                accessorKey: "_id",
                enableSorting: false,
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
                        onCheckedChange={(value) => {
                            table.toggleAllRowsSelected(!!value);
                            if (value) {
                                table
                                    .getRowModel()
                                    .rows.forEach((row: any) =>
                                        setSelectedRows((prev) => new Set([...prev, row.original._id]))
                                    );
                            } else {
                                table.getRowModel().rows.forEach((row: any) =>
                                    setSelectedRows((prev) => {
                                        prev.delete(row.original._id);
                                        return new Set(prev);
                                    })
                                );
                            }
                        }}
                    />
                ),

                cell: ({ row }) => (
                    <Checkbox
                        checked={selectedRows.has(row.original._id)}
                        onCheckedChange={(value) => {
                            handleRowSelectionChange(row.original._id, !!value);
                        }}
                    />
                ),
            },
            {
                accessorKey: "customer_id",
                header: "Mã khách hàng",
                enableSorting: true,
            },
            {
                accessorKey: "order_date",
                header: "Ngày đặt hàng",
                enableSorting: true,
            },
            {
                accessorKey: "total_amount",
                header: "Tổng tiền",
                enableSorting: true,
                cell: ({ row }) => row.original.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "discounted_amount",
                header: "Tiền giảm giá",
                enableSorting: true,
                cell: ({ row }) => row.original.discounted_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "promotion_id",
                header: "Mã khuyến mãi",
                enableSorting: true,
                cell: ({ row }) => row.original.promotion_id ? <Badge variant="default">row.original.promotion_id</Badge> :<Badge variant="destructive">none</Badge>
            },
            {
                accessorKey: "final_amount",
                header: "Tổng tiền sau giảm",
                enableSorting: true,
                cell: ({ row }) => row.original.final_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "shippingAddress",
                header: "Địa chỉ giao hàng",
                enableSorting: true,
                cell: ({ row }) => row.original.shippingAddress.detail
            },
            {
                accessorKey: "status",
                header: "",
                enableSorting: true,
            },
            {
                accessorKey: "payment_method",
                header: "Phương thức thanh toán",
                enableSorting: true,
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
                enableSorting: true,
            },
            {
                accessorKey: "updatedAt",
                header: "Updated At",
                cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
                enableSorting: true,
            },
        ],
        {
            header: [
                {
                    accessorKey: "toggleStatus",
                    title: "Toggle Status",
                    action: (items: Order[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleToggleMultipleStatus(itemsId);
                    },
                },
                {
                    accessorKey: "onDelete",
                    title: "Delete items",
                    resetSelectedRows: true,
                    action: (items: Order[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleDeleteMultipleProduct(itemsId);
                    },
                },
            ],
            cellRenderers: [
                {
                    accessorKey: "onEdit",
                    title: "Edit",
                    action: (item) => {
                        console.log("Edit item:", item);
                        // Implement edit logic
                    },
                },
                {
                    accessorKey: "toggleStatus",
                    title: "Toggle Status",
                    action: (item) => {
                        handleToggleStatus(item._id);
                    },
                },
                {
                    accessorKey: "onDelete",
                    title: "Delete",
                    action: (item) => {
                        handleDeleteProduct(item._id);
                    },
                },
            ],
        },
        setSortData,
        sortData
    );

    const filterableColumns = [
        {
            id: "name",
            title: "Full Name",
            isStringFilter: true,
        },
    ];

    return (
        <div className="bg-white border-2 border-dashed rounded-xl mx-auto mt-10 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Order table</h1>
            </div>
            <div className="border-2 border-dashed my-2" />
            <DataTable
                columns={columns}
                data={data}
                filterableColumns={filterableColumns}
                setRowSelection={setRowSelection}
                rowSelection={rowSelection}
                sortData={sortData}
                setSortData={setSortData}
                stringFilterDebauced={stringFilterDebauced}
                setStringFilterDebauced={setStringFilterDebauced}

            />
            <TablePagination
                data={paginationData}
                getCallBack={setPaginationData}
                numberOfSelectedRows={selectedRows.size}
            />
        </div>
    );
}
