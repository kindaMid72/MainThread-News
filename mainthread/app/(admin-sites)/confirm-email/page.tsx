import ConfirmEmailPage from "@/features/admin-sites/auth/ConfirmEmailPage";
import { Suspense } from "react";

export const metadata = {
    title: "Confirm Email - MainThread",
    description: "Confirm your email for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ConfirmEmail() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ConfirmEmailPage />
        </Suspense>
    );
}