"use server";

import supabase from "@/config/supabase-config";
import { INotification } from "@/interfaces";

export const addNotification = async (payload: Partial<INotification>) => {
  const { data, error } = await supabase.from("notifications").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  return {
    success: true,
    data: null,
    message: "Notification added successfully",
  };
};

export const getNotificationsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  return {
    success: true,
    data: data as INotification[],
    message: "Notifications fetched successfully",
  };
};
