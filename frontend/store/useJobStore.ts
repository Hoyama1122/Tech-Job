import { create } from "zustand";
import api from "@/lib/axiosClient";

interface Job {
  id: number;
  JobId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  departmentId: number;
  start_available_at: string;
  end_available_at: string;
  location_name?: string;
  supervisor?: any;
  technicians?: any[];
  [key: string]: any;
}

interface JobState {
  jobs: Job[];
  myJobs: Job[];
  isLoading: boolean;
  isMyJobsLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  hasFetchedMyJobs: boolean;
  fetchJobs: (force?: boolean) => Promise<void>;
  fetchMyJobs: (force?: boolean) => Promise<void>;
  setJobs: (jobs: Job[]) => void;
  setMyJobs: (jobs: Job[]) => void;
}

let fetchJobsPromise: Promise<any> | null = null;
let fetchMyJobsPromise: Promise<any> | null = null;

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  myJobs: [],
  isLoading: false,
  isMyJobsLoading: false,
  error: null,
  hasFetched: false,
  hasFetchedMyJobs: false,
  
  fetchJobs: async (force = false) => {
    const { hasFetched } = get();
    if (hasFetched && !force) return;
    if (fetchJobsPromise) { await fetchJobsPromise; return; }

    set({ isLoading: true, error: null });
    fetchJobsPromise = api.get("/jobs");
    try {
      const response = await fetchJobsPromise;
      set({ jobs: response.data.jobs || [], isLoading: false, hasFetched: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error", isLoading: false, hasFetched: true });
    } finally {
      fetchJobsPromise = null;
    }
  },

  fetchMyJobs: async (force = false) => {
    const { hasFetchedMyJobs } = get();
    if (hasFetchedMyJobs && !force) return;
    if (fetchMyJobsPromise) { await fetchMyJobsPromise; return; }

    set({ isMyJobsLoading: true, error: null });
    fetchMyJobsPromise = api.get("/jobs/my");
    try {
      const response = await fetchMyJobsPromise;
      set({ myJobs: response.data.jobs || [], isMyJobsLoading: false, hasFetchedMyJobs: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error", isMyJobsLoading: false, hasFetchedMyJobs: true });
    } finally {
      fetchMyJobsPromise = null;
    }
  },

  setJobs: (jobs) => set({ jobs }),
  setMyJobs: (myJobs) => set({ myJobs }),
}));
