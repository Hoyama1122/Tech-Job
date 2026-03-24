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