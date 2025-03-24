"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { AlertCircle, Trash } from "lucide-react";
import { useCart, useToast } from "@/lib/custom-hooks";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";
import { z } from "zod";
import SignupPage from "../signup/page";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { Address, AddressSchema, Customer, zCustomerSchemaUdate } from "@/schemas/customerSchema";
import { Order, OrderSchema } from "@/schemas/orderSchema";
import { OrderDetailSchema } from "@/schemas/orderDetailSchema";
import { checkOutOrder } from "@/actions/orderActions";
import SearchableSelect from "@/components/searchable-select";
import addressData from "@/data/address.json";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AddressSelection({ addresses, selectedAddress, onSelectAddress }: { addresses: Address[], selectedAddress?: Address, onSelectAddress: (address: Address) => void }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-medium">Địa Chỉ Của Tôi</h2>
      </div>
      <RadioGroup value={JSON.stringify(selectedAddress)} onValueChange={(value) => {
        const address = JSON.parse(value) as Address;
        onSelectAddress(address)
      }} className="space-y-4">
        {addresses.map((address, index) => (
          <Card key={index} className="border rounded-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start p-4 gap-3">
                <RadioGroupItem value={JSON.stringify(address)} id={`address-${index}`} className="mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-muted-foreground">{address.phone}</div>
                    </div>
                    <span className="text-blue-500 text-sm">Cập nhật</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {addressData.province.find(p => p.idProvince === address.provinceId)?.name}
                    <br />
                    {addressData.district.find(d => d.idDistrict === address.districtId)?.name}
                    <br />
                    {addressData.commune.find(c => c.idCommune === address.communeId)?.name}
                    <br />
                    {address.detail}
                  </div>
                  <div className="mt-2">
                    {address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Mặc định
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function CheckoutPage() {
  const { status, data: session } = useSession();
  const { items, setQuantity, removeItem } = useCart()
  const [categories, setCategories] = useState<z.infer<typeof zCategorySchemaUdate>[]>([])
  const [order, setOrder] = useState<z.infer<typeof OrderSchema> | null>()
  const [orderDetail, setOrderDetail] = useState<z.infer<typeof OrderDetailSchema>[] | null>()
  const [shippingAddress, setShippingAddress] = useState<z.infer<typeof AddressSchema> | null>()

  const AddressComponent = useMemo(() => {
    if (status === "authenticated") {
      if (session?.user) {
        const addresses = (session.user as Customer).addresses;
        if (addresses && addresses.length > 0) {
          return (
            <AddressSelection
              addresses={addresses}
              onSelectAddress={(address) => setShippingAddress(address)}
              selectedAddress={addresses.find((address) => address.isDefault)}
            />
          );
        }
        
      }
    }
    return <SignupPage />
  }, [status, session]);

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


  const subtotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  )
  const discount = 10000;
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [shippingCost, setShippingCost] = useState(12000);
  const taxRate = 0.18;
  const provinceSelections = useMemo(() => {
    return addressData.province.map((value) => ({
      label: value.name,
      value: value.idProvince
    }))
  }, [])

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
      tax_amount: subtotal * taxRate,
      customer_id: (session?.user as z.infer<typeof zCustomerSchemaUdate>)?._id
    }
    const newOrderDetail = items.map((item) => {
      return {
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
                <RadioGroupItem value="cash_on_delivery" /> Thanh toán khi nhận hàng
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="momo" />momo
              </Label>
            </RadioGroup>
            <Button className="w-full mt-4" onClick={handleCheckout}>Thanh toán ngay</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
