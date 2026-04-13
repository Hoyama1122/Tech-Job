import api from "@/lib/axiosClient";

export type UserRole =
  | "ADMIN"
  | "SUPERVISOR"
  | "TECHNICIAN"
  | "EXECUTIVE"
  | "SUPERADMIN";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  role: UserRole;
  token?: string;
  user?: {
    id: number;
    email: string;
    empno?: string;
    role: UserRole;
  };
};

export const authService = {
  async login(data: LoginPayload): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/auth/login", data, {
      withCredentials: true,
    });
    return res.data;
  },

  async logout() {
    const res = await api.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  async me() {
    const res = await api.get("/auth/me", {
      withCredentials: true,
    });
    return res.data;
  },
};
