import React from "react";
import PrivateLayoutHeader from "./header";
import useUsersStore, { IUsersStore } from "@/global-store/users-store";
import { getLoggedInUser } from "@/server-actions/users";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { set } from "zod";
import Spinner from "@/components/ui/spinner";
import CenteredSpinner from "@/components/ui/centered-spinner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  
  const {setUser} = useUsersStore() as IUsersStore;
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await getLoggedInUser();
          if (!response.success) {
            throw new Error("Failed to fetch user");
          }
          console.log("Fetched user:", response.data);
          setUser(response.data);
        } catch (error) {
          toast.error("Failed to fetch user data. Please log in again.");
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <div>
      <PrivateLayoutHeader />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
