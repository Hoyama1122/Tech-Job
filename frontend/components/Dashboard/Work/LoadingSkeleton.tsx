// components/Dashboard/Work/LoadingSkeleton.tsx
export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return [...Array(count)].map((_, i) => (
    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ));
}