import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkinStore - Your Ultimate Skincare Destination",
  description: "Discover premium skincare products for all skin types",
}
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
