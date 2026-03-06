"use client";

import React from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

function LogoutButton() {

  const [loading,setLoading]  = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
        setLoading(true);
      Cookie.remove("user_token");
      toast.success("Logged out successfully.");
      // Optionally, you can also redirect the user to the login page or home page after logout
      router.push("/login");
    } catch (error) {
      toast.error(
        "Logout failed: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <Button
       className="w-full"
       onClick={handleLogout}
      disabled={loading}>
        Logout
      </Button>
    </div>
  );
}

export default LogoutButton;
