"use client";

import ResetPasswordPage from "@/features/admin-sites/auth/ResetPasswordPage";
import { Suspense } from "react";

export const metadata = {
    title: "Reset Password - MainThread",
    description: "Reset your password for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}