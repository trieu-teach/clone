"use client"

import { useState } from "react"
import { ChevronDown, Grid, ListIcon, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const filters = [
  { id: "categories", label: "Categories", options: ["Electronics", "Clothing", "Home", "Books"] },
  { id: "size", label: "Select Size", options: ["S", "M", "L", "XL"] },
  { id: "color", label: "Select Color", options: ["Red", "Blue", "Green", "Black"] },
  { id: "price", label: "Pricing Range", options: ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"] },
  { id: "rating", label: "Select Rating", options: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"] },
]

// Mock product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
    description: "Soft, breathable cotton t-shirt available in multiple colors.",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    description: "Advanced smartwatch with health tracking and notifications.",
  },
  {
    id: 4,
    name: "Desk Lamp",
    category: "Home",
    price: 49.99,
    rating: 4.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Adjustable LED desk lamp with multiple brightness levels.",
  },
  {
    id: 5,
    name: "Bestselling Novel",
    category: "Books",
    price: 15.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    description: "The latest bestselling fiction novel everyone's talking about.",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 79.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    description: "Portable waterproof bluetooth speaker with 12-hour battery life.",
  },
]

export default function Page() {
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({})
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // If no filters are selected, show all products
    if (Object.keys(selectedFilters).length === 0) return true

    // Check if product matches all selected filters
    for (const [filterId, selectedOption] of Object.entries(selectedFilters)) {
      switch (filterId) {
        case "categories":
          if (product.category !== selectedOption) return false
          break
        case "price":
          const [min, max] = selectedOption.replace("$", "").split(" - $").map(Number)
          if (product.price < min || (max && product.price > max)) return false
          break
        case "rating":
          const ratingValue = Number.parseInt(selectedOption.split(" ")[0])
          if (Math.floor(product.rating) < ratingValue) return false
          break
        // Add other filter types as needed
      }
    }
    return true
  })

  const toggleFilter = (id: string) => {
    setOpenFilter((prev) => (prev === id ? null : id))
  }

  const handleSelectOption = (filterId: string, option: string) => {
    setSelectedFilters((prev) => ({ ...prev, [filterId]: option }))
    setOpenFilter(null)
  }

  const resetFilters = () => {
    setSelectedFilters({})
  }

  return (
    <div className="min-h-screen mt-5 text-gray-900 p-6">
      <div className=" mx-auto flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
            <span className="font-medium">Filter</span>
            <Button
              variant="secondary"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>

          {filters.map((filter) => (
            <div key={filter.id} className="w-full bg-white shadow rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleFilter(filter.id)}
              >
                <span className="block">{filter.label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openFilter === filter.id ? "rotate-180" : ""}`}
                />
              </div>

              {openFilter === filter.id && (
                <div className="p-4">
                  <div className="space-y-2">
                    {filter.options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full text-left p-2 rounded transition-colors ${
                          selectedFilters[filter.id] === option
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        }`}
                        onClick={() => handleSelectOption(filter.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedFilters[filter.id] && (
                <div className="p-4 text-gray-500">
                  <strong>Selected:</strong> {selectedFilters[filter.id]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Products ({filteredProducts.length})</h1>
            <div className="flex gap-2">
              <Button
                className={`p-2 rounded ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                className={`p-2 rounded ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product Grid/List View */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white shadow rounded-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={viewMode === "list" ? "w-1/3" : ""}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <span className="text-indigo-400 font-bold">${product.price}</span>
                    </div>
                    <div className="flex items-center mt-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-transparent"}`}
                        />
                      ))}
                      <span className="ml-1 text-gray-500 text-sm">{product.rating}</span>
                    </div>
                    <p className="mt-2 text-gray-500 text-sm">{product.description}</p>
                    <div className="mt-4">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white shadow rounded-lg">
              <p className="text-xl text-gray-500">No products match your filters</p>
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

