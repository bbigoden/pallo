'use client'

import { useState } from 'react'
import { Phone, Mail, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactModalProps {
  companyName: string
  contactPhone: string
  contactEmail: string
  onClose: () => void
}

export function ContactModal({ companyName, contactPhone, contactEmail, onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-gray-900 text-lg">{companyName}</h2>
            <p className="text-sm text-gray-400">업체에 직접 연락하세요</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <a href={`tel:${contactPhone}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Phone size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-0.5">전화</div>
              <div className="font-bold text-gray-900">{contactPhone}</div>
            </div>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-400" />
          </a>

          <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-0.5">이메일</div>
              <div className="font-bold text-gray-900">{contactEmail}</div>
            </div>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-400" />
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          팔로는 홍보 플랫폼으로, 대출 중개를 하지 않습니다
        </p>

        <Button variant="outline" className="w-full mt-3" onClick={onClose}>닫기</Button>
      </div>
    </div>
  )
}
