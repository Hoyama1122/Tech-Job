export default function DescriptionCard({ job }: any) {
  if (!job.description) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">รายละเอียดงาน</h2>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
        {job.description}
      </p>
    </div>
  );
}
