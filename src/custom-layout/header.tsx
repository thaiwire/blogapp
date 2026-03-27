import useUserStore, { IUserStore } from "@/app/global-store/users-store";
import { Bell, Menu } from "lucide-react";
import React, { useEffect } from "react";
import MenuItems from "./menu-item";
import socket from "@/config/socket-config";
import { INotification } from "@/interfaces";
import { getNotificationsForUser } from "@/server-actions/notifications";

function PrivateLayoutHeader() {

  const { user } = useUserStore() as IUserStore;
  const [openMenuItems, setOpenMenuItems] = React.useState(false);
  const [notifications, setNotifications] = React.useState<INotification[]>([]);

  const fetchNotifications = async () => {
    if (user) {
      const response:any = await getNotificationsForUser(user.id);
      if (response.success) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    }
  }




  useEffect(() => {
    if (user) {
      socket.emit("client-connect", {
        userId: user.id,
        name: user.name,
      });

      // socket.on("server-message", (data) => {
      //   console.log("Server message received:", data);
      // });

      // socket.on("message-from-server", (data: any) => {
      //   console.log("message-from-server:", data);
      // });
      const receiveNotification = (notification: INotification) => {
        console.log("Received notification:", notification);
        setNotifications((prev) => [...prev, notification]);
      }
       
      socket.on("receive-notification",receiveNotification);

      fetchNotifications();
      
      return () => {
        socket.off("receive-notification", receiveNotification);
      }


    }
  }, [user]);

  return (
    <div className="bg-primary flex justify-between p-6">
      <h1 className="text-xl font-bold text-white">NN.R.B</h1>
      <div className="flex gap-5 items-center">
        <div className="relative cursor-pointer">
          <Bell className="text-white cursor-pointer" size={20} />
          {notifications.filter((not : INotification) => !not.is_read).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notifications.filter((not : INotification) => !not.is_read).length}
            </span>
          )}
           
        </div>

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
