

export const getMyProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateMyProfile = async (payload: {
  phone?: string;
  address?: string;
  avatar?: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  birthday?: string;
}) => {
  const res = await api.put("/profile", payload);
  return res.data;
};