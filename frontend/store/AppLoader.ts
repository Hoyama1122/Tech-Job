/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { create } from "zustand";
import { UserData } from "@/lib/Mock/User";
import { TechnicianMock } from "@/lib/Mock/Technician";

type AppStore = {
  user: any;
  cardWork: any[];
  setUser: (user: any) => void;
  setCardWork: (works: any[]) => void;
};

export const AppLoader = create<AppStore>((set) => ({
  user: UserData,
  cardWork: TechnicianMock,
  setUser: (user) => set({ user }),
  setCardWork: (works) => set({ cardWork: works }),
}));
