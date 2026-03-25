"use server"
import supabase from "@/config/supabase-config";

export const uploadFileAndGetUrl = async (file: File) => {
  const filename = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("nava")
    .upload(filename, file);
  if (error) {
    return { success: false, message: error.message };
  }

  const urlResponse = supabase.storage.from("nava").getPublicUrl(filename);
  return {
    success: true,
    message: "File uploaded successfully",
    data : urlResponse.data.publicUrl,
  };
  

};
