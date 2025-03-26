import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SkincareBlog() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container py-8 md:py-12">
                <section className="mb-12">
                    <Link href="/blog-detail/featured">
                        <div className="relative h-[400px] w-full overflow-hidden rounded-lg cursor-pointer">
                            <Image
                                src="/images/blog1.jpg"
                                alt="Featured skincare article"
                                width={1600}
                                height={800}
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <Badge className="mb-2 bg-primary text-primary-foreground">Featured</Badge>
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">The Ultimate Guide to Building a Skincare Routine</h1>
                                <p className="mb-4 max-w-2xl text-sm md:text-base">
                                    Learn how to create a personalized skincare routine that addresses your specific concerns and helps you
                                    achieve healthy, glowing skin.
                                </p>
                            </div>
                        </div>
                    </Link>
                </section>

                <div className="grid gap-12 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
                        <div className="grid gap-6">
                            {[ 
                                { id: "ingredients", img: "/images/avarta.jpg", title: "Understanding Active Ingredients: Retinol, AHAs, and BHAs", date: "May 10, 2023", author: "Dr. James Davis", fallback: "JD" },
                                { id: "moisturizers", img: "/images/avartanu.jpg", title: "The Best Moisturizers for Every Skin Type", date: "May 5, 2023", author: "Sarah Lee", fallback: "SL" },
                                { id: "sunscreen", img: "/images/avartanam.jpg", title: "Sunscreen Myths Debunked: What You Need to Know", date: "April 28, 2023", author: "Dr. Michael Park", fallback: "MP" }
                            ].map((blog) => (
                                <Card key={blog.id}>
                                    <div className="flex flex-col md:flex-row">
                                        <Link href={`/blog-detail/${blog.id}`} className="relative h-48 w-full md:h-auto md:w-1/3 cursor-pointer">
                                            <Image
                                                src={blog.img}
                                                alt={blog.title}
                                                fill
                                                className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-t-none"
                                            />
                                        </Link>
                                        <div className="flex-1 p-6">
                                            <CardHeader className="p-0 pb-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge variant="outline">Category</Badge>
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" />
                                                        <span>{blog.date}</span>
                                                    </div>
                                                </div>
                                                <CardTitle className="mt-2 text-xl">{blog.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0 py-3">
                                                <p className="text-muted-foreground">Short description of the blog...</p>
                                            </CardContent>
                                            <CardFooter className="flex items-center justify-between p-0 pt-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="/placeholder.svg" alt="Author" />
                                                        <AvatarFallback>{blog.fallback}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs">{blog.author}</span>
                                                </div>
                                                <Link href={`/blog-detail/${blog.id}`}>
                                                    <Button variant="ghost" size="sm">Read More</Button>
                                                </Link>
                                            </CardFooter>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Link href="/blog-detail">
                                <Button variant="outline">Load More Articles</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
