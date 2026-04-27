'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn, formatAmount } from '@/lib/utils'
import { LOAN_TYPE_LABELS, type LoanType, type CreditScoreRange } from '@/types'

type Step = 1 | 2 | 3

const CREDIT_OPTIONS: { value: CreditScoreRange; label: string; desc: string }[] = [
  { value: 'excellent', label: '900점 이상', desc: '최우량' },
  { value: 'good', label: '800~899점', desc: '우량' },
  { value: 'fair', label: '700~799점', desc: '보통' },
  { value: 'poor', label: '700점 미만', desc: '저신용' },
  { value: 'unknown', label: '모름', desc: '확인 안됨' },
]

const AMOUNT_PRESETS = [1000000, 3000000, 5000000, 10000000, 30000000, 50000000, 100000000]
const PERIOD_PRESETS = [1, 3, 6, 12, 24, 36, 60]
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

export default function RequestPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    loanType: '' as LoanType | '',
    desiredAmount: 0,
    desiredPeriodMonths: 0,
    creditScore: '' as CreditScoreRange | '',
    collateral: '',
    region: '',
    title: '',
    description: '',
  })

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const step1Valid = form.loanType && form.desiredAmount > 0 && form.desiredPeriodMonths > 0
  const step2Valid = form.region && form.creditScore
  const step3Valid = form.title.trim().length >= 2 && form.description.trim().length >= 5

  async function handleSubmit() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { error } = await supabase.from('borrower_requests').insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        desired_amount: form.desiredAmount,
        desired_period_months: form.desiredPeriodMonths,
        loan_type: form.loanType,
        credit_score: form.creditScore || null,
        collateral: form.collateral || null,
        region: form.region,
        status: 'active',
      })
      if (error) throw error
      router.push('/requests?posted=true')
    } catch {
      setLoading(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 진행 바 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {(['대출 조건', '내 상황', '작성 완료'] as const).map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                  step > i + 1 ? 'bg-blue-600 text-white' :
                  step === i + 1 ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                )}>
                  {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={cn('text-sm font-medium hidden sm:block', step === i + 1 ? 'text-blue-600' : 'text-gray-400')}>
                  {label}
                </span>
                {i < 2 && <ChevronRight size={14} className="text-gray-300 mx-1" />}
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-black text-gray-900 mb-1">어떤 대출이 필요하신가요?</h1>
                <p className="text-sm text-gray-400">기본 조건을 선택해주세요</p>
              </div>

              <div>
                <Label className="mb-2 block">대출 종류</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(LOAN_TYPE_LABELS) as [LoanType, string][]).map(([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update('loanType', type)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-sm font-medium text-left transition-all',
                        form.loanType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-100 hover:border-gray-200 text-gray-700'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">
                  희망 금액
                  {form.desiredAmount > 0 && (
                    <span className="ml-2 text-blue-600 font-bold">{formatAmount(form.desiredAmount)}</span>
                  )}
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {AMOUNT_PRESETS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => update('desiredAmount', a)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                        form.desiredAmount === a
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      )}
                    >
                      {formatAmount(a)}
                    </button>
                  ))}
                </div>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="직접 입력 (원)"
                  value={form.desiredAmount ? form.desiredAmount.toLocaleString('ko-KR') : ''}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    update('desiredAmount', raw ? Number(raw) : 0)
                  }}
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  희망 상환 기간
                  {form.desiredPeriodMonths > 0 && (
                    <span className="ml-2 text-blue-600 font-bold">{form.desiredPeriodMonths}개월</span>
                  )}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PERIOD_PRESETS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update('desiredPeriodMonths', p)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                        form.desiredPeriodMonths === p
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      )}
                    >
                      {p < 12 ? `${p}개월` : `${p / 12}년`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-black text-gray-900 mb-1">내 상황을 알려주세요</h1>
                <p className="text-sm text-gray-400">업체가 조건에 맞게 연락할 수 있도록</p>
              </div>

              <div>
                <Label className="mb-2 block">신용점수 (선택)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CREDIT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => update('creditScore', o.value)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-left transition-all',
                        form.creditScore === o.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div className="font-semibold text-sm text-gray-800">{o.label}</div>
                      <div className="text-xs text-gray-400">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">지역</Label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => update('region', r)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                        form.region === r
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {(form.loanType === 'mortgage' || form.loanType === 'refinance') && (
                <div>
                  <Label htmlFor="collateral" className="mb-2 block">담보물 정보 (선택)</Label>
                  <Input
                    id="collateral"
                    placeholder="예: 서울 강남구 아파트 (시가 5억)"
                    value={form.collateral}
                    onChange={e => update('collateral', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-black text-gray-900 mb-1">상세 내용 작성</h1>
                <p className="text-sm text-gray-400">업체들이 볼 수 있는 내용입니다</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span>대출 종류</span>
                  <Badge className="bg-blue-100 text-blue-700 border-0">{form.loanType ? LOAN_TYPE_LABELS[form.loanType as LoanType] : ''}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>희망 금액</span>
                  <span className="font-semibold">{formatAmount(form.desiredAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>상환 기간</span>
                  <span className="font-semibold">{form.desiredPeriodMonths}개월</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>지역</span>
                  <span className="font-semibold">{form.region}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="mb-2 block">
                  제목 <span className="text-gray-400 text-xs">({form.title.length}/50)</span>
                </Label>
                <Input
                  id="title"
                  placeholder="예: 직장인 개인대출 2,000만원 급하게 필요합니다"
                  value={form.title}
                  onChange={e => update('title', e.target.value.slice(0, 50))}
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  상세 설명 <span className="text-gray-400 text-xs">({form.description.length}/500)</span>
                </Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="직업, 소득, 대출 목적, 현재 대출 여부 등 업체가 판단할 수 있는 정보를 작성해주세요. 개인정보(주민번호, 계좌번호 등)는 입력하지 마세요."
                  value={form.description}
                  onChange={e => update('description', e.target.value.slice(0, 500))}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  * 개인정보 보호를 위해 주민등록번호, 계좌번호 등은 작성하지 마세요
                </p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                className="h-12 gap-1"
                onClick={() => setStep(s => (s - 1) as Step)}
              >
                <ChevronLeft size={16} /> 이전
              </Button>
            )}
            {step < 3 ? (
              <Button
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white gap-1"
                disabled={step === 1 ? !step1Valid : !step2Valid}
                onClick={() => setStep(s => (s + 1) as Step)}
              >
                다음 <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!step3Valid || loading}
                onClick={handleSubmit}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : '견적 요청 올리기'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
