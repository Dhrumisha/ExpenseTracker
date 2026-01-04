import ResetPasswordPage from "@/admin-pages/auth/ResetPassword";
import { Suspense } from "react";

const ResetPassword = () => {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPassword;
