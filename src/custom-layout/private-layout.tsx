import React, { use, useEffect } from "react";
import PrivateLayoutHeader from "./header";
import { getLoggedInUser } from "@/server-actions/users";
import useUserStore, { IUserStore } from "@/app/global-store/users-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { set } from "zod";
import Spinner from "@/components/ui/spinner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore() as IUserStore;
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getLoggedInUser();
      if (!response.success) {
        throw new Error(response.message);
      } else {
        setUser(response.data);
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to fetch user data. Please log in again.",
      );
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div
      className="flex items-center justify-center h-screen"
    > 
      <Spinner />
      .</div>;
  }
   

  return (
    <div>
      <PrivateLayoutHeader />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
