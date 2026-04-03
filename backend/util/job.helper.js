/**
 * แปลง id ใบงานให้เป็นรูปแบบ JOB-0001
 */
export const formatJobId = (id) => {
  return `JOB-${String(id).padStart(4, "0")}`;
};

/**
 * รวมชื่อจาก object user ที่มี profile
 * รองรับทั้ง
 * user.profile.firstname / lastname
 * หรือ object ที่ส่ง firstname / lastname มาโดยตรง
 */
export const getFullName = (userOrFirst, last) => {
  if (!userOrFirst) return "";

  // Support separate string arguments
  if (typeof userOrFirst === "string") {
    return [userOrFirst, last].filter(Boolean).join(" ").trim();
  }

  // Support user object with nested profile
  const firstname = userOrFirst?.profile?.firstname ?? userOrFirst?.firstname ?? "";
  const lastname = userOrFirst?.profile?.lastname ?? userOrFirst?.lastname ?? "";

  return [firstname, lastname].filter(Boolean).join(" ").trim();
};

/**
 * normalize technicianId ให้กลายเป็น array ของ number
 *
 * รองรับ input หลายรูปแบบ:
 * - undefined
 * - null
 * - ""
 * - "5"
 * - 5
 * - [1,2,3]
 * - ["1","2","3"]
 * - "1,2,3"
 * - ["1,2,3"]
 */
export const normalizeTechnicianIds = (technicianId) => {
  if (
    technicianId === undefined ||
    technicianId === null ||
    technicianId === ""
  ) {
    return [];
  }

  let rawValues = [];

  if (Array.isArray(technicianId)) {
    rawValues = technicianId.flatMap((item) => {
      if (typeof item === "string" && item.includes(",")) {
        return item.split(",");
      }
      return item;
    });
  } else if (typeof technicianId === "string" && technicianId.includes(",")) {
    rawValues = technicianId.split(",");
  } else {
    rawValues = [technicianId];
  }

  const normalized = rawValues
    .map((value) => String(value).trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  return [...new Set(normalized)];
};

/**
 * ตรวจว่า end time ต้องไม่น้อยกว่า start time
 */
export const validateAvailableRange = ({
  start_available_at,
  end_available_at,
}) => {
  if (!start_available_at || !end_available_at) {
    return {
      valid: true,
      message: null,
    };
  }

  const start = new Date(start_available_at);
  const end = new Date(end_available_at);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return {
      valid: false,
      message: "รูปแบบวันเวลาไม่ถูกต้อง",
    };
  }

  if (end < start) {
    return {
      valid: false,
      message: "วันเวลาสิ้นสุดต้องมากกว่าหรือเท่ากับวันเวลาเริ่มต้น",
    };
  }

  return {
    valid: true,
    message: null,
  };
};

/**
 * แปลงค่า location จาก req.body
 */
export const normalizeLocationFields = ({
  latitude,
  longitude,
  location_name,
}) => {
  return {
    latitude:
      latitude === undefined
        ? undefined
        : latitude === ""
        ? null
        : Number(latitude),

    longitude:
      longitude === undefined
        ? undefined
        : longitude === ""
        ? null
        : Number(longitude),

    location_name:
      location_name === undefined ? undefined : location_name || null,
  };
};

/**
 * แปลง datetime fields จาก req.body
 */
export const normalizeDateFields = ({
  start_available_at,
  end_available_at,
}) => {
  return {
    start_available_at:
      start_available_at === undefined
        ? undefined
        : start_available_at
        ? new Date(start_available_at)
        : null,

    end_available_at:
      end_available_at === undefined
        ? undefined
        : end_available_at
        ? new Date(end_available_at)
        : null,
  };
};