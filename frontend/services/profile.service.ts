import api from "@/lib/axiosClient";

export interface Profile {
  id?: number;
  userId?: number;
  firstname?: string;
  lastname?: string;
  phone?: string;
  avatar?: string;
  gender?: string | null;
  birthday?: string | null;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  empno: string;
  email: string;
  role: string;
  departmentId?: number | null;
  department?: Department | null;
  profile?: Profile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMyProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UpdateMyProfilePayload {
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  gender?: string | null;
  birthday?: string | null;
}

export interface UpdateMyProfileResponse {
  message: string;
  data: Profile;
}

export const profileService = {
  getMyProfile: async (): Promise<GetMyProfileResponse> => {
    const response = await api.get("/profile/");
    return response.data;
  },

  updateMyProfile: async (
    payload: UpdateMyProfilePayload
  ): Promise<UpdateMyProfileResponse> => {
    const response = await api.put("/profile/", payload);
    return response.data;
  },
};
