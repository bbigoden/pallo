export default function PrivacyPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2025년 4월 25일</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">1. 수집하는 개인정보 항목</h2>
            <p className="mb-2 font-medium text-gray-800">회원가입 시</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>필수: 이메일 주소, 비밀번호, 이름, 연락처</li>
              <li>업체 회원 추가: 업체명, 대부업 등록번호, 대출 조건 정보</li>
            </ul>
            <p className="mb-2 font-medium text-gray-800">서비스 이용 시</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>접속 IP, 접속 시간, 서비스 이용 기록</li>
              <li>견적 요청 내용 (대출 종류, 희망 금액, 신용 정보 등)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">2. 개인정보 수집 및 이용 목적</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>회원 관리 및 서비스 제공</li>
              <li>업체 프로필 및 상품 정보 노출</li>
              <li>견적 요청 게시 및 업체-차주 간 연결</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>법령 준수 및 분쟁 해결</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>회원 정보: 탈퇴 후 30일까지 (단, 법령에 따라 별도 보관이 필요한 경우 제외)</li>
              <li>전자금융 거래 기록: 5년 (전자금융거래법)</li>
              <li>소비자 불만 기록: 3년 (전자상거래법)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">4. 개인정보 제3자 제공</h2>
            <p>팔로는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">5. 개인정보 처리 위탁</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left">수탁업체</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Supabase Inc.</td>
                    <td className="border border-gray-200 px-3 py-2">회원 인증 및 데이터 저장</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Vercel Inc.</td>
                    <td className="border border-gray-200 px-3 py-2">서비스 호스팅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">6. 이용자의 권리</h2>
            <p className="mb-2">이용자는 언제든지 다음 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>개인정보 열람 요청</li>
              <li>개인정보 정정·삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴 (대시보드 &gt; 설정에서 가능)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">7. 개인정보보호 책임자</h2>
            <p>개인정보 관련 문의, 불만, 피해구제 등은 아래로 연락해 주세요:</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-xl text-gray-600">
              <p>이메일: privacy@pallo.co.kr</p>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">8. 개인정보처리방침 변경</h2>
            <p>이 방침은 법령 및 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 고지합니다.</p>
          </section>

        </div>
      </div>
    </main>
  )
}
