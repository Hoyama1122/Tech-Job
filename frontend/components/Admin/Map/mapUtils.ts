import L from "leaflet";
import { JobStatus, JobReportStatus } from "@/types/job";

// Custom Marker Icons
export const createIcon = (url: string) => L.icon({
  iconUrl: url,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export const JOB_ICONS = {
  PENDING: createIcon("/marker/orange.svg"),
  IN_PROGRESS: createIcon("/marker/yellow.svg"),
  COMPLETED: createIcon("/marker/green.svg"),
  CANCELLED: createIcon("/marker/red.svg"),
  SUBMITTED: createIcon("/marker/blue.svg"),
};

export const getJobIcon = (status: string, reportStatus?: string) => {
  if (reportStatus === JobReportStatus.SUBMITTED) return JOB_ICONS.SUBMITTED;
  if (status === JobStatus.IN_PROGRESS) return JOB_ICONS.IN_PROGRESS;
  if (status === JobStatus.PENDING) return JOB_ICONS.PENDING;
  if (status === JobStatus.COMPLETED) return JOB_ICONS.COMPLETED;
  return JOB_ICONS.CANCELLED;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case JobStatus.PENDING: return "bg-orange-100 text-orange-700";
    case JobStatus.IN_PROGRESS: return "bg-yellow-100 text-yellow-700";
    case JobStatus.COMPLETED: return "bg-emerald-100 text-emerald-700";
    case "SUBMITTED": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-700";
  }
};
