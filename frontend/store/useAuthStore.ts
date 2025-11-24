import { Users } from "@/lib/Mock/UserMock";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "supervisor" | "technician" | "executive" | "ceo" | null;

interface AuthState {
  role: Role;
  token?: string;
  name?: string;
  email?: string;
  userId?: number;
  employeeCode?: string;
  supervisorId?: string;
  login: (email: string, password: string) => Role;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      token: undefined,
      name: undefined,
      email: undefined,
      userId: undefined,
      employeeCode: undefined,

      login: (email, password) => {
        const emailLower = email.toLowerCase();
        const foundUser = Users.find(
          (u) => u.email?.toLowerCase() === emailLower && u.password === password
        );

        if (foundUser) {
          set({
            role:
              foundUser.role === "ceo"
                ? "executive" 
                : (foundUser.role as Role),
            token: `${foundUser.role}-token-${foundUser.id}`,
            name: foundUser.name,
            email: foundUser.email,
            userId: foundUser.id,
            employeeCode: foundUser.employeeCode,
            supervisorId:
              foundUser.role === "supervisor"
                ? String(foundUser.id)
                : foundUser.department
                ? String(
                    Users.find(
                      (s) =>
                        s.role === "supervisor" &&
                        s.department === foundUser.department
                    )?.id || ""
                  )
                : undefined,
          });

          return foundUser.role as Role;
        }

        return null;
      },

      logout: () =>
        set({
          role: null,
          token: undefined,
          name: undefined,
          email: undefined,
          userId: undefined,
          employeeCode: undefined,
          supervisorId: undefined,
        }),
    }),
    { name: "auth-storage" }
  )
);
