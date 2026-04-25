export type UserRole = 'borrower' | 'lender' | 'admin'

export type PlanType = 'free' | 'standard' | 'premium'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  phone?: string
  createdAt: string
}

export interface LenderProfile {
  id: string
  userId: string
  companyName: string
  description: string
  logoUrl?: string
  licenseNumber?: string
  interestRateMin: number
  interestRateMax: number
  loanAmountMin: number
  loanAmountMax: number
  loanTypes: LoanType[]
  region: string[]
  plan: PlanType
  isVerified: boolean
  contactPhone: string
  contactEmail: string
  createdAt: string
}

export interface LenderProduct {
  id: string
  lenderId: string
  title: string
  description: string
  interestRate: number
  loanAmountMin: number
  loanAmountMax: number
  loanPeriodMonths: number
  requirements: string[]
  loanType: LoanType
  isActive: boolean
  createdAt: string
}

export interface BorrowerRequest {
  id: string
  userId: string
  title: string
  description: string
  desiredAmount: number
  desiredPeriodMonths: number
  loanType: LoanType
  creditScore?: CreditScoreRange
  collateral?: string
  region: string
  status: RequestStatus
  viewCount: number
  createdAt: string
}

export type LoanType =
  | 'personal'      // 개인신용대출
  | 'mortgage'      // 담보대출
  | 'business'      // 사업자대출
  | 'emergency'     // 긴급소액대출
  | 'refinance'     // 대환대출

export type CreditScoreRange =
  | 'excellent'     // 900이상
  | 'good'          // 800-899
  | 'fair'          // 700-799
  | 'poor'          // 700미만

export type RequestStatus =
  | 'active'        // 모집중
  | 'closed'        // 마감
  | 'hidden'        // 숨김

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Review {
  id: string
  lenderId: string
  authorId: string
  rating: number
  content: string
  createdAt: string
}

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  personal: '개인신용대출',
  mortgage: '담보대출',
  business: '사업자대출',
  emergency: '긴급소액대출',
  refinance: '대환대출',
}

export const PLAN_LIMITS: Record<PlanType, { products: number; inquiriesPerMonth: number; label: string }> = {
  free: { products: 1, inquiriesPerMonth: 10, label: '무료' },
  standard: { products: 5, inquiriesPerMonth: 50, label: '스탠다드' },
  premium: { products: -1, inquiriesPerMonth: -1, label: '프리미엄' }, // -1 = 무제한
}
