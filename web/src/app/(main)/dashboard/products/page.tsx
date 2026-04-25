'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, Package, Pencil, Trash2, ToggleLeft, ToggleRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { LOAN_TYPE_LABELS, type LoanType } from '@/types'
import { formatAmount } from '@/lib/utils'

export default function ProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [lenderId, setLenderId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('lender_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) { router.push('/onboarding'); return }

      setLenderId(profile.id)

      const { data } = await supabase
        .from('lender_products')
        .select('*')
        .eq('lender_id', profile.id)
        .order('created_at', { ascending: false })

      setProducts(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function toggleActive(productId: string, current: boolean) {
    setToggling(productId)
    const supabase = createClient()
    await supabase.from('lender_products').update({ is_active: !current }).eq('id', productId)
    setProducts(ps => ps.map(p => p.id === productId ? { ...p, is_active: !current } : p))
    setToggling(null)
  }

  async function deleteProduct(productId: string) {
    if (!confirm('상품을 삭제하시겠습니까?')) return
    setDeleting(productId)
    const supabase = createClient()
    await supabase.from('lender_products').delete().eq('id', productId)
    setProducts(ps => ps.filter(p => p.id !== productId))
    setDeleting(null)
  }

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
              <ChevronLeft size={16} />대시보드
            </Button>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">상품 관리</h1>
          <div className="flex-1" />
          <Link href="/dashboard/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={15} />상품 등록
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Package size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium mb-1">등록된 상품이 없습니다</p>
            <p className="text-gray-400 text-sm mb-5">대출 상품을 등록하면 업체 프로필에 표시됩니다</p>
            <Link href="/dashboard/products/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus size={15} />첫 상품 등록하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {LOAN_TYPE_LABELS[product.loan_type as LoanType] ?? product.loan_type}
                      </Badge>
                      <Badge className={product.is_active
                        ? 'bg-green-50 text-green-700 border-green-100 text-xs'
                        : 'bg-gray-100 text-gray-400 text-xs'}>
                        {product.is_active ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    <h2 className="font-bold text-gray-900 mb-1">{product.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">금리</span>
                        <span className="ml-1.5 font-semibold text-blue-600">{product.interest_rate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">한도</span>
                        <span className="ml-1.5 font-semibold text-gray-800">
                          {formatAmount(product.loan_amount_min)} ~ {formatAmount(product.loan_amount_max)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">기간</span>
                        <span className="ml-1.5 font-semibold text-gray-800">{product.loan_period_months}개월</span>
                      </div>
                    </div>
                    {product.requirements?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {product.requirements.map((r: string) => (
                          <span key={r} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{r}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(product.id, product.is_active)}
                      disabled={toggling === product.id}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                      title={product.is_active ? '비활성화' : '활성화'}
                    >
                      {toggling === product.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : product.is_active ? (
                        <ToggleRight size={20} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                        <Pencil size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={deleting === product.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                    >
                      {deleting === product.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
