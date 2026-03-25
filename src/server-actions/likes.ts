"use server";

import supabase from "@/config/supabase-config";

export const likeBlog = async (
  blogId: string,
  userId: string,
  newLikeCount: number,
) => {
  const { data, error } = await supabase
    .from("likes")
    .insert([{ blog_id: blogId, user_id: userId }]);

  if (error) {
    return { success: false, error: error.message };
  }

  // increment the like count in the blogs table
  const { error: updateError } = await supabase
    .from("blogs")
    .update({ likes_count: newLikeCount })
    .eq("id", blogId);
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  return { success: true, message: "Like added successfully", data };
};

export const unlikeBlog = async (
  blogId: string,
  userId: string,
  newLikeCount: number,
) => {
  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("blog_id", blogId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  // decrement the like count in the blogs table
  const { error: updateError } = await supabase
    .from("blogs")
    .update({ likes_count: newLikeCount })
    .eq("id", blogId);
  if (updateError) {
    return { success: false, error: updateError.message };
  }
  return { success: true, message: "Like removed successfully", data };
};

export const getLikesOfBlog = async (blogId: string) => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("blog_id", blogId);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: data  || [] };
};
