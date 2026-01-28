
import AboutPage from "@/features/public-sites/about/AboutPage";

export const metadata = {
    title: "About - MainThread",
    description: "About MainThread.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function About() {
    return (
        <AboutPage />
    );
}