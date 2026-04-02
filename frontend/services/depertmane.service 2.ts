import api from "@/lib/axiosClient";

export const department = {
  getDepartments: async () => {
    const res = await api.get("/department");
    return res.data;
  },
  createDepartment: async (data: { name: string; description?: string }) => {
    const res = await api.post("/department", data);
    return res.data;
  },

  updateDepartment: async (
    id: number,
    data: { name: string; description?: string }
  ) => {
    const res = await api.put(`/department/${id}`, data);
    return res.data;
    
  },

  deleteDepartment: async (id: number) => {
    const res = await api.delete(`/department/${id}`);
    return res.data;
  },
};
