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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    async function load() {
      const { id } = await params
      setProductId(id)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: product } = await supabase
        .from('lender_products').select('*').eq('id', id).single()

      if (!product) { router.push('/dashboard/products'); return }

      setForm({
        title: product.title ?? '',
        description: product.description ?? '',
        loanType: product.loan_type ?? '',
        interestRate: String(product.interest_rate ?? ''),
        loanAmountMin: String(Math.round((product.loan_amount_min ?? 0) / 10000)),
        loanAmountMax: String(Math.round((product.loan_amount_max ?? 0) / 10000)),
        loanPeriodMonths: String(product.loan_period_months ?? ''),
        requirements: product.requirements ?? [],
      })
      setLoading(false)
    }
    load()
  }, [params, router])

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
    if (!isValid) return
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('lender_products').update({
        title: form.title,
        description: form.description,
        loan_type: form.loanType,
        interest_rate: parseFloat(form.interestRate),
        loan_amount_min: parseInt(form.loanAmountMin) * 10000,
        loan_amount_max: parseInt(form.loanAmountMax) * 10000,
        loan_period_months: parseInt(form.loanPeriodMonths),
        requirements: form.requirements,
      }).eq('id', productId)
      if (err) throw err
      router.push('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </main>
    )
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
          <h1 className="text-2xl font-black text-gray-900">상품 수정</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">기본 정보</h2>
            <div className="space-y-1.5">
              <Label htmlFor="title">상품명 *</Label>
              <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">상품 설명</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>대출 종류 *</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(LOAN_TYPE_LABELS) as [LoanType, string][]).map(([type, label]) => (
                  <button key={type} type="button" onClick={() => setForm(f => ({ ...f, loanType: type }))}
                    className={cn('px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                      form.loanType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">대출 조건</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>금리 (%) *</Label>
                <Input type="number" step="0.1" value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>상환 기간 (개월) *</Label>
                <Input type="number" value={form.loanPeriodMonths} onChange={e => setForm(f => ({ ...f, loanPeriodMonths: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>최소 한도 (만원) *</Label>
                <Input type="number" value={form.loanAmountMin} onChange={e => setForm(f => ({ ...f, loanAmountMin: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>최대 한도 (만원) *</Label>
                <Input type="number" value={form.loanAmountMax} onChange={e => setForm(f => ({ ...f, loanAmountMax: e.target.value }))} required />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-bold text-gray-800">필요 서류 / 자격 조건</h2>
            <div className="flex gap-2">
              <Input placeholder="예: 재직증명서" value={requirementInput}
                onChange={e => setRequirementInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequirement() } }} />
              <Button type="button" variant="outline" onClick={addRequirement}><Plus size={15} /></Button>
            </div>
            {form.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.requirements.map(r => (
                  <span key={r} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {r}
                    <button type="button" onClick={() => removeRequirement(r)} className="hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <Button type="submit" className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-4" disabled={!isValid || saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : '수정 완료'}
          </Button>
        </form>
      </div>
    </main>
  )
}
