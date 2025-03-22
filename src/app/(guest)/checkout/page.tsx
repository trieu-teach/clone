"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Trash } from "lucide-react";
import { useCart, useToast } from "@/lib/custom-hooks";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";
import { z } from "zod";
import SignupPage from "../signup/page";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { AddressSchema, zCustomerSchemaUdate } from "@/schemas/customerSchema";
import { Order, OrderSchema } from "@/schemas/orderSchema";
import { OrderDetailSchema } from "@/schemas/orderDetailSchema";
import { checkOutOrder } from "@/actions/orderActions";



export default function CheckoutPage() {
    const { status, data: session } = useSession();
    const { items, setQuantity, removeItem } = useCart()
    const [categories, setCategories] = useState<z.infer<typeof zCategorySchemaUdate>[]>([])
    const [shippingAddress, setShippingAddress] = useState<z.infer<typeof AddressSchema> | null>()
    const [order, setOrder] = useState<z.infer<typeof OrderSchema> | null>()
    const [orderDetail, setOrderDetail] = useState<z.infer<typeof OrderDetailSchema>[] | null>()
    const subtotal = items.reduce(
        (total, { product }) => total + product.price,
        0
    )
    const discount = 10000;
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [shippingCost, setShippingCost] = useState(12000);
    const taxRate = 0.18;
    useEffect(() => {
        fetch("/api/category")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.data)
            })
            .catch((err) => {
                console.error(err)
            })

    }, [])
    useMemo(() => {
        if ((session?.user as z.infer<typeof zCustomerSchemaUdate>)?.address) setShippingAddress((session?.user as z.infer<typeof zCustomerSchemaUdate>)?.address)
    }, [session]);

    const AddressComponent = useMemo(() => {
        if (status === "authenticated") {
        }
        return <SignupPage />
    }, [status, session]);



    // Tính tổng giá trị đơn hàng
    const total = subtotal + shippingCost - discount + subtotal * taxRate;
    const handleCheckout = async () => {
        const formData = new FormData();
        const newOrder = {
            shippingAddress: shippingAddress,
            status: "pending",
            total_amount: total,
            final_amount: total - discount,
            payment_method: "cash",
            discounted_amount: discount,
            shipping_cost: shippingCost,
            tax_rate: taxRate,
            customer_id:(session?.user as z.infer<typeof zCustomerSchemaUdate>)?._id
        }
        const newOrderDetail = items.map((item) => {
            return{
                product_id: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }
        })
        formData.append("order", JSON.stringify(newOrder));
        formData.append("orderDetail", JSON.stringify(newOrderDetail));
        const result = await checkOutOrder(formData)
        if (result.message) useToast(result.message)
    }

    return (
        <>
            <div className="p-6 bg-white rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h2>
                <Card className="mb-6">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>ẢNH SẢN PHẨM</TableCell>
                                    <TableCell>TÊN SẢN PHẨM</TableCell>
                                    <TableCell>DANH MỤC</TableCell>
                                    <TableCell>SỐ LƯƠNG</TableCell>
                                    <TableCell>GIÁ</TableCell>
                                    <TableCell>XÓA</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            <div className="w-[50px] h-[50px] rounded-lg bg-gray-300 flex items-center justify-center overflow-hidden">
                                                <Image
                                                    src={item.product.image_url || "/placeholder.svg"}
                                                    alt={item.product.name}
                                                    className="rounded-lg object-cover w-full aspect-square mb-8 cursor-pointer"
                                                    width={150}
                                                    height={150}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.svg";
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell>{categories.find((category) => category._id === item.product.category_id)?.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const newQuantity = Number.parseInt(e.target.value);
                                                    setQuantity(item.product._id as string, newQuantity)
                                                }}
                                                className="w-16"
                                            />
                                        </TableCell>
                                        <TableCell>{item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                        <TableCell>
                                            <Button variant="destructive" onClick={() => removeItem(item.product._id as string)} size="icon">
                                                <Trash size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent>
                            <SignupPage />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                            <div className="flex justify-between"><span>Tổng giá trị đơn hàng:</span> <span>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                            <div className="flex justify-between text-red-500"><span>Phí vận chuyển:</span> <span>{shippingCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                            <div className="flex justify-between text-green-500"><span>Giảm giá:</span> <span>-{discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                            <div className="flex justify-between"><span>Thuế (18%):</span> <span>{(subtotal * taxRate).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                            <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Tổng thanh toán:</span> <span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardContent>
                        <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
                        <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                            <Label className="flex items-center gap-2">
                                <RadioGroupItem value="credit" /> Thẻ tín dụng/Ghi nợ
                            </Label>
                            <Label className="flex items-center gap-2">
                                <RadioGroupItem value="banking" /> Chuyển khoản ngân hàng
                            </Label>
                        </RadioGroup>
                        {paymentMethod === "credit" ? (
                            <>
                                <Input placeholder="Số thẻ" className="mt-2" />
                                <Input placeholder="Ngày hết hạn" type="date" className="mt-2" />
                                <Input placeholder="CVV" className="mt-2" />
                            </>
                        ) : (
                            <>
                                <Input placeholder="Tên chủ tài khoản" className="mt-2" />
                                <Input placeholder="Số tài khoản" className="mt-2" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Ngân hàng" />
                                    <Input placeholder="Mã IFC" />
                                </div>
                            </>
                        )}
                        <Button className="w-full mt-4" onClick={handleCheckout}>Thanh toán ngay</Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
