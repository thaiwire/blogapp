'use server';

import supabase from "@/config/supabase-config";
import { IBlog } from "@/interfaces";



export const addBlog = async(payload : Partial<IBlog>) => {
    const { error } = await supabase
    .from("blogs")
    .insert([payload]);
   
    if (error) {
        return {
            success: false,
            message: error?.message || "Error adding blog.",
        };
    }
    return {
        success: true,
        message: "Blog added successfully.",
    };

     
}

export const updateBlog = async(id: string, payload : Partial<IBlog>) => {
    const { error } = await supabase
    .from("blogs")
    .update(payload)
    .eq("id", id);

    if (error) {
        return {
            success: false,
            message: error?.message || "Error updating blog.",
        };
    }
    return {
        success: true,
        message: "Blog updated successfully.",
    };
}

export const deleteBlog = async(id: string) => {
    const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);
    
    if (error) {
        return {
            success: false,
            message: error?.message || "Error deleting blog.",
        };
    }
    return {
        success: true,
        message: "Blog deleted successfully.",
    };
}

export const getBlogByAuthor = async(authorId: string) => {
    const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

    if (error) {
        return {
            success: false,
            message: error?.message || "Error fetching blogs.",
            data: [],
        };
    }
    return {
        success: true,
        data: data as IBlog[],
    };
}

export const getBlogById = async(id: string) => {
    const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id);
    

    if (error) {
        return {
            success: false,
            message: error?.message || "Error fetching blog.",
            data: null,
        };
    }
    const blog = data[0];

    return {
        success: true,
        data: blog as IBlog,
    };
}

export const getAllBlogs = async() => {
    const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

    if (error) {
        return {
            success: false,
            message: error?.message || "Error fetching blogs.",
            data: [],
        };
    }
    return {
        success: true,
        data: data as IBlog[],
    };
}