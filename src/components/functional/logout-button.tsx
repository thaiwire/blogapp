'use client';

import React from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function LogoutButton() {

  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const handleLogout = () => {
    try {
        setLoading(true);
        // Clear the JWT token cookie by setting it to an empty value and expiring it immediately
        Cookies.remove("user_token");
        toast.success("Logged out successfully.");
        router.push("/login");

    } catch (error) {
      toast.error("Error during logout. Please try again.");
    }   finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <Button 
      className="w-full"
      disabled={loading}
      onClick={handleLogout}
      >Logout</Button>
    </div>
  );
}

export default LogoutButton;
