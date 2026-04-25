import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'pallo | 대부업 홍보 플랫폼',
  description: '차주와 대부업체를 연결하는 금융 홍보 플랫폼. 대출 상품 검색, 견적 요청, 업체 홍보까지.',
  keywords: '대출, 대부업, 금융, 개인대출, 담보대출, 사업자대출',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
