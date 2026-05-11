import type { MetadataRoute } from "next";
import prisma from "#utils/database/connect";
import { SITE_URL } from "#utils/seo/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const restaurants = await prisma.profile.findMany({ select: { restaurantID: true, updatedAt: true } });

	const restaurantEntries: MetadataRoute.Sitemap = restaurants.map((r) => ({
		url: `${SITE_URL}/${r.restaurantID}`,
		lastModified: r.updatedAt ?? new Date(),
		changeFrequency: "daily",
		priority: 0.8,
	}));

	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...restaurantEntries,
	];
}
