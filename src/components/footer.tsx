import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t">
      {/* About Us Section */}
      <div className=" mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 items-center">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Về Chúng Tôi"
            className="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            width={400}
            height={300}
          />
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Về Chúng Tôi</h2>
            <p className="max-w-[600px] md:text-lg text-gray-300">
              Chúng tôi tin tưởng vào sức mạnh của thiên nhiên trong việc cải thiện làn da. Các sản phẩm của chúng tôi
              được chế tác cẩn thận, chỉ sử dụng các thành phần tự nhiên tốt nhất để nuôi dưỡng và tái tạo làn da của
              bạn.
            </p>
            <Button className="w-fit text-sm">Tìm Hiểu Thêm</Button>
          </div>
        </div>
      </div>

      {/* Copyright and Links Section */}
      <div className=" mx-auto px-4 md:px-6 py-4 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2024 Chăm Sóc Da Glow. Mọi quyền được bảo lưu.</p>

          <nav className="flex gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-gray-300" href="#">
              Điều Khoản Dịch Vụ
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-gray-300" href="#">
              Chính Sách Bảo Mật
            </Link>
          </nav>

          <div className="flex gap-6">
            <Link href="#" className="text-gray-300 hover:text-blue-500 transition-colors" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-pink-500 transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

