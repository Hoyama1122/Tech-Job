export interface TechnicianLocation {
  userId: number;
  empno: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  updatedAt: string;
  role: string;
  departmentId: number | null;
  departmentName?: string;
  online?: boolean;
}

export interface JobLocation {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  reportStatus?: string;
  technicians?: { id: number; name: string; phone: string }[];
}
