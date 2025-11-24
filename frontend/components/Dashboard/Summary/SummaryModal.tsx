const SummaryModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 rounded-lg text-primary">
            {data.icon}
          </div>
          <h2 className="text-xl font-bold">{data.title}</h2>
        </div>

        {/* Value */}
        <p className="text-4xl font-extrabold text-primary mb-4">
          {data.value.toLocaleString()}
        </p>

        {/* ตรงนี้ไว้ใส่ข้อมูลเฉพาะของแต่ละสรุป */}
        <div className="text-gray-600 space-y-2 text-sm">
          <p>รายละเอียดของ: {data.title}</p>
          <p>เพิ่ม list งาน / รายชื่อช่าง ได้หมด</p>
        </div>

      </div>
    </div>
  );
};

export default SummaryModal;
