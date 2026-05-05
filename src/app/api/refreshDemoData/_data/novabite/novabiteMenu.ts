import mongoose from "mongoose";
import type { TMenu } from "#utils/database/models/menu";
import { ID_SUFFIX, REF_NOVABITE, TYPE_MENU } from "../constants";

const starters = [
	{
		name: "Crispy Calamari",
		description: "Lightly battered calamari rings served with marinara dipping sauce and a wedge of lemon.",
		category: "Starters",
		price: 180,
		foodType: "spicy",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
	},
	{
		name: "Bruschetta al Pomodoro",
		description: "Toasted sourdough topped with fresh tomatoes, basil, garlic and a drizzle of extra virgin olive oil.",
		category: "Starters",
		price: 150,
		foodType: "spicy",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400",
	},
	{
		name: "Chicken Satay Skewers",
		description: "Grilled chicken skewers marinated in lemongrass and served with peanut dipping sauce.",
		category: "Starters",
		price: 220,
		foodType: "spicy",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400",
	},
	{
		name: "Loaded Nachos",
		description: "Tortilla chips loaded with melted cheddar, jalapeños, sour cream, guacamole and pico de gallo.",
		category: "Starters",
		price: 200,
		foodType: "spicy",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
	},
];

const mains = [
	{
		name: "Grilled Atlantic Salmon",
		description: "Pan-seared salmon fillet with lemon butter sauce, seasonal vegetables and garlic mashed potatoes.",
		category: "Mains",
		price: 480,
		foodType: "spicy",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
	},
	{
		name: "Mushroom Risotto",
		description: "Creamy arborio rice with wild mushrooms, parmesan, truffle oil and fresh thyme.",
		category: "Mains",
		price: 350,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
	},
	{
		name: "Novabite Signature Burger",
		description: "Double smash patty, aged cheddar, caramelised onions, pickles and house sauce in a brioche bun. Served with fries.",
		category: "Mains",
		price: 320,
		foodType: "spicy",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
	},
	{
		name: "Paneer Tikka Flatbread",
		description: "Tandoor-spiced paneer on a crispy flatbread with mint chutney, pickled onions and rocket.",
		category: "Mains",
		price: 280,
		foodType: "spicy",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
	},
	{
		name: "BBQ Chicken Platter",
		description: "Half chicken slow-cooked in smoky BBQ glaze, served with coleslaw, corn on the cob and fries.",
		category: "Mains",
		price: 420,
		foodType: "spicy",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400",
	},
	{
		name: "Penne Arrabbiata",
		description: "Penne pasta in a fiery tomato and garlic sauce with fresh basil and shaved parmesan.",
		category: "Mains",
		price: 260,
		foodType: "extra-spicy",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
	},
];

const salads = [
	{
		name: "Caesar Salad",
		description: "Crisp romaine lettuce, house-made Caesar dressing, croutons and shaved parmesan.",
		category: "Salads & Bowls",
		price: 220,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
	},
	{
		name: "Grilled Chicken Power Bowl",
		description: "Quinoa, grilled chicken, avocado, cherry tomatoes, cucumber and tahini dressing.",
		category: "Salads & Bowls",
		price: 310,
		foodType: "sweet",
		veg: "non-veg",
		image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
	},
	{
		name: "Watermelon Feta Salad",
		description: "Fresh watermelon, crumbled feta, mint, cucumber and a honey-lime dressing.",
		category: "Salads & Bowls",
		price: 190,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
	},
];

const desserts = [
	{
		name: "Warm Chocolate Lava Cake",
		description: "Decadent dark chocolate cake with a molten centre, served with vanilla bean ice cream.",
		category: "Desserts",
		price: 220,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
	},
	{
		name: "New York Cheesecake",
		description: "Classic baked cheesecake on a graham cracker crust with fresh berry compote.",
		category: "Desserts",
		price: 200,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
	},
	{
		name: "Mango Panna Cotta",
		description: "Silky Italian cream dessert infused with vanilla, topped with fresh mango coulis.",
		category: "Desserts",
		price: 180,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
	},
];

const drinks = [
	{
		name: "Fresh Lime Soda",
		description: "Freshly squeezed lime with sparkling water, mint and a pinch of salt. Sweet or salted.",
		category: "Drinks",
		price: 90,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
	},
	{
		name: "Mango Lassi",
		description: "Thick and creamy blended yoghurt with Alphonso mango pulp and a hint of cardamom.",
		category: "Drinks",
		price: 120,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
	},
	{
		name: "Cold Brew Coffee",
		description: "Slow-steeped 18-hour cold brew served over ice. Bold, smooth and refreshing.",
		category: "Drinks",
		price: 160,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
	},
	{
		name: "Virgin Mojito",
		description: "Muddled mint, lime juice, sugar syrup and sparkling water over crushed ice.",
		category: "Drinks",
		price: 130,
		foodType: "sweet",
		veg: "veg",
		image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
	},
];

let menus = [...starters, ...mains, ...salads, ...desserts, ...drinks] as TMenu[];

menus = menus.map((menu, index) => {
	menu._id = new mongoose.Types.ObjectId(`${REF_NOVABITE}${TYPE_MENU}${ID_SUFFIX}${index.toString().padStart(6, "0")}`);
	menu.restaurantID = "novabite";
	if (!menu?.taxPercent) menu.taxPercent = 5;
	if (!menu?.hidden) menu.hidden = false;
	return menu;
});

export { menus };
