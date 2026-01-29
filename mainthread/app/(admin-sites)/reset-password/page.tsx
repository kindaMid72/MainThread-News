import ResetPasswordPage from "@/features/admin-sites/auth/ResetPasswordPage";

export const metadata = {
    title: "Reset Password - MainThread",
    description: "Reset your password for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ResetPassword() {
    return <ResetPasswordPage />;
}