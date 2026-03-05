"use server";

import supabase from "@/config/supabse-config";
import { IUser } from "@/interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (payload: Partial<IUser>) => {
  // step1 check if user exist with email
  const { data: existingUser, error: existingUserError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", payload.email);

  if (existingUserError) {
    return {
      success: false,
      message: "Error checking existing user: " + existingUserError.message,
    };
  }

  if (existingUser && existingUser.length > 0) {
    return {
      success: false,
      message: "User with this email already exists.",
    };
  }

  // step2 hash the password

  const hashedPassword = await bcrypt.hash(payload.password || "", 10);

  // step3 insert the user in database

  const rowData = {
    ...payload,
    password: hashedPassword,
    is_active: true,
    profile_pic: "",
  };

  const { data: newUser, error: insertError } = await supabase
    .from("user_profiles")
    .insert(rowData);

  if (insertError) {
    return {
      success: false,
      message: "Error inserting new user: " + insertError.message,
    };
  }

  return {
    success: true,
    message: "User registered successfully.",
    data: newUser,
  };
};

export const loginUser = async (email: string, password: string) => {
   // step1 check if user exist with email
   try {
      const { data : users , error: userError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)

      if(userError){
         return {
            success: false,
            message: "Error checking existing user: " + userError.message,
         }; 
      }
      
      if(users.length === 0){
         return {
            success: false,
            message: "User with this email does not exist.",
         };
      }

      // step 2 compare the password
      

   } catch (error) {
      return {
         success: false,
         message: "Error checking existing user: " + (error as Error).message,
      }; 
      
   }
    

}
