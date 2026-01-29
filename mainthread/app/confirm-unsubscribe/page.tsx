import ConfirmUnsubscribePage from "@/features/public-sites/subscribe/ConfirmUnsubscribePage";

export const metadata = {
    title: "Confirm Unsubscribe - MainThread",
    description: "Confirm your email unsubscribe request for MainThread.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ConfirmUnsubscribe() {
    return <ConfirmUnsubscribePage />;
}