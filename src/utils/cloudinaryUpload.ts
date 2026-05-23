import cloudinary from "../config/cloudinary";

interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder, // contoh: "threads", "avatars"
        resource_type: "image",
        transformation: [
          { quality: "auto" }, // auto compress
          { fetch_format: "auto" }, // auto pilih format terbaik (webp di browser modern)
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer); // kirim buffer ke cloudinary
  });
};
