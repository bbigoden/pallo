'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText, Search, Bell, Settings, Plus, Eye,
  MessageSquare, ChevronRight, Building2, Loader2,
  Package, AlertCircle, MapPin, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { LOAN_TYPE_LABELS, type LoanType } from '@/types'
import { formatAmount, formatRelativeDate } from '@/lib/utils'

const PLAN_BADGE: Record<string, string> = {
  free: '무료',
  standard: 'STANDARD',
  premium: 'PREMIUM',
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lenderProfile, setLenderProfile] = useState<any>(null)
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [profileRes, myReqRes, recentReqRes] = await Promise.all([
        supabase.from('lender_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('borrower_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('borrower_requests').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(3),
      ])

      setLenderProfile(profileRes.data ?? null)
      setMyRequests(myReqRes.data ?? [])
      setRecentRequests(recentReqRes.data ?? [])

      if (profileRes.data) {
        const { count } = await supabase
          .from('lender_products')
          .select('*', { count: 'exact', head: true })
          .eq('lender_id', profileRes.data.id)
        setProductCount(count ?? 0)
      }

      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </main>
    )
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-black text-gray-900">대시보드</h1>

        {lenderProfile ? (
          <LenderDashboard
            profile={lenderProfile}
            productCount={productCount}
            recentRequests={recentRequests}
          />
        ) : (
          <SetupPrompt />
        )}

        {myRequests.length > 0 && (
          <MyRequests requests={myRequests} onClose={async (id) => {
            const supabase = createClient()
            await supabase.from('borrower_requests').update({ status: 'closed' }).eq('id', id)
            setMyRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'closed' } : r))
          }} />
        )}

        <QuickMenu hasLenderProfile={!!lenderProfile} lenderId={lenderProfile?.id} />
      </div>
    </main>
  )
}

function LenderDashboard({ profile, productCount, recentRequests }: {
  profile: any
  productCount: number
  recentRequests: any[]
}) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={18} />
              <span className="font-bold">{profile.company_name}</span>
              {profile.is_verified && (
                <Badge className="bg-white/20 text-white border-0 text-xs">인증</Badge>
              )}
              <Badge className="bg-white/20 text-white border-0 text-xs">
                {PLAN_BADGE[profile.plan] ?? profile.plan}
              </Badge>
            </div>
            <p className="text-blue-100 text-sm">{profile.contact_email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/pricing">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                플랜 관리
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Settings size={14} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xl font-black">{productCount}개</div>
            <div className="text-xs text-blue-200 mt-0.5">등록 상품</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xl font-black">{recentRequests.length}건</div>
            <div className="text-xs text-blue-200 mt-0.5">최신 견적요청</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-xl font-black">
              {profile.interest_rate_min}~{profile.interest_rate_max}%
            </div>
            <div className="text-xs text-blue-200 mt-0.5">금리 범위</div>
          </div>
        </div>
      </div>

      {recentRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">최신 견적 요청</h2>
            <Link href="/requests" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              전체보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map((req: any) => (
              <div key={req.id} className="flex items-start justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {LOAN_TYPE_LABELS[req.loan_type as LoanType] ?? req.loan_type}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin size={10} />{req.region}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={10} />{formatRelativeDate(req.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{req.title}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {formatAmount(req.desired_amount)} · {req.desired_period_months}개월
                  </p>
                </div>
                <Link href="/requests">
                  <Button size="sm" variant="outline" className="ml-3 h-8 text-xs flex-shrink-0">
                    연락하기
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function SetupPrompt() {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-8 text-center">
      <AlertCircle size={36} className="mx-auto mb-3 text-blue-400" />
      <h2 className="font-black text-gray-900 text-lg mb-1">업체 프로필이 없습니다</h2>
      <p className="text-gray-400 text-sm mb-5">업체 프로필을 등록하면 차주들에게 노출됩니다</p>
      <Link href="/onboarding">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus size={15} />업체 프로필 등록하기
        </Button>
      </Link>
    </div>
  )
}

function MyRequests({ requests, onClose }: { requests: any[]; onClose: (id: string) => Promise<void> }) {
  const [closing, setClosing] = useState<string | null>(null)

  async function handleClose(id: string) {
    setClosing(id)
    await onClose(id)
    setClosing(null)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-gray-900">내 견적 요청</h2>
        <Link href="/request">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1 h-8 text-xs">
            <Plus size={13} /> 새 요청
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {requests.map((req: any) => (
          <div key={req.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={req.status === 'active' ? 'bg-green-50 text-green-700 border-green-100 text-xs' : 'bg-gray-100 text-gray-500 text-xs'}>
                {req.status === 'active' ? '모집중' : '마감'}
              </Badge>
              <span className="text-xs text-gray-400">{formatRelativeDate(req.created_at)}</span>
            </div>
            <p className="font-medium text-gray-800 text-sm mb-1">{req.title}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{formatAmount(req.desired_amount)}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {req.view_count ?? 0}회 조회</span>
              </div>
              {req.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-500"
                  disabled={closing === req.id}
                  onClick={() => handleClose(req.id)}
                >
                  {closing === req.id ? <Loader2 size={11} className="animate-spin" /> : '마감'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickMenu({ hasLenderProfile, lenderId }: { hasLenderProfile: boolean; lenderId?: string }) {
  const lenderMenus = [
    { icon: Package, label: '상품 관리', href: '/dashboard/products' },
    { icon: Eye, label: '프로필 보기', href: lenderId ? `/profile/${lenderId}` : '/browse' },
    { icon: Search, label: '견적 게시판', href: '/requests' },
    { icon: Settings, label: '설정', href: '/dashboard/settings' },
  ]
  const borrowerMenus = [
    { icon: Search, label: '업체 검색', href: '/browse' },
    { icon: FileText, label: '견적 게시판', href: '/requests' },
    { icon: MessageSquare, label: '견적 요청', href: '/request' },
    { icon: Bell, label: '알림', href: '/dashboard/notifications' },
  ]
  const menus = hasLenderProfile ? lenderMenus : borrowerMenus

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {menus.map(({ icon: Icon, label, href }) => (
        <Link key={label} href={href}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
            <Icon size={22} className="mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
