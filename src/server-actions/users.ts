"use server";

import supabase from "@/config/supabase-config";
import { IUser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import toast from "react-hot-toast";

export const registerUser = async (payload: Partial<IUser>) => {
  // step1: check if user with the same email already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", payload.email);
  if (fetchError) {
    return {
      success: false,
      message: fetchError?.message || "Error checking existing user.",
    };
  }
  if (existingUser && existingUser.length > 0) {
    return {
      success: false,
      message: "A user with this email already exists.",
    };
  }

  // step2: Hash the password before storing in user_profiles
  const hashedPassword = await bcrypt.hash(payload.password || "", 10);

  console.log("Hashed password:", hashedPassword);
  // step3: Create user profile in database
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
      message: insertError?.message || "Error creating user profile.",
    };
  }
  return {
    success: true,
    message: "User profile created successfully.",
    data: newUser,
  };
};

export const loginUser = async (email: string, password: string) => {
  try {
    // step1: Fetch user by email
    const { data: users, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      return {
        success: false,
        message: fetchError?.message || "Error fetching user.",
      };
    }

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No user found with this email.",
      };
    }

    // step2: Compare the provided password with the stored hashed password
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password.",
      };
    }

    // step3: Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY || "default_secret",
      {
        expiresIn: "1d", // Token expires in 1 day
      },
    );
    console.log("Generated JWT token:", jwtToken);
    return {
      success: true,
      message: "Login successful.",
      token: jwtToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login.",
    };
  }
};

export const getLoggedInUser = async (token?: string) => {
  try {
    const cookieStore = await cookies();
    const jwtToken = token || cookieStore.get("user_token")?.value;

    if (!jwtToken) {
      return {
        success: false,
        message: "No token provided.",
      };
    }

    // Verify the token and extract user ID
    const decodedToken = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET_KEY || "default_secret",
    ) as { id: string };

    if (!decodedToken || !decodedToken.id) {
      return {
        success: false,
        message: "Invalid token.",
      };
    }
    // Fetch user data from the database using the extracted user ID
    const { data: users, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", decodedToken.id);

    if (fetchError) {
      return {
        success: false,
        message: fetchError?.message || "Error fetching user data.",
      };
    }
   
    const user = users[0];
    delete user.password; // Remove password from the response
    return {
      success: true,
      data: user,
    };
    
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching user data.",
    };
  }
};


