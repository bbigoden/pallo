'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, MapPin, Clock, ArrowRight, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { LOAN_TYPE_LABELS } from '@/types'
import { formatAmount, formatRelativeDate } from '@/lib/utils'

const STATUS_LABELS = { active: '모집중', closed: '마감', hidden: '숨김' }
const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700 border-green-100',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
  hidden: 'bg-red-50 text-red-600 border-red-100',
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showInterest, setShowInterest] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('borrower_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      setRequests(data ?? [])
      setLoading(false)
    }
    load()
  }, [])


  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">견적 요청 게시판</h1>
            <p className="text-sm text-gray-400 mt-1">차주들의 대출 요청을 확인하고 직접 연락하세요</p>
          </div>
          <Link href="/request">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 hidden sm:flex">
              <Plus size={15} />견적 요청하기
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">아직 견적 요청이 없습니다</p>
            <Link href="/request">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus size={15} />첫 번째로 요청하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any) => (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs border ${STATUS_COLORS[req.status as keyof typeof STATUS_COLORS]}`}>
                      {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {LOAN_TYPE_LABELS[req.loan_type as keyof typeof LOAN_TYPE_LABELS] ?? req.loan_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock size={11} />{formatRelativeDate(req.created_at)}
                  </div>
                </div>
                <h2 className="font-bold text-gray-900 mb-2 leading-snug">{req.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{req.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-blue-600">{formatAmount(req.desired_amount)}</span>
                    <span className="text-gray-400">{req.desired_period_months}개월</span>
                    <span className="flex items-center gap-1 text-gray-400"><MapPin size={12} />{req.region}</span>
                    <span className="flex items-center gap-1 text-gray-400"><Eye size={12} />{req.view_count ?? 0}</span>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowInterest(req.id)}
                  >
                    연락하기 <ArrowRight size={11} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/request" className="sm:hidden">
          <Button className="w-full mt-6 h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={15} />내 견적 요청 올리기
          </Button>
        </Link>
      </div>

      {showInterest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowInterest(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-gray-900 text-lg mb-2">업체 프로필로 홍보하세요</h2>
            <p className="text-sm text-gray-500 mb-5">
              차주가 업체 찾기에서 귀사의 프로필을 확인하고 직접 연락합니다.<br />
              프로필과 상품을 등록해 더 많은 차주에게 노출되세요.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowInterest(null)}>닫기</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setShowInterest(null); window.location.href = '/browse' }}>업체 찾기 보기</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
