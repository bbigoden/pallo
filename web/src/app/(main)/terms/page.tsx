export default function TermsPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2025년 4월 25일</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제1조 (목적)</h2>
            <p>이 약관은 팔로(이하 "서비스")가 제공하는 금융 홍보 플랫폼 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제2조 (서비스의 성격)</h2>
            <p className="mb-2">팔로는 대부업체 및 금융 관련 업체의 정보를 제공하는 홍보 플랫폼입니다.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>팔로는 대출 중개 서비스를 제공하지 않습니다.</li>
              <li>팔로는 금융기관이 아니며 대출 계약의 당사자가 되지 않습니다.</li>
              <li>실제 대출 계약은 이용자와 업체 간에 직접 체결됩니다.</li>
              <li>팔로는 대출 조건, 승인 여부에 대해 어떠한 보증도 하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제3조 (이용자의 의무)</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>이용자는 허위 정보를 등록해서는 안 됩니다.</li>
              <li>타인의 개인정보를 무단으로 수집하거나 이용해서는 안 됩니다.</li>
              <li>서비스를 이용하여 불법적인 행위를 해서는 안 됩니다.</li>
              <li>등록되지 않은 대부업체로서 영업 행위를 해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제4조 (업체 회원의 의무)</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>업체 회원은 대부업법에 따라 적법하게 등록된 업체여야 합니다.</li>
              <li>등록한 대출 조건(금리, 한도 등)은 실제와 일치해야 합니다.</li>
              <li>법정 최고 이자율을 초과하는 이자를 요구해서는 안 됩니다.</li>
              <li>허위·과장 광고를 해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제5조 (서비스 이용 요금)</h2>
            <p className="mb-2">기본 서비스는 무료로 제공됩니다. 유료 플랜(스탠다드, 프리미엄)의 요금은 서비스 내 요금제 페이지에서 확인할 수 있으며, 사전 고지 없이 변경될 수 있습니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제6조 (서비스 중단 및 변경)</h2>
            <p>팔로는 서비스의 내용, 운영, 기술적 사양 등을 변경하거나 서비스를 중단할 수 있습니다. 중요한 변경 사항은 사전에 공지합니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제7조 (면책조항)</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>팔로는 이용자와 업체 간의 대출 계약에 관여하지 않으며, 이로 인한 분쟁에 책임을 지지 않습니다.</li>
              <li>업체가 제공하는 정보의 정확성에 대해 보증하지 않습니다.</li>
              <li>불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">제8조 (분쟁 해결)</h2>
            <p>서비스 이용과 관련된 분쟁은 대한민국 법을 준거법으로 하며, 서울중앙지방법원을 전속 관할 법원으로 합니다.</p>
          </section>

        </div>
      </div>
    </main>
  )
}
