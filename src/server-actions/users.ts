"use server";

import supabase from "@/config/supabse-config";
import { IUser } from "@/interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const getJwtSecret = () => process.env.JWT_SECRET;

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
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return {
        success: false,
        message: "JWT secret is not configured.",
      };
    }

    const { data: users, error: userError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email);

    if (userError) {
      return {
        success: false,
        message: "Error checking existing user: " + userError.message,
      };
    }

    if (users.length === 0) {
      return {
        success: false,
        message: "User with this email does not exist.",
      };
    }

    // step 2 compare the password
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password.",
      };
    }

    // step 3 generate JWT token
    const jwtToken = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1d",
    });

    return {
      success: true,
      message: "Login successful.",
      data: jwtToken,
    };
  } catch (error) {
    // console.log("Error in loginUser:", error);
    return {
      success: false,
      message: "Error checking existing user: " + (error as Error).message,
    };
  }
};

export const getLoggedInUser = async () => {
  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return {
        success: false,
        message: "JWT secret is not configured.",
      };
    }

    const cookieStore = await cookies();
    const jwtToken = cookieStore.get("user_token")?.value;

    if (!jwtToken) {
      return {
        success: false,
        message: "No JWT token found in cookies.",
      };
    }

    // Support legacy values accidentally stored as JSON string or Bearer token.
    const normalizedToken = jwtToken.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");

    const decodedToken = jwt.verify(
      normalizedToken,
      jwtSecret,
    ) as { userId: string };

    if (!decodedToken || !decodedToken.userId) {
      return {
        success: false,
        message: "Invalid JWT token.",
      };
    }

    const { data: users, error: userError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", decodedToken.userId);
    
    if (userError || !users || users.length === 0) {
      return {
        success: false,
        message: "Error fetching user: " + (userError ? userError.message : "User not found"),
      };
    }
    const user = users[0];
    delete user.password; // Remove password before returning user data
    
    return {
      success: true,
      message: "User fetched successfully.",
      data: user,
    }
    

  } catch (error) {
    return {
      success: false,
      message: "Error fetching logged in user: " + (error as Error).message,
    };
  }
};
