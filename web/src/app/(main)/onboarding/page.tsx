'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { LOAN_TYPE_LABELS, type LoanType } from '@/types'
import { cn } from '@/lib/utils'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '전국']

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    licenseNumber: '',
    contactPhone: '',
    contactEmail: '',
    interestRateMin: '',
    interestRateMax: '',
    loanAmountMin: '',
    loanAmountMax: '',
    loanTypes: [] as LoanType[],
    region: [] as string[],
  })

  function toggleLoanType(type: LoanType) {
    setForm(f => ({
      ...f,
      loanTypes: f.loanTypes.includes(type)
        ? f.loanTypes.filter(t => t !== type)
        : [...f.loanTypes, type],
    }))
  }

  function toggleRegion(r: string) {
    setForm(f => ({
      ...f,
      region: f.region.includes(r)
        ? f.region.filter(x => x !== r)
        : [...f.region, r],
    }))
  }

  const isValid = form.companyName && form.contactPhone && form.contactEmail &&
    form.interestRateMin && form.interestRateMax &&
    form.loanAmountMin && form.loanAmountMax &&
    form.loanTypes.length > 0 && form.region.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { error: err } = await supabase.from('lender_profiles').insert({
        user_id: user.id,
        company_name: form.companyName,
        description: form.description,
        license_number: form.licenseNumber || null,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail,
        interest_rate_min: parseFloat(form.interestRateMin),
        interest_rate_max: parseFloat(form.interestRateMax),
        loan_amount_min: parseInt(form.loanAmountMin) * 10000,
        loan_amount_max: parseInt(form.loanAmountMax) * 10000,
        loan_types: form.loanTypes,
        region: form.region,
        plan: 'free',
        is_verified: false,
      })
      if (err) throw err
      router.push('/dashboard?setup=done')
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Badge className="mb-3 bg-blue-50 text-blue-600 border-blue-100">업체 프로필 설정</Badge>
          <h1 className="text-2xl font-black text-gray-900 mb-1">업체 정보를 등록하세요</h1>
          <p className="text-gray-500 text-sm">차주들에게 보여질 업체 프로필을 작성합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">기본 정보</h2>
            <div className="space-y-1.5">
              <Label htmlFor="companyName">업체명 *</Label>
              <Input id="companyName" placeholder="예: 서울금융대부" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">업체 소개</Label>
              <Textarea id="description" rows={3} placeholder="업체 특징, 강점, 주요 서비스 등을 소개해주세요" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber">대부업 등록번호 (선택)</Label>
              <Input id="licenseNumber" placeholder="예: 2024-서울-0001" value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} />
            </div>
          </div>

          {/* 연락처 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">연락처</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">전화번호 *</Label>
                <Input id="contactPhone" placeholder="02-0000-0000" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">이메일 *</Label>
                <Input id="contactEmail" type="email" placeholder="info@company.co.kr" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} required />
              </div>
            </div>
          </div>

          {/* 대출 조건 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">대출 조건</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>최저 금리 (%) *</Label>
                <Input type="number" step="0.1" placeholder="9.9" value={form.interestRateMin} onChange={e => setForm(f => ({ ...f, interestRateMin: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>최고 금리 (%) *</Label>
                <Input type="number" step="0.1" placeholder="19.9" value={form.interestRateMax} onChange={e => setForm(f => ({ ...f, interestRateMax: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>최소 한도 (만원) *</Label>
                <Input type="number" placeholder="100" value={form.loanAmountMin} onChange={e => setForm(f => ({ ...f, loanAmountMin: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>최대 한도 (만원) *</Label>
                <Input type="number" placeholder="5000" value={form.loanAmountMax} onChange={e => setForm(f => ({ ...f, loanAmountMax: e.target.value }))} required />
              </div>
            </div>
          </div>

          {/* 취급 대출 종류 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-bold text-gray-800">취급 대출 종류 * <span className="text-sm font-normal text-gray-400">(복수 선택)</span></h2>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(LOAN_TYPE_LABELS) as [LoanType, string][]).map(([type, label]) => (
                <button key={type} type="button" onClick={() => toggleLoanType(type)}
                  className={cn('px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-1.5',
                    form.loanTypes.includes(type) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                  )}>
                  {form.loanTypes.includes(type) && <CheckCircle size={13} />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 서비스 지역 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h2 className="font-bold text-gray-800">서비스 지역 * <span className="text-sm font-normal text-gray-400">(복수 선택)</span></h2>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r} type="button" onClick={() => toggleRegion(r)}
                  className={cn('px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                    form.region.includes(r) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  )}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <Button type="submit" className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-4" disabled={!isValid || loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : '업체 프로필 등록하기'}
          </Button>
        </form>
      </div>
    </main>
  )
}
