import prisma from "../connect";

export async function getRestaurantProfile(restaurantID: string) {
	return prisma.profile.findUnique({
		where: { restaurantID },
		select: { name: true, restaurantID: true, description: true, address: true, avatar: true, cover: true, categories: true, themeH: true, themeS: true, themeL: true },
	});
}
