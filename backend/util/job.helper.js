export const getFullName = (user) => {
  if (!user) return null;

  const firstname = user.profile?.firstname || "";
  const lastname = user.profile?.lastname || "";

  const fullname = `${firstname} ${lastname}`.trim();

  return fullname || user.empno || "ไม่ระบุ";
};

export const formatJobId = (id) => {
  return `JOB-${String(id).padStart(4, "0")}`;
};

export const normalizeTechnicianIds = (technicianId) => {
  if (!technicianId) return [];

  // กรณีส่งมาเป็น array เช่น [1,2,3]
  if (Array.isArray(technicianId)) {
    return [...new Set(technicianId.map((id) => Number(id)).filter(Boolean))];
  }

  // กรณีส่งมาเป็น string เช่น "1,2,3"
  if (typeof technicianId === "string") {
    return [
      ...new Set(
        technicianId
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean)
      ),
    ];
  }

  // กรณีส่งมาเป็นตัวเดียว
  const id = Number(technicianId);
  return id ? [id] : [];
};