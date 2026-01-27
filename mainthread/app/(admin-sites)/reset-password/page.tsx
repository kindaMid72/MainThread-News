"use client";

import ResetPasswordPage from "@/features/admin-sites/auth/ResetPasswordPage";
import { Suspense } from "react";

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}