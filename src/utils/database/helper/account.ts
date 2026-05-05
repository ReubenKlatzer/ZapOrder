import prisma from "../connect";

export async function getRestaurantData(username: string) {
	return prisma.account.findUnique({
		where: { username },
		include: { profile: true, tables: true, menus: true },
	});
}
