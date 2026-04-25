import Link from 'next/link'
import { MapPin, Star, Shield, TrendingDown, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatAmount, formatRate } from '@/lib/utils'
import { LOAN_TYPE_LABELS, type LoanType, type PlanType } from '@/types'

interface LenderCardProps {
  id: string
  companyName: string
  description: string
  interestRateMin: number
  interestRateMax: number
  loanAmountMin: number
  loanAmountMax: number
  loanTypes: LoanType[]
  region: string[]
  isVerified: boolean
  plan: PlanType
  rating?: number
  reviewCount?: number
}

export default function LenderCard({
  id,
  companyName,
  description,
  interestRateMin,
  interestRateMax,
  loanAmountMin,
  loanAmountMax,
  loanTypes,
  region,
  isVerified,
  plan,
  rating,
  reviewCount,
}: LenderCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-lg font-black text-blue-600">
            {companyName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{companyName}</span>
              {isVerified && (
                <Shield size={14} className="text-blue-500" />
              )}
              {plan === 'premium' && (
                <Badge className="text-xs bg-amber-100 text-amber-700 border-0 px-1.5 py-0">PRO</Badge>
              )}
            </div>
            {rating !== undefined && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-500">{rating.toFixed(1)} ({reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <TrendingDown size={11} /> 금리
          </div>
          <div className="font-bold text-blue-600">
            {formatRate(interestRateMin)} ~ {formatRate(interestRateMax)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs text-gray-400 mb-1">대출 한도</div>
          <div className="font-bold text-gray-800">
            {formatAmount(loanAmountMin)} ~ {formatAmount(loanAmountMax)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {loanTypes.map(t => (
          <Badge key={t} variant="outline" className="text-xs px-2 py-0.5">
            {LOAN_TYPE_LABELS[t]}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={11} />
          <span>{region.slice(0, 2).join(', ')}{region.length > 2 ? ` 외 ${region.length - 2}곳` : ''}</span>
        </div>
        <Link href={`/profile/${id}`}>
          <Button size="sm" variant="outline" className="text-xs h-8 group-hover:border-blue-300 group-hover:text-blue-600">
            상세보기 <ArrowRight size={12} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
