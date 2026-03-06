import useUsersStore, { IUsersStore } from "@/global-store/users-store";
import { Menu } from "lucide-react";
import React from "react";
import MenuItems from "./menu-items";

function PrivateLayoutHeader() {
  const { user } = useUsersStore() as IUsersStore;
  const [openMenuItems, setOpenMenuItems] = React.useState(false);

  return (
    <div className="bg-primary flex justify-between p-6">
      <h1 className="text-xl font-bold">T-W-P Blog</h1>
      <div className="flex items-center">
        {user && <span>Welcome, {user.name}</span>}
        <Menu
          size={20}
          className="ml-4 cursor-pointer"
          onClick={() => setOpenMenuItems(!openMenuItems)}
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
