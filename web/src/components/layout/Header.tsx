'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navItems = [
  { label: '업체 찾기', href: '/browse' },
  { label: '견적 게시판', href: '/requests' },
  { label: '견적 요청', href: '/request' },
  { label: '요금제', href: '/pricing' },
]

export default function Header() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-blue-600">pallo</span>
          <span className="text-xs font-medium text-gray-400 hidden sm:block">금융 홍보 플랫폼</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                  {user.user_metadata?.name ?? user.email?.split('@')[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-44 z-50">
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={14} className="text-gray-400" /> 대시보드
                  </Link>
                  <button onClick={() => { setUserMenuOpen(false); handleLogout() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                    <LogOut size={14} /> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-600">로그인</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">무료 시작</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-800" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-2"><LayoutDashboard size={14} />대시보드</Button>
                </Link>
                <Button variant="outline" className="w-full text-red-500 border-red-100 gap-2" onClick={() => { setMobileOpen(false); handleLogout() }}>
                  <LogOut size={14} />로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">로그인</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">무료 시작</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
