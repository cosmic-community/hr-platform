export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg w-64" />
      <div className="h-5 bg-gray-100 rounded w-96" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-40" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}