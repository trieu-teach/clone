"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const blogs = [
    {
        id: "ingredients",
        title: "Hiểu về các thành phần hoạt tính: Retinol, AHAs và BHAs",
        image: "/images/avarta.jpg",
        author: "Dr. James Davis",
        authorAvatar: "/placeholder.svg",
        date: "10 Tháng 5, 2023",
        readTime: "8 phút đọc",
        content: `Các thành phần hoạt tính đóng vai trò quan trọng trong chăm sóc da. Hiểu cách sử dụng chúng đúng cách có thể tạo ra sự khác biệt lớn trong quy trình dưỡng da của bạn...

        **Retinol**
        Retinol là một thành phần mạnh mẽ được biết đến với lợi ích chống lão hóa. Nó giúp tăng cường sản xuất collagen và đẩy nhanh quá trình tái tạo tế bào...

        **AHAs & BHAs**
        Alpha hydroxy acids (AHAs) và beta hydroxy acids (BHAs) là các chất tẩy tế bào chết hóa học giúp loại bỏ da chết...`
    },
    {
        id: "moisturizers",
        title: "Những loại kem dưỡng ẩm tốt nhất cho từng loại da",
        image: "/images/avartanu.jpg",
        author: "Sarah Lee",
        authorAvatar: "/placeholder.svg",
        date: "5 Tháng 5, 2023",
        readTime: "6 phút đọc",
        content: `Tìm kiếm loại kem dưỡng ẩm hoàn hảo cho loại da của bạn, cho dù bạn có làn da khô, dầu, nhạy cảm hay hỗn hợp...`
    },
    {
        id: "sunscreen",
        title: "Hiểu đúng về kem chống nắng: Những lầm tưởng cần tránh",
        image: "/images/avartanam.jpg",
        author: "Dr. Michael Park",
        authorAvatar: "/placeholder.svg",
        date: "28 Tháng 4, 2023",
        readTime: "7 phút đọc",
        content: `Hãy phân biệt rõ giữa sự thật và ngộ nhận về kem chống nắng. Học về SPF, cách bôi lại và chọn loại kem chống nắng phù hợp cho việc sử dụng hàng ngày.`
    }
];

export default function BlogDetail() {
    const { id } = useParams();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Bài viết không tồn tại.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container py-8 md:py-12">
                <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
                    ← Quay lại Blog
                </Button>
                <section className="mb-12">
                    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                        <Image
                            src={blog.image}
                            alt="Hình ảnh Blog"
                            width={1600}
                            height={800}
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{blog.title}</h1>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={blog.authorAvatar} alt="Tác giả" />
                                        <AvatarFallback>{blog.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{blog.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{blog.readTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <article className="prose max-w-3xl mx-auto">
                    <p>{blog.content}</p>
                </article>
            </main>
        </div>
    );
}