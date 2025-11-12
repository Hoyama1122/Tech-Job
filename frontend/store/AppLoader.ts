/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { CardWork } from "@/lib/Mock/CardWork";
import { Users } from "@/lib/Mock/UserMock";

type AppStore = {
  users: any[];
  cardWork: any[];
  setUsers: (users: any[]) => void;
  setCardWork: (works: any[]) => void;
};

export const AppLoader = create<AppStore>((set) => ({
  users: Users,
  cardWork: CardWork,
  setUsers: (users) => set({ users }),
  setCardWork: (works) => set({ cardWork: works }),
}));
