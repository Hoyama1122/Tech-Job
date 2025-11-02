"use client"
import { create } from "zustand";
import { UserData } from "@/lib/Mock/User";
import { TechnicianMock } from "@/lib/Mock/Technician";

type Job = {
  id: number;
  name: string;
  jobTitle: string;
  status: string;
  date: string;
  sla: string;
};

type SupervisorState = {
  jobs: Job[];
  filterStatus: string;
  currentPage: number;
  itemsPerPage: number;

  
  setJobs: (jobs: Job[]) => void;
  setFilterStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
};

export const useSupervisorStore = create<SupervisorState>((set) => ({
  jobs: [],
  filterStatus: "ทั้งหมด",
  currentPage: 1,
  itemsPerPage: 5,

  setJobs: (jobs) => set({ jobs }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
