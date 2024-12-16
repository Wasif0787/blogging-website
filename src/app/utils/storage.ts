// utils/storage.ts
import { supabase } from "./supabase"

// Define the response type for the uploadProfileImage function
interface UploadResponse {
    publicUrl?: string;  // Public URL if upload is successful
    error?: string;      // Error message if there's an issue
}

// Function to handle image upload to Supabase
export const uploadProfileImage = async (file: File, userId: string): Promise<UploadResponse> => {
    const fileName = `${userId}-${Date.now()}` // Generate a unique file name based on user ID and timestamp

    // Upload the file to the 'avatars' folder in the Supabase storage
    const { error } = await supabase.storage.from("avatars").upload(fileName, file)

    if (error) {
        console.error("Error uploading image:", error)
        return { error: error.message }
    }

    // Get the public URL of the uploaded image
    const { publicUrl } = supabase.storage.from("avatars").getPublicUrl(fileName).data

    return { publicUrl }
}

export const uploadCoverImage = async (file: File, userId: string): Promise<UploadResponse> => {
    const fileName = `${userId}-${Date.now()}` // Generate a unique file name based on user ID and timestamp

    // Upload the file to the 'avatars' folder in the Supabase storage
    const { error } = await supabase.storage.from("coverImage").upload(fileName, file)

    if (error) {
        console.error("Error uploading image:", error)
        return { error: error.message }
    }

    // Get the public URL of the uploaded image
    const { publicUrl } = supabase.storage.from("coverImage").getPublicUrl(fileName).data

    return { publicUrl }
}
