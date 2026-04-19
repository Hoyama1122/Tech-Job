import { useEffect, useState } from "react";
import axios from "axios";

interface JobStats {
  "รอการตรวจสอบ": number;
  "รอการดำเนินงาน": number;
  "กำลังทำงาน": number;
  "สำเร็จ": number;
  "ตีกลับ": number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
        withCredentials: true,
      })
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}