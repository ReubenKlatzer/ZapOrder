import { ID_SUFFIX, REF_NOVABITE, TYPE_ACCOUNT, TYPE_KITCHEN, TYPE_PROFILE, TYPE_TABLE } from "../constants";
import { menus } from "./novabiteMenu";

const account = {
	_id: `${REF_NOVABITE}${TYPE_ACCOUNT}${ID_SUFFIX}000001`,
	email: "admin@novabite.com",
	username: "novabite",
	password: "novabite@123",
	verified: true,
};

const profile = {
	_id: `${REF_NOVABITE}${TYPE_PROFILE}${ID_SUFFIX}000001`,
	name: "Novabite",
	restaurantID: "novabite",
	description: "A modern casual dining experience where bold flavours meet a relaxed atmosphere. From wood-fired mains to handcrafted desserts, every bite is designed to delight.",
	address: "12 Harbour View, Cape Town",
	themeColor: { h: 24, s: 90, l: 50 },
	avatar: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200",
	cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
	photos: [
		"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
		"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
		"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
		"https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
		"https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
		"https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800",
	],
	categories: ["Starters", "Mains", "Salads & Bowls", "Desserts", "Drinks"],
};

const kitchens = [
	{
		_id: `${REF_NOVABITE}${TYPE_KITCHEN}${ID_SUFFIX}000001`,
		restaurantID: "novabite",
		username: "novabiteKitchen1",
		password: "123456",
	},
];

const tables = Array.from({ length: 8 }, (_, i) => ({
	_id: `${REF_NOVABITE}${TYPE_TABLE}${ID_SUFFIX}${i.toString().padStart(6, "0")}`,
	restaurantID: "novabite",
	name: `Table ${i + 1}`,
	username: (i + 1).toString(),
}));

const novabite = {
	account,
	profile,
	menus,
	kitchens,
	tables,
};

export default novabite;
