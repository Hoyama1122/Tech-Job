import api from "@/lib/axiosClient";



export type UserItem = {
  id: number;
  empno: string;
  email: string;
  role: string;
  department?: {
    id: number;
    name: string;
  } | null;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    phone?: string | null;
    address?: string | null;
    avatar?: string | null;
    gender?: string | null;
    birthday?: string | null;
  } | null;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  empno: string;
  address?: string;
  birthday?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  departmentId?: number | null;
  role: string;
  phone?: string;
  avatar?: string;
};

export type UpdateUserPayload = {
  id: number;
  email?: string;
  password?: string;
  empno?: string;
  address?: string;
  birthday?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  departmentId?: number | null;
  role?: string;
  phone?: string;
  avatar?: string;
};

export const userService = {
  async getUsers() {
    const res = await api.get("/users");
    return res.data;
  },

  async getUserById(id: number | string) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async createUser(payload: CreateUserPayload) {
    const res = await api.post("/users", payload);
    return res.data;
  },

  async updateUser(payload: UpdateUserPayload) {
    const res = await api.put(`/users/${payload.id}`, payload);
    return res.data;
  },

  async deleteUser(id: number | string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};