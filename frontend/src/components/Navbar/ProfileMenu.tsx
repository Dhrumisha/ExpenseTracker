"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux";
import { logout } from "@/redux/slices/userSlice";
import { logoutUser } from "@/services/auth/auth.service";

export function ProfileMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await logoutUser();
  
      dispatch(logout());
      sessionStorage.removeItem("auth_token");
  
      router.replace("/sign-in");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.firstname?.charAt(0).toUpperCase()}
              {user.lastname?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
          <h3>{user.firstname}</h3>
          {/* <p className="text-xs text-muted-foreground">{user.email}</p> */}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto">

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push("/admin/settings/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-expense focus:text-expense"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
