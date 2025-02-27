"use client"; // Đánh dấu component là Client Component

import Link from "next/link";
import { Leaf, ShoppingCart, User, Search } from "lucide-react";
import { useState } from "react"; // Import useState để quản lý state
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const link = [
  {
    title: "Trang Chủ",
    link: "/"
  },
  {
    title: "Cửa Hàng",
    link: "/skinstore-page"
  },
  {
    title: "Blog",
    link: "/blog-page"
  },
  {
    title: "Từ Điển",
    link: "/dictionary-page"
  },
]

const dropdown = [
  {
    title: "Đăng Nhập",
    link: "/login"
  },
  {
    title: "Đăng Ký",
    link: "/signup"
  },
]

export default function Header() {
  // State để kiểm soát dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hàm xử lý khi bấm vào biểu tượng Đăng Nhập
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center">
      {/* Logo */}
      <Link className="flex items-center justify-center" href="/">
        <Leaf className="h-6 w-6" />
        <span className="sr-only">Chăm Sóc Da Glow</span>
      </Link>

      {/* Navigation */}
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {/* Nút Trang Chủ */}
        {link.map((item, index) => (
          <Link
            className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
            href={item.link}
            key={index}>
            {item.title}
          </Link>
        ))}

        {/* Tìm kiếm và Button */}
        <div className="relative flex items-center">
          <Input
            type="text"
            className="text-sm px-4 py-1 h-8"
            placeholder="Tìm kiếm..."
          />
          {/* Button tìm kiếm với biểu tượng */}
          <Link href="/search">
            <Button
              type="button"
              className="absolute right-0 top-0 bottom-0 rounded-tl-none rounded-bl-none h-8 w-8 px-4 py-1"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Giỏ hàng */}
        <Link
          href="/shopping-cart"
          className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Giỏ Hàng</span>
        </Link>

        {/* Dropdown menu cho Đăng Nhập */}
        <div className="relative">
          <Button
            className="flex items-center justify-center w-8 hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
            onClick={toggleDropdown} // Bấm vào để toggle dropdown
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Đăng Nhập</span>
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {dropdown.map((item, index) => (
                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  href={item.link}
                  key={index}>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
