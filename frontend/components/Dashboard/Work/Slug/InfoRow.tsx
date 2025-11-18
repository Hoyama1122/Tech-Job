export default function InfoRow({ label, value, isBadge, valueClass }: any) {
  return (
    <div className="flex justify-between py- border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>

      {isBadge ? (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${valueClass}`}>
          {value}
        </span>
      ) : (
        <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
      )}
    </div>
  );
}
