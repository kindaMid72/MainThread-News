import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*', // untuk semua agent crawler
            allow: '/', // Mengizinkan semua secara default
            disallow: [
                '/admin/', // Block semua di dalam /admin
                '/login',
                '/confirm-email',
                '/reset-password',
                '/confirm-subscribe',
                '/confirm-unsubscribe'
            ]
        },
        sitemap: `${process.env.CLIENT_URL}/sitemap.xml`, // Penting untuk dynamic routes
    }
}