
export async function generateMetadata({ params }: { params: { title: string } }) {
  return {
    title: params.title || "Giỏ hàng",
  }
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <>
      { children }
    </>
  )
}
