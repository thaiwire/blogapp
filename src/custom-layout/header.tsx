import useUserStore, { IUserStore } from "@/app/global-store/users-store";
import { Menu } from "lucide-react";
import React, { useEffect } from "react";
import MenuItems from "./menu-item";
import socket from "@/config/socket-config";

function PrivateLayoutHeader() {
  const { user } = useUserStore() as IUserStore;
  const [openMenuItems, setOpenMenuItems] = React.useState(false);

  useEffect(() => {
    if (user) {
      socket.emit("client-connect", {
        userId: user.id,
        name: user.name,
      });
     
      // socket.on("server-message", (data) => {
      //   console.log("Server message received:", data);
      // });

      socket.on("message-from-server", (data: any) => {
        console.log("message-from-server:", data);
      });

    }
  }, [user]);

  return (
    <div className="bg-primary flex justify-between p-6">
      <h1 className="text-xl font-bold text-white">NN.R.B</h1>
      <div className="flex gap-5 items-center">
        <span className="text-white">{user?.name}</span>
        <Menu
          className="text-white cursor-pointer"
          size={14}
          onClick={() => setOpenMenuItems(true)}
        />
      </div>
      {openMenuItems && (
        <MenuItems
          openMenuItems={openMenuItems}
          setOpenMenuItems={setOpenMenuItems}
        />
      )}
    </div>
  );
}

export default PrivateLayoutHeader;
