
import type { Metadata } from 'next'
export async function generateMetadata(): Promise<Metadata>  {
  return {
    title: 'Giỏ hàng',
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
