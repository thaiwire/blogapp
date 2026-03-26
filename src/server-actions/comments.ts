"use server";

import supabase from "@/config/supabase-config";
import { success } from "zod";

export const createComment = async ({
  blogId,
  userId,
  content,
  newCommentsCount,
}: {
  blogId: number;
  userId: number;
  content: string;
  newCommentsCount: number;
}) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({ blog_id: blogId, user_id: userId, content })
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
  // update commnent count in blogs table
  const { error: updateError } = await supabase
    .from("blogs")
    .update({ comments_count: newCommentsCount })
    .eq("id", blogId);
  if (updateError) {
    return {
      success: false,
      message: "Failed to update comment count",
    };
  }

  return {
    success: true,
    comment: data,
    message : "Comment created successfully",
  };
};

export const deleteComment = async ({
  commentId,
  blogId,
  newCommentsCount,
}: {
  commentId: number;
  blogId: number;
  newCommentsCount: number;
}) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
  // update commnent count in blogs table
  const { error: updateError } = await supabase
    .from("blogs")
    .update({ comments_count: newCommentsCount })
    .eq("id", blogId);
  if (updateError) {
    return {
      success: false,
      message: "Failed to update comment count",
    };
  }
  return {
    success: true,
    message : "Comment deleted successfully",
  };
};
