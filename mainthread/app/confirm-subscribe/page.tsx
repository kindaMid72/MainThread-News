import ConfirmSubscribePage from "@/features/public-sites/subscribe/ConfirmSubscribePage";

export const metadata = {
    title: "Confirm Subscription - MainThread",
    description: "Confirm your email subscription for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ConfirmSubscribe() {
    return <ConfirmSubscribePage />;
}