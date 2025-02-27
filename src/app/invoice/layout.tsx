
export async function generateMetadata({ params }: { params: { title: string } }) {
  return {
    title: params.title || "tìm kiếm",
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
