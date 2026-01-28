

import LoginPage from "@/features/admin-sites/auth/LoginPage";

export const metadata = {
    title: "Login - MainThread",
    description: "Login to your MainThread account.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Login_Page() {
    
    // state
    return (
        <LoginPage />
    );  
}