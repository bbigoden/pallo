'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield, Star, MapPin, TrendingDown,
  CheckCircle, ArrowLeft, Loader2, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { ContactModal } from '@/components/lender/ContactModal'
import { LOAN_TYPE_LABELS, type LoanType } from '@/types'
import { formatAmount, formatRate } from '@/lib/utils'

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [lender, setLender] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    async function load() {
      const { id } = await params
      const supabase = createClient()

      const [lenderRes, productsRes] = await Promise.all([
        supabase.from('lender_profiles').select('*').eq('id', id).single(),
        supabase.from('lender_products').select('*').eq('lender_id', id).eq('is_active', true).order('created_at', { ascending: false }),
      ])

      if (!lenderRes.data) { router.push('/browse'); return }
      setLender(lenderRes.data)
      setProducts(productsRes.data ?? [])
      setLoading(false)

      // 조회수 증가
      try { await supabase.rpc('increment_view_count', { request_id: id }) } catch {}
    }
    load()
  }, [params, router])

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowLeft size={14} /> 목록으로
        </Link>

        {/* 업체 헤더 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-600 flex-shrink-0">
              {lender.company_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{lender.company_name}</h1>
                {lender.is_verified && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 gap-1">
                    <Shield size={11} /> 인증업체
                  </Badge>
                )}
                {lender.plan === 'premium' && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100">PRO</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 flex-wrap">
                {lender.region?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {lender.region.slice(0, 3).join(', ')}{lender.region.length > 3 ? ` 외 ${lender.region.length - 3}곳` : ''}
                  </span>
                )}
                {lender.license_number && (
                  <span className="text-xs text-gray-400">등록번호: {lender.license_number}</span>
                )}
              </div>
              {lender.description && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{lender.description}</p>
              )}
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <Stat label="최저 금리" value={formatRate(lender.interest_rate_min)} highlight />
            <Stat label="최고 금리" value={formatRate(lender.interest_rate_max)} />
            <Stat label="최소 한도" value={formatAmount(lender.loan_amount_min)} />
            <Stat label="최대 한도" value={formatAmount(lender.loan_amount_max)} highlight />
          </div>

          {lender.loan_types?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {lender.loan_types.map((t: LoanType) => (
                <Badge key={t} variant="outline" className="text-sm px-3 py-1">
                  {LOAN_TYPE_LABELS[t]}
                </Badge>
              ))}
            </div>
          )}

          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => setShowContact(true)}
          >
            <Phone size={15} />
            연락하기
          </Button>
        </div>

        {/* 등록 상품 */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
            <h2 className="font-black text-gray-900 mb-4">등록 상품 ({products.length})</h2>
            <div className="space-y-4">
              {products.map((product: any) => (
                <div key={product.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{product.title}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {LOAN_TYPE_LABELS[product.loan_type as LoanType] ?? product.loan_type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-black">{formatRate(product.interest_rate)}</div>
                      <div className="text-xs text-gray-400">{product.loan_period_months}개월</div>
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <TrendingDown size={13} />
                    {formatAmount(product.loan_amount_min)} ~ {formatAmount(product.loan_amount_max)}
                  </div>
                  {product.requirements?.length > 0 && (
                    <div className="space-y-1">
                      {product.requirements.map((r: string) => (
                        <div key={r} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                          {r}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 후기 placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">이용 후기</h2>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="font-bold">-</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center py-6">아직 등록된 후기가 없습니다</p>
        </div>
      </div>

      {showContact && (
        <ContactModal
          companyName={lender.company_name}
          contactPhone={lender.contact_phone}
          contactEmail={lender.contact_email}
          onClose={() => setShowContact(false)}
        />
      )}
    </main>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`font-black text-lg ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</div>
    </div>
  )
}
