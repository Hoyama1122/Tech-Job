import api from "@/lib/axiosClient";

export interface CreateItemPayload {
  code: string;
  name: string;
  model?: string;
  brand?: string;
  type: "EQUIPMENT" | "MATERIAL";
  quantity: number;
  unit: string;
  note?: string;
}

export const itemService = {
  createItem: async (payload: CreateItemPayload) => {
    const res = await api.post("/items", payload);
    return res.data;
  },

  getItems: async () => {
    const res = await api.get("/items");
    return res.data;
  },

  getItemById: async (id: number) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  updateItem: async (id: number, data: any) => {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },
  deleteItem: async (id: number) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};
