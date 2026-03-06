"use server";

import supabase from "@/config/supabse-config";
import { IBlog } from "./../interface/index";

export const addBlog = async (payload: Partial<IBlog>) => {
  const { data, error } = await supabase.from("blogs").insert(payload);

  if (error) {
    return {
      success: false,
      message: "Error adding blog: " + error.message,
    };
  }
  return {
    success: true,
    data: data,
  };
};

export const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const { data, error } = await supabase
    .from("blogs")
    .update(payload)
    .eq("id", id);
  if (error) {
    return {
      success: false,
      message: "Error updating blog: " + error.message,
    };
  }
  return {
    success: true,
    data: data,
  };
};

export const deleteBlog = async (id: string) => {
  const { data, error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) {
    return {
      success: false,
      message: "Error deleting blog: " + error.message,
    };
  }
  return {
    success: true,
    data: data,
  };
};

export const getBlogByAuthor = async (authorId: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Error fetching blogs by author: " + error.message,
      data : [],
    };
  }
  return {
    success: true,
    data: data as IBlog[],
  };
};

export const getBlogById = async (id: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id);
  

  if (error || !data || data.length === 0) {
    return {
      success: false,
      message: "Error fetching blog by ID: " + error.message,
      data: null,
    };
  }

  const blog = data[0];

  return {
    success: true,
    data: blog as IBlog,
  };
};

export const getAllBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Error fetching all blogs: " + error.message,
      data: [],
    };
  }

  return {
    success: true,
    data: data as IBlog[],
  };
};
