"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetail() {
    const [selectedModel, setSelectedModel] = useState("oculus-go");
    const [selectedColor, setSelectedColor] = useState("gray");
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");

    const models = [
        { id: "oculus-go", name: "Oculus Go", image: "" },
        { id: "oculus-quest", name: "Oculus Quest", image: "" },
        { id: "oculus-rift-s", name: "Oculus Rift S", image: "" },
    ];

    const colors = ["gold", "red", "gray"];

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center bg-black text-white py-4 rounded-lg">Product Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="w-full h-[500px] bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                    <Image src="https://via.placeholder.com/500" alt="Product Image" width={500} height={500} className="object-cover" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Oculus VR</h3>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={i < 4 ? "text-yellow-400" : "text-gray-400"} />
                        ))}
                        <span className="text-gray-500 text-sm">(449 customer reviews)</span>
                    </div>
                    <h4 className="font-semibold mt-4">Select Your Oculus</h4>
                    <div className="flex gap-4 mt-2">
                        {models.map((model) => (
                            <Card key={model.id} className={`cursor-pointer ${selectedModel === model.id ? "border-blue-500" : "border-gray-300"}`} onClick={() => setSelectedModel(model.id)}>
                                <CardContent className="flex flex-col items-center p-4">
                                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                        {model.image && <Image src={model.image} alt={model.name} width={75} height={75} />}
                                    </div>
                                    <p className="text-center mt-2">{model.name}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <h4 className="font-semibold mt-4">Select Color</h4>
                    <div className="flex gap-2 mt-2">
                        {colors.map((color) => (
                            <button key={color} className={`w-8 h-8 rounded-full ${selectedColor === color ? "ring-2 ring-white" : ""}`} style={{ backgroundColor: color }} onClick={() => setSelectedColor(color)}></button>
                        ))}
                    </div>
                    <h4 className="font-semibold mt-4">Price</h4>
                    <p className="text-xl font-bold">$149 USD <span className="line-through text-gray-500 ml-2">$179 USD</span></p>
                    <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                        <span>{quantity}</span>
                        <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" className="flex items-center gap-1">
                            <Heart className="w-4 h-4" /> Add to Wishlist
                        </Button>
                        <Button className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
            <Tabs defaultValue="reviews" className="mt-8">
                <TabsList>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews">
                    <h4 className="font-semibold mt-4">Customer Reviews</h4>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="text-yellow-400" />
                        ))}
                        <span className="text-sm">4.5/5 (Based on 1000 reviews)</span>
                    </div>
                    <div className="mt-4">
                        {[...Array(5)].map((_, i) => (
                            <button key={i} onClick={() => setRating(i + 1)}>
                                <Star className={i < rating ? "text-yellow-400" : "text-gray-400"} />
                            </button>
                        ))}
                        <span className="ml-2">{rating} / 5</span>
                    </div>
                    <Textarea className="mt-4" placeholder="Write a review..." value={comments} onChange={(e) => setComments(e.target.value)} />
                    <Button className="mt-4">Submit Review</Button>
                </TabsContent>
                <TabsContent value="description">A good fit for many households...</TabsContent>
                <TabsContent value="about">The build quality feels really premium...</TabsContent>
            </Tabs>
        </div>
    );
}
