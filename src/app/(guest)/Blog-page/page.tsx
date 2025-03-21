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
                    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                        <Image
                            src="/placeholder.svg?height=800&width=1600"
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
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg" alt="Author" />
                                        <AvatarFallback>DR</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">Dr. Emma Roberts</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>May 15, 2023</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span>8 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-12 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
                        <div className="grid gap-6">
                            <Card>
                                <div className="flex flex-col md:flex-row">
                                    <div className="relative h-48 w-full md:h-auto md:w-1/3">
                                        <Image
                                            src="/placeholder.svg?height=400&width=600"
                                            alt="Skincare ingredients"
                                            fill
                                            className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-t-none"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <CardHeader className="p-0 pb-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline">Ingredients</Badge>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>May 10, 2023</span>
                                                </div>
                                            </div>
                                            <CardTitle className="mt-2 text-xl">
                                                Understanding Active Ingredients: Retinol, AHAs, and BHAs
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 py-3">
                                            <p className="text-muted-foreground">
                                                Dive deep into the science behind popular active ingredients and learn how to incorporate them
                                                into your routine for maximum benefits without irritation.
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between p-0 pt-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src="/placeholder.svg" alt="Author" />
                                                    <AvatarFallback>JD</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">Dr. James Davis</span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Read More
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="flex flex-col md:flex-row">
                                    <div className="relative h-48 w-full md:h-auto md:w-1/3">
                                        <Image
                                            src="/placeholder.svg?height=400&width=600"
                                            alt="Moisturizers"
                                            fill
                                            className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-t-none"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <CardHeader className="p-0 pb-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline">Products</Badge>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>May 5, 2023</span>
                                                </div>
                                            </div>
                                            <CardTitle className="mt-2 text-xl">The Best Moisturizers for Every Skin Type</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 py-3">
                                            <p className="text-muted-foreground">
                                                Find the perfect moisturizer for your skin type, whether you're dealing with dryness, oiliness,
                                                sensitivity, or a combination of concerns.
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between p-0 pt-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src="/placeholder.svg" alt="Author" />
                                                    <AvatarFallback>SL</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">Sarah Lee</span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Read More
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="flex flex-col md:flex-row">
                                    <div className="relative h-48 w-full md:h-auto md:w-1/3">
                                        <Image
                                            src="/placeholder.svg?height=400&width=600"
                                            alt="Sunscreen"
                                            fill
                                            className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-t-none"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <CardHeader className="p-0 pb-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline">Sun Protection</Badge>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>April 28, 2023</span>
                                                </div>
                                            </div>
                                            <CardTitle className="mt-2 text-xl">Sunscreen Myths Debunked: What You Need to Know</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0 py-3">
                                            <p className="text-muted-foreground">
                                                Separate fact from fiction when it comes to sun protection. Learn about SPF, reapplication, and
                                                how to choose the right sunscreen for daily use.
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between p-0 pt-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src="/placeholder.svg" alt="Author" />
                                                    <AvatarFallback>MP</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">Dr. Michael Park</span>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                Read More
                                            </Button>
                                        </CardFooter>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Button variant="outline">Load More Articles</Button>
                        </div>
                    </div>


                </div>
            </main>

        </div>
    )
}

