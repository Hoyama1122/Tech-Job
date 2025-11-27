export const getStatusClass = (status: string) => {
  switch (status) {
    case "สำเร็จ":
      return "bg-green-100 text-green-700";
    case "รอดำเนินการ":
      return "bg-yellow-100 text-yellow-700";
    case "ตีกลับ":
      return "bg-red-100 text-red-700";
    case "รอการตรวจสอบ":
      return "bg-blue-100 text-blue-700";
    case "รอการดำเนินงาน":
      return "bg-purple-100 text-white";
    default:
      return "bg-gray-50 text-gray-600";
  }
};