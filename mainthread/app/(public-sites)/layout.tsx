
// import navbar
import PublicNavBar from "@/components/PublicNavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "mainThread news",
    description: "MainThread Landing Page Articles",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>
        <PublicNavBar />
        {children}
    </>;
}