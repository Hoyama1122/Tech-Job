/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { create } from "zustand";
import { UserData } from "@/lib/Mock/User";
import { TechnicianMock } from "@/lib/Mock/Technician";
import { Supervisor } from "@/lib/Mock/Supervisor";

type AppStore = {
  user: any;
  cardWork: any[];
  supervisor: any[];
  setUser: (user: any) => void;
  setCardWork: (works: any[]) => void;
  setsupervisor: (supervisor: any[]) => void;
};

export const AppLoader = create<AppStore>((set) => ({
  user: UserData,
  cardWork: TechnicianMock,
  supervisor: Supervisor,
  setsupervisor:(supervisor) => set({ supervisor }),
  setUser: (user) => set({ user }),
  setCardWork: (works) => set({ cardWork: works }),
}));
