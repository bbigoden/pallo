'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, User, Building2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { register } from '@/lib/supabase/actions'
import type { UserRole } from '@/types'

type Step = 'role' | 'info'

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'lender' ? 'lender' : null

  const [step, setStep] = useState<Step>(defaultRole ? 'info' : 'role')
  const [role, setRole] = useState<UserRole | null>(defaultRole as UserRole | null)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', passwordConfirm: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return }
    setLoading(true)
    try {
      await register({ email: form.email, password: form.password, name: form.name, phone: form.phone, role: role as 'borrower' | 'lender' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  if (step === 'role') {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">회원가입</h1>
          <p className="text-sm text-gray-500 mb-8">어떤 목적으로 가입하시나요?</p>
          <div className="space-y-3">
            <RoleCard icon={User} title="차주로 가입" description="대출 견적을 요청하거나 업체를 검색합니다" selected={role === 'borrower'} onClick={() => setRole('borrower')} />
            <RoleCard icon={Building2} title="업체/투자자로 가입" description="상품을 등록하고 차주에게 홍보합니다" selected={role === 'lender'} onClick={() => setRole('lender')} />
          </div>
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-6" disabled={!role} onClick={() => setStep('info')}>다음</Button>
          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <button className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1" onClick={() => setStep('role')}>← 다시 선택</button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            {role === 'lender' ? <Building2 size={18} className="text-blue-600" /> : <User size={18} className="text-blue-600" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">{role === 'lender' ? '업체/투자자' : '차주'} 가입</h1>
            <p className="text-xs text-gray-400">무료로 시작하세요</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{role === 'lender' ? '업체명 또는 이름' : '이름'}</Label>
            <Input id="name" placeholder={role === 'lender' ? '예: 서울대부 또는 홍길동' : '실명 입력'} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">연락처</Label>
            <Input id="phone" type="tel" placeholder="010-0000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="8자 이상" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input id="passwordConfirm" type="password" placeholder="비밀번호 재입력" value={form.passwordConfirm} onChange={e => setForm(f => ({ ...f, passwordConfirm: e.target.value }))} required />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : '가입하기'}
          </Button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          가입 시 <Link href="/terms" className="underline">이용약관</Link> 및 <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.
        </p>
      </div>
    </div>
  )
}

function RoleCard({ icon: Icon, title, description, selected, onClick }: { icon: React.ElementType; title: string; description: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn('w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4', selected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white')}>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', selected ? 'bg-blue-100' : 'bg-gray-100')}>
        <Icon size={18} className={selected ? 'text-blue-600' : 'text-gray-500'} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 text-sm">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
      {selected && <CheckCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />}
    </button>
  )
}
