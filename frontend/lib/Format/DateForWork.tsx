const DateFormat = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "ไม่สามารถอ่านวันที่ได้";

  const day = date.getDate();
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear() + 543;
  

  return `${day} ${month} ${year} `;
};

export default DateFormat;