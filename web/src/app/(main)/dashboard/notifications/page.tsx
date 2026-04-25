import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">알림</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Bell size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400">아직 알림이 없습니다</p>
        </div>
      </div>
    </main>
  )
}
