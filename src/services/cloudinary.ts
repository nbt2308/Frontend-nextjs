import axiosClient from "./axiosClient";

export const CloudinaryService = {
    getSignature: async (folder: string) => {
        try {
            const response = await axiosClient.get(`media/signature`, {
                params: {
                    folder
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    },
    postImageToCloudinary: async (formData: FormData) => {
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("Upload failed");
            }
            const json = await response.json();
            return json;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}