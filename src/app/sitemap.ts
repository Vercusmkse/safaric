import { MetadataRoute } from 'next';
import { SAFARI_PACKAGES } from '@/data/packages';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://safarictours.com';

    // Core canonical pages
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
    ];

    // Add distinct package routes if you have dynamic package subpages
    SAFARI_PACKAGES.forEach((pkg) => {
        routes.push({
            url: `${baseUrl}/safaris/${pkg.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        });
    });

    return routes;
}