import LogoutButton from "@/components/functional/logout-btn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutDashboard, List, ListCheck, UserCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { use } from "react";

interface IMenuItem {
  openMenuItems: boolean;
  setOpenMenuItems: (open: boolean) => void;
}

function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItem) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboard size={14} />,
    },
    {
      name: "Blogs",
      path: "/user/blogs",
      icon: <List size={14} />,
    },
    {
      name: "My Blogs",
      path: "/user/my-blogs",
      icon: <ListCheck size={14} />,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: <UserCheck size={14} />,
    },
  ];

  return (
    <Sheet open={openMenuItems} onOpenChange={(open) => setOpenMenuItems(open)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-7 mt-20 px-7">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-3 cursor-pointer p-3 ${
                pathname === item.path
                  ? "bg-gray-100 rounded border border-gray-500"
                  : ""
              }`}
              onClick={() => {
                setOpenMenuItems(false);
                router.push(item.path);
              }}
            >
              {item.icon}
              <h1 className="text-sm">{item.name}</h1>
            </div>
          ))}
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
