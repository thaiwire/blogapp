import React, { use } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, List, ListCheck, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "@/components/functional/logout-button";

interface IMenuItems {
  openMenuItems: boolean;
  setOpenMenuItems: (open: boolean) => void;
}

function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItems) {
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
      icon: <User2 size={14} />,
    },
  ];

  return (
    <Sheet open={openMenuItems} onOpenChange={setOpenMenuItems}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-7 mt-20 px-7">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center cursor-pointer p-3 ${
                pathname === item.path ? "bg-gray-100 rounded border border-gray-500"
                 : "text-gray-600"
              }`}
              onClick={() => {
                router.push(item.path);
                setOpenMenuItems(false);
              }}
            >
              {item.icon}
              {item.name}
            </a>
          ))}
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
