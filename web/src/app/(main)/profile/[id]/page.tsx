import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Shield, Star, MapPin, Phone, Mail, TrendingDown,
  CheckCircle, ArrowLeft, MessageSquare, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MOCK_LENDERS } from '@/lib/mock-data'
import { LOAN_TYPE_LABELS } from '@/types'
import { formatAmount, formatRate } from '@/lib/utils'

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    title: '직장인 신용대출',
    interestRate: 12.5,
    loanAmountMin: 1000000,
    loanAmountMax: 30000000,
    loanPeriodMonths: 36,
    requirements: ['재직 6개월 이상', '신용점수 650점 이상', '연소득 2,400만원 이상'],
    loanType: 'personal' as const,
  },
  {
    id: 'p2',
    title: '담보대출 (아파트)',
    interestRate: 9.5,
    loanAmountMin: 10000000,
    loanAmountMax: 50000000,
    loanPeriodMonths: 60,
    requirements: ['아파트 담보', 'LTV 70% 이내', '등기부등본 제출'],
    loanType: 'mortgage' as const,
  },
]

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lender = MOCK_LENDERS.find(l => l.id === id)
  if (!lender) notFound()

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
              {lender.companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{lender.companyName}</h1>
                {lender.isVerified && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 gap-1">
                    <Shield size={11} /> 인증업체
                  </Badge>
                )}
                {lender.plan === 'premium' && (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100">PRO</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  4.5 (후기 12개)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {lender.region.join(', ')}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{lender.description}</p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* 핵심 조건 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="최저 금리" value={formatRate(lender.interestRateMin)} highlight />
            <Stat label="최고 금리" value={formatRate(lender.interestRateMax)} />
            <Stat label="최소 한도" value={formatAmount(lender.loanAmountMin)} />
            <Stat label="최대 한도" value={formatAmount(lender.loanAmountMax)} highlight />
          </div>

          <Separator className="my-5" />

          {/* 취급 대출 */}
          <div className="flex flex-wrap gap-2 mb-5">
            {lender.loanTypes.map(t => (
              <Badge key={t} variant="outline" className="text-sm px-3 py-1">
                {LOAN_TYPE_LABELS[t]}
              </Badge>
            ))}
          </div>

          {/* 문의 버튼 */}
          <div className="flex gap-3">
            <a href={`tel:${lender.contactPhone}`} className="flex-1">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Phone size={15} />
                {lender.contactPhone} 전화하기
              </Button>
            </a>
            <a href={`mailto:${lender.contactEmail}`}>
              <Button variant="outline" className="h-12 gap-2">
                <Mail size={15} />
                이메일
              </Button>
            </a>
          </div>
        </div>

        {/* 등록 상품 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
          <h2 className="font-black text-gray-900 mb-4">등록 상품 ({MOCK_PRODUCTS.length})</h2>
          <div className="space-y-4">
            {MOCK_PRODUCTS.map(product => (
              <div key={product.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-100 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{product.title}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{LOAN_TYPE_LABELS[product.loanType]}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-black">{formatRate(product.interestRate)}</div>
                    <div className="text-xs text-gray-400">{product.loanPeriodMonths}개월</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <TrendingDown size={13} />
                    {formatAmount(product.loanAmountMin)} ~ {formatAmount(product.loanAmountMax)}
                  </span>
                </div>
                <div className="space-y-1">
                  {product.requirements.map(r => (
                    <div key={r} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 후기 (플레이스홀더) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">이용 후기</h2>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="font-bold">4.5</span>
              <span className="text-gray-400 text-sm">(12)</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: '이*진', rating: 5, text: '빠른 심사와 친절한 상담 덕분에 급한 자금을 해결했습니다. 강력 추천합니다!', date: '2024-03-15' },
              { name: '박*수', rating: 4, text: '금리가 타 업체보다 낮고 서류도 간단해서 좋았습니다.', date: '2024-02-28' },
            ].map((r, i) => (
              <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{r.name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{r.text}</p>
                <p className="text-xs text-gray-300 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
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
