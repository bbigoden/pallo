import Link from 'next/link'
import { CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PLANS = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    description: '시작을 위한 기본 플랜',
    badge: null,
    features: [
      { label: '상품 등록', value: '1개' },
      { label: '월 문의 수신', value: '10건' },
      { label: '프로필 노출', value: '기본' },
      { label: '검색 노출 순위', value: '하위' },
      { label: '인증 배지', value: false },
      { label: '통계/분석', value: false },
      { label: '프리미엄 노출 구매', value: false },
    ],
    cta: '무료로 시작',
    href: '/register?role=lender',
    highlight: false,
  },
  {
    id: 'standard',
    name: '스탠다드',
    price: 29000,
    description: '성장하는 업체를 위한 플랜',
    badge: null,
    features: [
      { label: '상품 등록', value: '5개' },
      { label: '월 문의 수신', value: '50건' },
      { label: '프로필 노출', value: '중간 순위' },
      { label: '검색 노출 순위', value: '중간' },
      { label: '인증 배지', value: true },
      { label: '통계/분석', value: '기본' },
      { label: '프리미엄 노출 구매', value: false },
    ],
    cta: '스탠다드 시작',
    href: '/register?role=lender&plan=standard',
    highlight: false,
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 69000,
    description: '최대 노출을 원하는 업체',
    badge: '가장 인기',
    features: [
      { label: '상품 등록', value: '무제한' },
      { label: '월 문의 수신', value: '무제한' },
      { label: '프로필 노출', value: '상위 우선' },
      { label: '검색 노출 순위', value: '최상위' },
      { label: '인증 배지', value: true },
      { label: '통계/분석', value: '상세' },
      { label: '프리미엄 노출 구매', value: true },
    ],
    cta: '프리미엄 시작',
    href: '/register?role=lender&plan=premium',
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-blue-50 text-blue-600 border-blue-100">초기 무료 오픈</Badge>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            업체에 맞는 플랜을 선택하세요
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            지금은 모든 플랜이 무료입니다. 플랫폼 활성화 후 유료 전환 예정이며
            기존 가입 업체에는 사전 공지합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border-2 p-6 relative flex flex-col ${
                plan.highlight ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-100'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white border-0 px-3 py-1">{plan.badge}</Badge>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-gray-900">
                    {plan.price === 0 ? '무료' : `${plan.price.toLocaleString()}원`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-400 text-sm mb-1">/월</span>}
                </div>
              </div>

              <div className="space-y-3 flex-1 mb-6">
                {plan.features.map(f => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{f.label}</span>
                    <span className={`font-medium ${typeof f.value === 'boolean' ? '' : 'text-gray-800'}`}>
                      {typeof f.value === 'boolean' ? (
                        f.value
                          ? <CheckCircle size={16} className="text-green-500" />
                          : <X size={16} className="text-gray-300" />
                      ) : f.value}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={plan.href}>
                <Button
                  className={`w-full h-12 font-semibold ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* 프리미엄 노출 별도 구매 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black text-gray-900 mb-1">프리미엄 노출 (별도 구매)</h3>
              <p className="text-sm text-gray-600 mb-2">
                검색 결과 최상단 및 메인 페이지에 업체를 강조 노출합니다.
                프리미엄 플랜 가입자만 구매 가능합니다.
              </p>
              <div className="flex gap-3 text-sm">
                <div className="bg-white rounded-lg px-3 py-1.5 border border-amber-100">
                  <span className="text-gray-500">7일</span>
                  <span className="font-bold text-amber-700 ml-2">49,000원</span>
                </div>
                <div className="bg-white rounded-lg px-3 py-1.5 border border-amber-100">
                  <span className="text-gray-500">30일</span>
                  <span className="font-bold text-amber-700 ml-2">149,000원</span>
                </div>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-0 flex-shrink-0">준비 중</Badge>
          </div>
        </div>

        {/* 차주는 무료 */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-gray-700">차주(대출 신청자)는 모든 기능이 영구 무료입니다.</span>
          </p>
          <Link href="/register" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
            차주로 무료 가입하기 →
          </Link>
        </div>
      </div>
    </main>
  )
}
