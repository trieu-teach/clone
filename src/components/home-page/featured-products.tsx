"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { zProductSchemaUdate } from "@/schemas/productSchema";
import { z } from "zod";
import { PaginationedData } from "@next-server-actions/types";
import AddToCartButton from "../AddToCartButton";

export function FeaturedProducts() {
    const [products, setProducts] = useState<z.infer<typeof zProductSchemaUdate>[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/product?limit=4");
                if (!res.ok) {
                    throw new Error(`Failed to fetch products: ${res.statusText}`);
                }
                const data: PaginationedData<z.infer<typeof zProductSchemaUdate>> = await res.json();
                setProducts(data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length < 4 && !isLoading) {
            const mirrorProducts = () => {
                const mirroredProducts = [...products];
                while (mirroredProducts.length < 4) {
                    const randomIndex = Math.floor(Math.random() * products.length);
                    mirroredProducts.push({ ...products[randomIndex], _id: `${products[randomIndex]._id}-mirror-${mirroredProducts.length}` });
                }
                setProducts(mirroredProducts);
            };
            mirrorProducts();
        }
    }, [products, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, key) => (
                <Card key={key} className="flex-shrink-0 w-full bg-white">
                    <CardContent className="p-3">
                        <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="rounded-lg object-cover w-full aspect-square mb-4 cursor-pointer"
                            width={150}
                            height={150}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                            }}
                        />
                        <h3 className="font-semibold text-md mb-2 cursor-pointer">
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            {product.description}
                        </p>
                        <AddToCartButton product={product} />
                        
                    </CardContent>
                </Card>
            ))}
        </div>

    )
}
