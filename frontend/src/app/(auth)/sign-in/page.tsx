import SignIn from "@/admin-pages/auth/SignIn";
import { AuthInitializer } from "@/components/AuthInitializer";
import React from "react";

const SignInPage = () => {
  return (
    <>
    <SignIn />
    <AuthInitializer />
    </>
  );
};

export default SignInPage;
