'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ChevronLeft, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { LOAN_TYPE_LABELS, type LoanType } from '@/types'
import { cn } from '@/lib/utils'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lenderId, setLenderId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    loanType: '' as LoanType | '',
    interestRate: '',
    loanAmountMin: '',
    loanAmountMax: '',
    loanPeriodMonths: '',
    requirements: [] as string[],
  })

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase
        .from('lender_profiles').select('id').eq('user_id', user.id).single()
      if (!profile) { router.push('/onboarding'); return }
      setLenderId(profile.id)
    }
    init()
  }, [router])

  function addRequirement() {
    const val = requirementInput.trim()
    if (!val || form.requirements.includes(val)) return
    setForm(f => ({ ...f, requirements: [...f.requirements, val] }))
    setRequirementInput('')
  }

  function removeRequirement(r: string) {
    setForm(f => ({ ...f, requirements: f.requirements.filter(x => x !== r) }))
  }

  const isValid = form.title && form.loanType && form.interestRate &&
    form.loanAmountMin && form.loanAmountMax && form.loanPeriodMonths

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || !lenderId) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('lender_products').insert({
        lender_id: lenderId,
        title: form.title,
        description: form.description,
        loan_type: form.loanType,
        interest_rate: parseFloat(form.interestRate),
        loan_amount_min: parseInt(form.loanAmountMin) * 10000,
        loan_amount_max: parseInt(form.loanAmountMax) * 10000,
        loan_period_months: parseInt(form.loanPeriodMonths),
        requirements: form.requirements,
        is_active: true,
      })
      if (err) throw err
      router.push('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
              <ChevronLeft size={16} />상품 목록
            </Button>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">상품 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">기본 정보</h2>
            <div className="space-y-1.5">
              <Label htmlFor="title">상품명 *</Label>
              <Input
                id="title"
                placeholder="예: 직장인 우대 신용대출"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="상품 특징, 대상 고객, 우대 조건 등을 설명해주세요"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>대출 종류 *</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(LOAN_TYPE_LABELS) as [LoanType, string][]).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, loanType: type }))}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                      form.loanType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 대출 조건 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">대출 조건</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>금리 (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="예: 12.5"
                  value={form.interestRate}
                  onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>상환 기간 (개월) *</Label>
                <Input
                  type="number"
                  placeholder="예: 36"
                  value={form.loanPeriodMonths}
                  onChange={e => setForm(f => ({ ...f, loanPeriodMonths: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>최소 한도 (만원) *</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={form.loanAmountMin}
                  onChange={e => setForm(f => ({ ...f, loanAmountMin: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>최대 한도 (만원) *</Label>
                <Input
                  type="number"
                  placeholder="3000"
                  value={form.loanAmountMax}
                  onChange={e => setForm(f => ({ ...f, loanAmountMax: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* 필요 서류/조건 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-bold text-gray-800">필요 서류 / 자격 조건</h2>
            <div className="flex gap-2">
              <Input
                placeholder="예: 재직증명서, 소득확인서류"
                value={requirementInput}
                onChange={e => setRequirementInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequirement() } }}
              />
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus size={15} />
              </Button>
            </div>
            {form.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.requirements.map(r => (
                  <span key={r} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {r}
                    <button type="button" onClick={() => removeRequirement(r)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400">Enter 키 또는 + 버튼으로 추가</p>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <Button
            type="submit"
            className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-4"
            disabled={!isValid || loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : '상품 등록하기'}
          </Button>
        </form>
      </div>
    </main>
  )
}
