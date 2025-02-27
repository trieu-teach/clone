"use client"; // Đánh dấu component là Client Component

import Link from "next/link";
import { Leaf, ShoppingCart, User, Search } from "lucide-react";
import { useState } from "react"; // Import useState để quản lý state
import { Button } from "./ui/button";
import { Input } from "./ui/input";


export default function Header() {
  // State để kiểm soát dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hàm xử lý khi bấm vào biểu tượng Đăng Nhập
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      {/* Logo */}
      <Link className="flex items-center justify-center" href="/">
        <Leaf className="h-6 w-6" />
        <span className="sr-only">Chăm Sóc Da Glow</span>
      </Link>

      {/* Navigation */}
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {/* Nút Trang Chủ */}
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/"
        >
          Trang Chủ
        </Link>

        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/skinstore-page"
        >
          Cửa Hàng
        </Link>
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/blog-page"
        >
          Blog
        </Link>
        <Link
          className="text-sm font-medium hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-2 py-1 rounded-md"
          href="/guest/dictionary-page"
        >
          Từ Điển
        </Link>

        {/* Tìm kiếm và Button */}
        <div className="relative flex items-center">
          <Input
            type="text"
            className="text-sm px-4 py-1 h-8"
            placeholder="Tìm kiếm..."
          />
          {/* Button tìm kiếm với biểu tượng */}
          <Button
            type="button"
            className="absolute right-0 top-0 bottom-0 rounded-tl-none rounded-bl-none h-8 w-8 px-4 py-1"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Giỏ hàng */}
        <Link
          href="#"
          className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Giỏ Hàng</span>
        </Link>

        {/* Dropdown menu cho Đăng Nhập */}
        <div className="relative">
          <button
            className="flex items-center justify-center hover:bg-gray-300 focus:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 p-2 rounded-md"
            onClick={toggleDropdown} // Bấm vào để toggle dropdown
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Đăng Nhập</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-md z-10">
              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
