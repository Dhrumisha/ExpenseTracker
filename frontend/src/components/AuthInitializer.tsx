"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux";
import { initializeUser, logout } from "@/redux/slices/userSlice";
import { getMe } from "@/services/auth/auth.service";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getMe();

        dispatch(
          initializeUser({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
          })
        );
      } catch {
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}
