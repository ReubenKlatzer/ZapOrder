import { getRestaurantData } from "#utils/database/helper/account";

export async function getMenuByUsername(username: string) {
	const account = await getRestaurantData(username);
	if (!account) throw { status: 404, message: `Account with restaurant id: ${username} is not found` };

	return {
		username: account.username,
		email: account.email,
		profile: account.profile,
		menus: account.menus,
		tables: account.tables,
	};
}
