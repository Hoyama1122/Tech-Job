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

type ApiListResponse<T> = {
  message?: string;
  data?: T[];
};

type ApiItemResponse<T> = {
  message?: string;
  data?: T;
};

export const userService = {
  async getUsers(): Promise<UserItem[]> {
    const res = await api.get<ApiListResponse<UserItem>>("/users");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  async getUserById(id: number | string): Promise<UserItem | null> {
    const res = await api.get<ApiItemResponse<UserItem>>(`/users/${id}`);
    return res.data?.data ?? null;
  },

  async createUser(payload: CreateUserPayload) {
    const res = await api.post<ApiItemResponse<UserItem>>("/users", payload);
    return res.data;
  },

  async updateUser(payload: UpdateUserPayload) {
    const res = await api.put<ApiItemResponse<UserItem>>("/users", payload);
    return res.data;
  },

  async deleteUser(id: number | string) {
    const res = await api.delete<{ message?: string }>(`/users/${id}`);
    return res.data;
  },
};