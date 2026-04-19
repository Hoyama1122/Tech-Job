import api from "@/lib/axiosClient";

export type JobStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface CreateJobPayload {
  title: string;
  description?: string;
  departmentId: number;
  supervisorId?: number;
  technicianId?: number | number[];
  start_available_at?: string;
  end_available_at?: string;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string;
  images?: File[];
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  departmentId?: number;
  status?: JobStatus;
  start_available_at?: string;
  end_available_at?: string;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string;
  technicianId?: number | number[];
  images?: File[];
}

export const jobService = {
  async getJobs() {
    const res = await api.get("/jobs");
    return res.data;
  },

  async getJobById(id: number | string) {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  async createJob(payload: CreateJobPayload) {
    const formData = new FormData();

    formData.append("title", payload.title);

    if (payload.description) {
      formData.append("description", payload.description);
    }

    formData.append("departmentId", String(payload.departmentId));

    if (payload.supervisorId) {
      formData.append("supervisorId", String(payload.supervisorId));
    }

    if (payload.technicianId) {
      if (Array.isArray(payload.technicianId)) {
        payload.technicianId.forEach((id) => {
          formData.append("technicianId", String(id));
        });
      } else {
        formData.append("technicianId", String(payload.technicianId));
      }
    }

    if (payload.start_available_at) {
      formData.append("start_available_at", payload.start_available_at);
    }

    if (payload.end_available_at) {
      formData.append("end_available_at", payload.end_available_at);
    }

    if (payload.latitude !== undefined && payload.latitude !== null) {
      formData.append("latitude", String(payload.latitude));
    }

    if (payload.longitude !== undefined && payload.longitude !== null) {
      formData.append("longitude", String(payload.longitude));
    }

    if (payload.location_name) {
      formData.append("location_name", payload.location_name);
    }

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.post("/jobs", formData);

    return res.data;
  },

  async updateJob(id: number | string, payload: UpdateJobPayload) {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description !== undefined) formData.append("description", payload.description);
    if (payload.departmentId) formData.append("departmentId", String(payload.departmentId));
    if (payload.status) formData.append("status", payload.status);
    
    if (payload.technicianId !== undefined) {
      if (Array.isArray(payload.technicianId)) {
        payload.technicianId.forEach((techId) => {
          formData.append("technicianId", String(techId));
        });
      } else {
        formData.append("technicianId", String(payload.technicianId));
      }
    }

    if (payload.start_available_at) formData.append("start_available_at", payload.start_available_at);
    if (payload.end_available_at) formData.append("end_available_at", payload.end_available_at);
    
    if (payload.latitude !== undefined && payload.latitude !== null) formData.append("latitude", String(payload.latitude));
    if (payload.longitude !== undefined && payload.longitude !== null) formData.append("longitude", String(payload.longitude));
    if (payload.location_name !== undefined) formData.append("location_name", payload.location_name);

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    } else if (payload.images && payload.images.length === 0) {
      // If we want to explicitly clear images, backend logic might need an empty array or custom field.
      // Currently, backend deletes old ones and doesn't insert if empty.
    }

    const res = await api.put(`/jobs/${id}`, formData);
    return res.data;
  },

  async deleteJob(id: number | string) {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },
  async getMyJobs() {
    const res = await api.get("/jobs/my", {
      withCredentials: true, 
    });
    return res.data;
  },
  async getMyJobDetail(id: number | string) {
    const res = await api.get(`/jobs/my/${id}`);
    return res.data;
  },
  async updateMyJobStatus(id: number | string, status: string) {
    const res = await api.patch(`/jobs/my/${id}/status`, { status });
    return res.data;
  },
  async getJobsWithLocation() {
  const res = await api.get("/jobs/with-location");
  return res.data; // { jobs: JobLocation[] }
},
};
