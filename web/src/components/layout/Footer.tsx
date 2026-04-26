import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-black text-white">pallo</span>
            <p className="mt-3 text-sm leading-relaxed">
              대부업 홍보 플랫폼<br />
              차주와 업체를 연결합니다
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="hover:text-white transition-colors">대출 찾기</Link></li>
              <li><Link href="/request" className="hover:text-white transition-colors">견적 요청</Link></li>
              <li><Link href="/register?role=lender" className="hover:text-white transition-colors">업체 등록</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">이용안내</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">요금제</Link></li>
              <li><Link href="/requests" className="hover:text-white transition-colors">견적 게시판</Link></li>
              <li><Link href="/register?role=lender" className="hover:text-white transition-colors">업체 회원가입</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">법적 고지</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-xs space-y-1">
          <p>팔로(Pallo)는 대부업체의 광고·홍보 서비스를 제공하는 정보 플랫폼으로, 대출 중개 및 대출 알선을 하지 않습니다.</p>
          <p>대출 이자율, 조건 등은 해당 업체에 직접 문의하시기 바랍니다.</p>
          <p className="mt-3">© 2025 Pallo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
