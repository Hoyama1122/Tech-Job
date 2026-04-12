import api from "@/lib/axiosClient";

export interface CreateReportPayload {
  jobId: number | string;
  status?: string;
  start_time?: string;
  end_time?: string;
  detail?: string;
  repair_operations?: string;
  inspection_results?: string;
  summary?: string;
  images?: File[];
  cus_sign?: File;
}

export const reportService = {
  async createReport(payload: CreateReportPayload) {
    const formData = new FormData();
    formData.append("jobId", String(payload.jobId));
    if (payload.status) formData.append("status", payload.status);
    if (payload.start_time) formData.append("start_time", payload.start_time);
    if (payload.end_time) formData.append("end_time", payload.end_time);
    if (payload.detail) formData.append("detail", payload.detail);
    if (payload.repair_operations) formData.append("repair_operations", payload.repair_operations);
    if (payload.inspection_results) formData.append("inspection_results", payload.inspection_results);
    if (payload.summary) formData.append("summary", payload.summary);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (payload.cus_sign) {
      formData.append("cus_sign", payload.cus_sign);
    }

    const res = await api.post("/job-reports", formData);
    return res.data;
  },

  async getReportByJobId(jobId: number | string) {
    const res = await api.get(`/job-reports/job/${jobId}`);
    return res.data;
  },
};
