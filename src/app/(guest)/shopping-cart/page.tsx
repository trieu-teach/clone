"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash, Pencil } from "lucide-react"
import { useCart } from "@/lib/custom-hooks";
import Image from "next/image";
import { z } from "zod";
import { zCategorySchemaUdate } from "@/schemas/categorySchema";


export default function ShoppingCart() {
  const { items, setQuantity, removeItem } = useCart()
  const [categories, setCategories] = useState <z.infer<typeof zCategorySchemaUdate>[]>([])
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
  const shippingCost = 12.0;
  const discount = 10.0;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost - discount + tax;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Chi Tiết Giỏ Hàng</h2>

      <Card>
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
              {items.map((item,key) => (
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
                        setQuantity(item.product._id as string,newQuantity)
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

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p>Áp dụng mã giảm giá!</p>
              <div className="flex items-center mt-2">
                <Input placeholder="Mã giảm giá" className="mr-2" />
                <Button>Áp dụng</Button>
              </div>
            </div>
            <div>
              <p>Tổng tiền hàng: {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p>Phí vận chuyển: {shippingCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p>Giảm giá: -{discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p>Thuế (18%): {tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p className="text-lg font-bold">Tổng cộng: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => (window.location.href = "/skinstore-page")}>Tiếp tục mua sắm</Button>
            <Button onClick={() => (window.location.href = "/checkout")}>Tiến hành thanh toán</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
