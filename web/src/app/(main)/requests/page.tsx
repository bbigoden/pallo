import Link from 'next/link'
import { Eye, MapPin, Clock, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { MOCK_REQUESTS } from '@/lib/mock-data'
import { LOAN_TYPE_LABELS } from '@/types'
import { formatAmount, formatRelativeDate } from '@/lib/utils'

const STATUS_LABELS = { active: '모집중', closed: '마감', hidden: '숨김' }
const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700 border-green-100',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
  hidden: 'bg-red-50 text-red-600 border-red-100',
}

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('borrower_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const requests = data && data.length > 0 ? data : MOCK_REQUESTS

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

        <div className="space-y-4">
          {requests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`text-xs border ${STATUS_COLORS[req.status as keyof typeof STATUS_COLORS]}`}>
                    {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {LOAN_TYPE_LABELS[req.loan_type as keyof typeof LOAN_TYPE_LABELS] ?? req.loanType}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock size={11} />{formatRelativeDate(req.created_at ?? req.createdAt)}
                </div>
              </div>
              <h2 className="font-bold text-gray-900 mb-2 leading-snug">{req.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{req.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-blue-600">{formatAmount(req.desired_amount ?? req.desiredAmount)}</span>
                  <span className="text-gray-400">{req.desired_period_months ?? req.desiredPeriodMonths}개월</span>
                  <span className="flex items-center gap-1 text-gray-400"><MapPin size={12} />{req.region}</span>
                  <span className="flex items-center gap-1 text-gray-400"><Eye size={12} />{req.view_count ?? req.viewCount}</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1 hover:border-blue-300 hover:text-blue-600">
                  연락하기 <ArrowRight size={11} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Link href="/request" className="sm:hidden">
          <Button className="w-full mt-6 h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={15} />내 견적 요청 올리기
          </Button>
        </Link>
      </div>
    </main>
  )
}
