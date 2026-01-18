
'use client'
import ErrorWithRefreshButton from "@/components/ErrorWithRefreshButton"

export default function ErrorLandingPage() {

    return (
        <ErrorWithRefreshButton onRefresh={() => window.location.reload()} />
    )

}