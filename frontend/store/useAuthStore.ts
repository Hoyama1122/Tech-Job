import { create } from "zustand";
import { authService, UserRole } from "@/services/auth.service";
import { disconnectSocket } from "@/lib/socket";

let fetchMePromise: Promise<any> | null = null;

export type AuthUser = {
  id: number;
  email: string;
  empno?: string;
  role: UserRole;
  departmentId?: number | null;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    phone?: string | null;
  } | null;
};

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchMe: (force?: boolean) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  hasFetched: false,
  error: null,

  fetchMe: async (force = false) => {
    const { hasFetched, isLoading } = get();

    // Skip if already fetched and not forced
    if (hasFetched && !force) return;

    // If there's already a request in flight, wait for it
    if (fetchMePromise) {
      await fetchMePromise;
      return;
    }

    set({ isLoading: true, error: null });

    fetchMePromise = authService.me();

    try {
      const res = await fetchMePromise;
      set({
        user: res?.user || null,
        hasFetched: true,
        isLoading: false
      });
    } catch (err: any) {
      console.error("fetchMe error:", err);
      set({
        user: null,
        hasFetched: true,
        isLoading: false,
        error: "กรุณาเข้าสู่ระบบ"
      });
    } finally {
      fetchMePromise = null;
    }
  },

  setUser: (user) => set({ user, hasFetched: true }),

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      disconnectSocket();
      set({ user: null, hasFetched: false });
    }
  },
}));
