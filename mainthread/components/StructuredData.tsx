export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        url: process.env.CLIENT_URL,
        logo: `${process.env.CLIENT_URL}/logo.png`,
    };

    return (
        <script
            key="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
