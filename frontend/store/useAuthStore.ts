import { create } from "zustand";
import { persist } from "zustand/middleware";


type Role = "admin" | "supervisor" | "technician" | "executive" | null;

interface AuthState {
  role: Role;
  supervisorId?: string;
  token?: string;
  login: (email: string, password: string) => Role;
  logout: () => void;
}

//
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      supervisorId: undefined,
      token: undefined,

      login: (email, password) => {
        const emailLower = email.toLowerCase();

        if (emailLower === "admin@gmail.com" && password === "admin123") {
          set({
            role: "admin",
            token: "admin-token",
          });
          return "admin";
        }

        //  Supervisor 1
        if (
          emailLower === "supervisor1@gmail.com" &&
          password === "supervisor"
        ) {
          set({
            role: "supervisor",
            supervisorId: "1",
            token: "supervisor-token-1",
          });
          return "supervisor";
        }

        //  Supervisor 2
        if (
          emailLower === "supervisor2@gmail.com" &&
          password === "supervisor"
        ) {
          set({
            role: "supervisor",
            supervisorId: "2",
            token: "supervisor-token-2",
          });
          return "supervisor";
        }

        // Technician 1
        if (emailLower === "tech1@gmail.com" && password === "technician") {
          set({
            role: "technician",
            supervisorId: "1",
            token: "technician-token-1",
          });
          return "technician";
        }

        //  Technician 2
        if (emailLower === "tech2@gmail.com" && password === "technician") {
          set({
            role: "technician",
            supervisorId: "2",
            token: "technician-token-2",
          });
          return "technician";
        }

       
        if (emailLower === "executive@gmail.com" && password === "executive") {
          set({
            role: "executive",
            token: "executive-token",
          });
          return "executive";
        }

      
        return null;
      },

      // 🚪 Logout
      logout: () =>
        set({
          role: null,
          supervisorId: undefined,
          token: undefined,
        }),
    }),
    {
      name: "auth-storage", 
    }
  )
);
