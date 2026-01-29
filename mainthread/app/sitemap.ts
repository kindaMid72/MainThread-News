import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.CLIENT_URL || 'https://www.mainthreadnews.site';
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:3031';

    // Static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            priority: 0.5,
            changeFrequency: 'yearly',
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            priority: 0.5,
            changeFrequency: 'daily', // Changed to daily as per requirement
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            priority: 0.5,
            changeFrequency: 'weekly', // Changed to weekly as per requirement
        },
    ];

    try {
        // Fetch all articles for sitemap generation
        // TODO: Handle pagination loop if articles > 1000
        const response = await fetch(`${apiUrl}/api/public/get-all-articles?page=1&limit=1000`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            console.error("Sitemap: Failed to fetch articles", response.statusText);
            return routes;
        }

        const data = await response.json();
        const articles = data.articles || [];

        const articleRoutes: MetadataRoute.Sitemap = articles.map((article: any) => ({
            url: `${baseUrl}/${article.slug}`,
            lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
            changeFrequency: 'never',
            priority: 0.7,
        }));

        return [...routes, ...articleRoutes];

    } catch (error) {
        console.error("Sitemap: Error generating dynamic routes", error);
        return routes;
    }
}
