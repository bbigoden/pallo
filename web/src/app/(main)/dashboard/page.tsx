'use client'

import Link from 'next/link'
import {
  FileText, Search, Bell, Settings, TrendingUp,
  Plus, Eye, MessageSquare, Star, ChevronRight, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_REQUESTS, MOCK_LENDERS } from '@/lib/mock-data'
import { LOAN_TYPE_LABELS } from '@/types'
import { formatAmount, formatRelativeDate } from '@/lib/utils'

// 실제로는 로그인 유저 정보로 분기 — 지금은 'lender' 탭으로 시뮬레이션
export default function DashboardPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="lender">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">대시보드</h1>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="lender">업체 보기</TabsTrigger>
              <TabsTrigger value="borrower">차주 보기</TabsTrigger>
            </TabsList>
          </div>

          {/* 업체 대시보드 */}
          <TabsContent value="lender" className="space-y-5">
            <LenderDashboard />
          </TabsContent>

          {/* 차주 대시보드 */}
          <TabsContent value="borrower" className="space-y-5">
            <BorrowerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function LenderDashboard() {
  const lender = MOCK_LENDERS[0]
  return (
    <>
      {/* 플랜 상태 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={18} />
              <span className="font-bold">{lender.companyName}</span>
              <Badge className="bg-white/20 text-white border-0 text-xs">PRO</Badge>
            </div>
            <p className="text-blue-100 text-sm">프리미엄 플랜 이용 중</p>
          </div>
          <Link href="/pricing">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              플랜 관리
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: '이번 달 문의', value: '23건' },
            { label: '등록 상품', value: '2개' },
            { label: '프로필 조회', value: '147회' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{s.value}</div>
              <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 최신 견적 요청 — 업체가 열람 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">최신 견적 요청</h2>
          <Link href="/requests" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {MOCK_REQUESTS.slice(0, 3).map(req => (
            <div key={req.id} className="flex items-start justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{LOAN_TYPE_LABELS[req.loanType]}</Badge>
                  <span className="text-xs text-gray-400">{formatRelativeDate(req.createdAt)}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{req.title}</p>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">{formatAmount(req.desiredAmount)} · {req.desiredPeriodMonths}개월</p>
              </div>
              <Button size="sm" variant="outline" className="ml-3 h-8 text-xs flex-shrink-0">
                연락하기
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: '상품 등록', href: '/dashboard/products/new' },
          { icon: Eye, label: '프로필 보기', href: `/profile/${MOCK_LENDERS[0].id}` },
          { icon: MessageSquare, label: '문의 내역', href: '/dashboard/messages' },
          { icon: Settings, label: '설정', href: '/dashboard/settings' },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <Icon size={22} className="mx-auto mb-2 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

function BorrowerDashboard() {
  return (
    <>
      {/* 내 견적 요청 현황 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">내 견적 요청</h2>
          <Link href="/request">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1 h-8 text-xs">
              <Plus size={13} /> 새 요청
            </Button>
          </Link>
        </div>

        {MOCK_REQUESTS.slice(0, 2).map(req => (
          <div key={req.id} className="border border-gray-100 rounded-xl p-4 mb-3 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-green-50 text-green-700 border-green-100 text-xs">{req.status === 'active' ? '모집중' : '마감'}</Badge>
              <span className="text-xs text-gray-400">{formatRelativeDate(req.createdAt)}</span>
            </div>
            <p className="font-medium text-gray-800 text-sm mb-1">{req.title}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{formatAmount(req.desiredAmount)}</span>
              <span className="flex items-center gap-0.5"><Eye size={11} /> {req.viewCount}회 조회</span>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 메뉴 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: Search, label: '업체 검색', href: '/browse' },
          { icon: FileText, label: '견적 게시판', href: '/requests' },
          { icon: Bell, label: '알림', href: '/dashboard/notifications' },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <Icon size={22} className="mx-auto mb-2 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
