import Link from 'next/link'
import { ArrowRight, Search, FileText, Shield, Star, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LOAN_TYPE_LABELS } from '@/types'

const stats = [
  { label: '등록 업체', value: '준비중', icon: Users },
  { label: '누적 견적 요청', value: '준비중', icon: FileText },
  { label: '평균 응답 시간', value: '준비중', icon: TrendingUp },
]

const features = [
  {
    icon: Search,
    title: '업체 직접 검색',
    description: '금리, 한도, 대출 종류별로 내게 맞는 업체를 직접 찾아보세요. 조건을 비교하고 직접 문의합니다.',
    href: '/browse',
    cta: '업체 둘러보기',
  },
  {
    icon: FileText,
    title: '견적 요청 올리기',
    description: '내 상황을 간단히 작성하면 조건에 맞는 업체들이 먼저 연락해옵니다. 한 번에 여러 업체 비교 가능.',
    href: '/request',
    cta: '견적 요청하기',
  },
  {
    icon: Shield,
    title: '업체 홍보 등록',
    description: '상품과 조건을 등록하고 차주에게 직접 노출하세요. 광고 없이도 찾아오는 잠재 고객.',
    href: '/register?role=lender',
    cta: '업체로 시작',
  },
]

const loanTypes = Object.entries(LOAN_TYPE_LABELS)

const howItWorks = [
  { step: '01', title: '회원가입', desc: '차주 또는 업체로 무료 가입' },
  { step: '02', title: '프로필 작성', desc: '상황 설명 또는 상품 등록' },
  { step: '03', title: '연결', desc: '직접 문의 또는 업체 제안 수신' },
  { step: '04', title: '협의', desc: '당사자 간 직접 협의 진행' },
]

export default function HomePage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/20">
            대부업 홍보 플랫폼 — 무료로 시작
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            대출이 필요한 사람과<br />
            <span className="text-blue-200">업체를 연결</span>합니다
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed">
            차주는 상황을 올리고 견적을 받거나, 직접 업체를 검색하세요.<br />
            업체는 상품을 등록하고 잠재 고객에게 노출하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/request">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-14">
                견적 요청하기 (무료)
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/browse">
              <button className="inline-flex items-center justify-center h-14 px-8 rounded-lg border border-white/40 text-white bg-transparent hover:bg-white/10 transition-colors font-medium text-base">
                업체 둘러보기
              </button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            팔로는 대출 중개 서비스가 아닙니다. 업체 홍보 및 정보 제공 플랫폼입니다.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <Icon className="mx-auto mb-2 text-blue-500" size={22} />
                <div className="text-2xl font-black text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">어떻게 사용하나요?</h2>
            <p className="mt-3 text-gray-500">차주와 업체 모두를 위한 플랫폼</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, href, cta }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <Icon className="text-blue-600" size={22} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
                <Link href={href}>
                  <Button variant="outline" className="w-full group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
                    {cta} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">대출 종류별 검색</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {loanTypes.map(([type, label]) => (
              <Link key={type} href={`/browse?type=${type}`}>
                <Badge
                  variant="outline"
                  className="px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  {label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-14">이용 방법</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-lg font-black mx-auto mb-4">
                  {step}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-10 text-lg">차주도 업체도 모두 무료로 시작할 수 있습니다</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 h-14">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/browse">
              <button className="inline-flex items-center justify-center h-14 px-10 rounded-lg border border-white/40 text-white bg-transparent hover:bg-white/10 transition-colors font-medium text-base">
                업체 목록 보기
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
