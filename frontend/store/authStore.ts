import { create } from "zustand";
import axios from "axios";

export type Profile = {
  firstname?: string | null;
  lastname?: string | null;
  phone?: string | null;
  avatar?: string | null;
  gender?: string | null;
  birthday?: string | null;
  address?: string | null;
};

export type Department = {
  id: number;
  name: string;
};

export type Me = {
  id: number;
  empno: string;
  email: string;
  role: string;
  department?: Department | null;
  profile?: Profile | null;
};

type AuthStore = {
  me: Me | null;
  loading: boolean;
  error: string | null;

  fetchMe: () => Promise<void>;
  clearMe: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAuthStore = create<AuthStore>((set) => ({
  me: null,
  loading: false,
  error: null,

  fetchMe: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });

      set({
        me: res.data.user,
        loading: false,
      });
    } catch (error: any) {
      set({
        me: null,
        loading: false,
        error: error?.response?.data?.error || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ",
      });
    }
  },

  clearMe: () => set({ me: null }),
}));