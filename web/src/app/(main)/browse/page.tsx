'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LenderCard from '@/components/lender/LenderCard'
import { createClient } from '@/lib/supabase/client'
import { MOCK_LENDERS } from '@/lib/mock-data'
import { LOAN_TYPE_LABELS, type LoanType, type LenderProfile } from '@/types'
import { cn } from '@/lib/utils'

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '경남', '울산', '전국']
const SORT_OPTIONS = [
  { value: 'rating', label: '평점 높은순' },
  { value: 'rate_low', label: '금리 낮은순' },
  { value: 'amount_high', label: '한도 높은순' },
  { value: 'newest', label: '최신순' },
]

export default function BrowsePage() {
  const [lenders, setLenders] = useState<LenderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [selectedType, setSelectedType] = useState<LoanType | 'all'>('all')
  const [sort, setSort] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchLenders() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lender_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      const normalized = data && data.length > 0
        ? data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            companyName: d.company_name ?? '',
            description: d.description ?? '',
            licenseNumber: d.license_number,
            contactPhone: d.contact_phone,
            contactEmail: d.contact_email,
            interestRateMin: d.interest_rate_min,
            interestRateMax: d.interest_rate_max,
            loanAmountMin: d.loan_amount_min,
            loanAmountMax: d.loan_amount_max,
            loanTypes: d.loan_types ?? [],
            region: d.region ?? [],
            plan: d.plan,
            isVerified: d.is_verified,
            createdAt: d.created_at,
          }))
        : MOCK_LENDERS
      setLenders(normalized as LenderProfile[])
      setLoading(false)
    }
    fetchLenders()
  }, [])

  const filtered = useMemo(() => {
    let list = [...lenders]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(l => l.companyName.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
    }
    if (selectedRegion !== '전체') {
      list = list.filter(l => l.region.includes(selectedRegion) || l.region.includes('전국'))
    }
    if (selectedType !== 'all') {
      list = list.filter(l => l.loanTypes.includes(selectedType))
    }
    list.sort((a, b) => {
      if (sort === 'rate_low') return a.interestRateMin - b.interestRateMin
      if (sort === 'amount_high') return b.loanAmountMax - a.loanAmountMax
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      const scoreA = (a.isVerified ? 2 : 0) + (a.plan === 'premium' ? 1 : 0)
      const scoreB = (b.isVerified ? 2 : 0) + (b.plan === 'premium' ? 1 : 0)
      return scoreB - scoreA
    })
    return list
  }, [lenders, search, selectedRegion, selectedType, sort])

  const activeFilters = [
    selectedRegion !== '전체' ? selectedRegion : null,
    selectedType !== 'all' ? LOAN_TYPE_LABELS[selectedType] : null,
  ].filter(Boolean)

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">업체 찾기</h1>
          <p className="text-gray-500 text-sm mb-6">조건에 맞는 대부업체를 검색하고 직접 문의하세요</p>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="업체명으로 검색..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" />
            </div>
            <Button variant="outline" className={cn('h-11 gap-2', showFilters && 'border-blue-400 text-blue-600 bg-blue-50')} onClick={() => setShowFilters(v => !v)}>
              <SlidersHorizontal size={15} />필터
              {activeFilters.length > 0 && <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>}
            </Button>
            <Select value={sort} onValueChange={(v) => v && setSort(v)}>
              <SelectTrigger className="w-36 h-11">
                <span>{SORT_OPTIONS.find(o => o.value === sort)?.label ?? '정렬'}</span>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">지역</p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => setSelectedRegion(r)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', selectedRegion === r ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300')}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">대출 종류</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedType('all')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300')}>전체</button>
                  {(Object.entries(LOAN_TYPE_LABELS) as [LoanType, string][]).map(([type, label]) => (
                    <button key={type} onClick={() => setSelectedType(type)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', selectedType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300')}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {activeFilters.map(f => (
                <Badge key={f} variant="secondary" className="gap-1 pr-1">{f}
                  <button onClick={() => { if (f === selectedRegion) setSelectedRegion('전체'); else setSelectedType('all') }} className="hover:text-red-500"><X size={12} /></button>
                </Badge>
              ))}
              <button className="text-xs text-gray-400 hover:text-gray-600" onClick={() => { setSelectedRegion('전체'); setSelectedType('all') }}>전체 초기화</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-900">{filtered.length}개</span> 업체
        </p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-3 mb-4"><div className="w-12 h-12 bg-gray-100 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-2/3" /><div className="h-3 bg-gray-100 rounded w-1/3" /></div></div>
                <div className="space-y-2"><div className="h-3 bg-gray-100 rounded" /><div className="h-3 bg-gray-100 rounded w-4/5" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-gray-300 text-sm">다른 조건으로 검색해보세요</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(lender => <LenderCard key={lender.id} {...lender} rating={4.5} reviewCount={12} />)}
          </div>
        )}
      </div>
    </main>
  )
}
