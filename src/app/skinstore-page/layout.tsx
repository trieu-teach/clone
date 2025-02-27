import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SkinStore - Your Ultimate Skincare Destination",
  description: "Discover premium skincare products for all skin types",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}

