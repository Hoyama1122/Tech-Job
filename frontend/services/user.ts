// คานนท์ทำเพิ่ม

import api from "@/lib/api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await api.get(`/user/${id}`);
  return res.data;
};

export const createUser = async (payload: {
  email: string;
  password: string;
  empno: string;
  address: string;
  birthday: string;
  firstname: string;
  lastname: string;
  gender: string;
  departmentId: number;
  role: string;
  phone?: string;
  avatar?: string;
}) => {
  const res = await api.post("/users", payload);
  return res.data;
};

export const updateUser = async (payload: {
  id: number;
  email?: string;
  password?: string;
  empno?: string;
  address?: string;
  birthday?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  departmentId?: number;
  role?: string;
  phone?: string;
  avatar?: string;
}) => {
  const res = await api.put("/users", payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};