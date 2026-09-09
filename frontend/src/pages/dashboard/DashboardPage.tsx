export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your interview dashboard</p>
      </div>

      {/* Coming soon message */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Coming Soon</h2>
        <p className="text-gray-600">
          This page will display your interview history, upcoming interviews, and progress.
        </p>
      </div>
    </div>
  )
}
