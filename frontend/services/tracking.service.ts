import axiosClient from "@/lib/axiosClient";

export const trackingService = {
  getTechnicianLocations: async () => {
    const response = await axiosClient.get("/users/locations");
    return response.data.data;
  },
};
