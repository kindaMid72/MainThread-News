import ConfirmEmailPage from "@/features/admin-sites/auth/ConfirmEmailPage";

export const metadata = {
    title: "Confirm Email - MainThread",
    description: "Confirm your email for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ConfirmEmail() {
    return <ConfirmEmailPage />;
}