import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinaryUpload.js";

export { deleteFromCloudinary };

export const deleteImages = async (publicIds = []) => {
  try {
    if (!publicIds || publicIds.length === 0) return;

    await Promise.all(
      publicIds.map((publicId) => deleteFromCloudinary(publicId))
    );
  } catch (error) {
    console.error("deleteImages error:", error);
    throw error;
  }
};

export const uploadImages = async (files = [], folder = "techjob") => {
  try {
    if (!files || files.length === 0) return [];

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, folder);

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    return uploaded;
  } catch (error) {
    console.error("uploadImages error:", error);
    throw error;
  }
};

export const uploadSingleImage = async (file, folder = "techjob") => {
  try {
    if (!file) return null;

    const result = await uploadToCloudinary(file.buffer, folder);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("uploadSingleImage error:", error);
    throw error;
  }
};