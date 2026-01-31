
// import navbar
import PublicNavBar from "@/components/PublicNavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MainThread Articles",
    description: "MainThread Landing Page Articles",
    alternates: {
        canonical: `/articles`,
    }
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>
        <PublicNavBar />
        {children}
    </>;
}