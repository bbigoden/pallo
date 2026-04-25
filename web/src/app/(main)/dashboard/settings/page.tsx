'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    licenseNumber: '',
    contactPhone: '',
    contactEmail: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('lender_profiles').select('*').eq('user_id', user.id).single()

      if (!profile) { router.push('/onboarding'); return }

      setProfileId(profile.id)
      setForm({
        companyName: profile.company_name ?? '',
        description: profile.description ?? '',
        licenseNumber: profile.license_number ?? '',
        contactPhone: profile.contact_phone ?? '',
        contactEmail: profile.contact_email ?? '',
      })
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profileId) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('lender_profiles').update({
        company_name: form.companyName,
        description: form.description,
        license_number: form.licenseNumber || null,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail,
      }).eq('id', profileId)
      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
    } finally {
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
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
              <ChevronLeft size={16} />대시보드
            </Button>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">업체 정보 설정</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">기본 정보</h2>
            <div className="space-y-1.5">
              <Label htmlFor="companyName">업체명 *</Label>
              <Input id="companyName" value={form.companyName}
                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">업체 소개</Label>
              <Textarea id="description" rows={4} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber">대부업 등록번호 (선택)</Label>
              <Input id="licenseNumber" value={form.licenseNumber}
                onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-800">연락처</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">전화번호 *</Label>
                <Input id="contactPhone" value={form.contactPhone}
                  onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">이메일 *</Label>
                <Input id="contactEmail" type="email" value={form.contactEmail}
                  onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} required />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3">저장되었습니다.</p>}

          <Button type="submit" className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-4 gap-2" disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} />저장하기</>}
          </Button>
        </form>
      </div>
    </main>
  )
}
