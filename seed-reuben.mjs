import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

const menuItems = {
	"Starters": [
		{ name: "Garlic Bread", price: 45, veg: "veg", description: "Toasted bread with garlic butter and herbs" },
		{ name: "Chicken Wings (6pc)", price: 89, veg: "non-veg", description: "Crispy wings with peri-peri sauce" },
		{ name: "Calamari", price: 79, veg: "non-veg", description: "Lightly battered calamari with tartare sauce" },
		{ name: "Bruschetta", price: 55, veg: "veg", description: "Toasted ciabatta with tomato and basil" },
		{ name: "Soup of the Day", price: 65, veg: "veg", description: "Ask your waiter for today's selection" },
	],
	"Mains": [
		{ name: "Beef Burger", price: 115, veg: "non-veg", description: "Beef patty, lettuce, tomato, cheese and sauce" },
		{ name: "Grilled Chicken", price: 129, veg: "non-veg", description: "Grilled chicken breast with chips and salad" },
		{ name: "Pasta Arrabiata", price: 99, veg: "veg", description: "Penne in spicy tomato sauce" },
		{ name: "Fish & Chips", price: 119, veg: "non-veg", description: "Battered hake with chips and tartar sauce" },
		{ name: "Veggie Wrap", price: 89, veg: "veg", description: "Grilled veggies, hummus and rocket in a wrap" },
	],
	"Desserts": [
		{ name: "Chocolate Lava Cake", price: 65, veg: "veg", description: "Warm chocolate cake with vanilla ice cream" },
		{ name: "Cheesecake", price: 59, veg: "veg", description: "New York style cheesecake with berry coulis" },
		{ name: "Ice Cream (3 scoops)", price: 45, veg: "veg", description: "Choice of vanilla, chocolate or strawberry" },
		{ name: "Malva Pudding", price: 55, veg: "veg", description: "Traditional South African dessert with custard" },
		{ name: "Waffle & Ice Cream", price: 65, veg: "veg", description: "Belgian waffle with ice cream and syrup" },
	],
	"Drinks": [
		{ name: "Soft Drink", price: 25, veg: "veg", description: "Coke, Sprite, Fanta or Lemonade" },
		{ name: "Fresh Juice", price: 35, veg: "veg", description: "Orange, apple or mango" },
		{ name: "Milkshake", price: 49, veg: "veg", description: "Vanilla, chocolate or strawberry" },
		{ name: "Sparkling Water", price: 20, veg: "veg", description: "330ml bottle" },
		{ name: "Coffee", price: 30, veg: "veg", description: "Cappuccino, latte or americano" },
	],
};

async function seedReuben() {
	console.log("🚀 Seeding Reuben's restaurant...");

	// Update profile
	await prisma.profile.upsert({
		where: { restaurantID: "reuben" },
		update: {
			name: "Reuben's Kitchen",
			description: "A warm and welcoming dining experience.",
			address: "45 Main Street, Cape Town, 8001",
			categories: Object.keys(menuItems),
		},
		create: {
			restaurantID: "reuben",
			name: "Reuben's Kitchen",
			description: "A warm and welcoming dining experience.",
			address: "45 Main Street, Cape Town, 8001",
			categories: Object.keys(menuItems),
		},
	});
	console.log("✅ Profile updated");

	// Create tables
	const tables = [
		{ name: "Table 1", username: "table1" },
		{ name: "Table 2", username: "table2" },
		{ name: "Table 3", username: "table3" },
		{ name: "Table 4", username: "table4" },
		{ name: "Table 5", username: "table5" },
	];

	for (const table of tables) {
		await prisma.table.upsert({
			where: { username_restaurantID: { username: table.username, restaurantID: "reuben" } },
			update: {},
			create: { ...table, restaurantID: "reuben" },
		});
	}
	console.log("✅ 5 tables created");

	// Clear and recreate menu
	await prisma.menu.deleteMany({ where: { restaurantID: "reuben" } });

	let menuTotal = 0;
	const createdMenuItems = [];
	for (const [category, items] of Object.entries(menuItems)) {
		for (const item of items) {
			const created = await prisma.menu.create({
				data: { ...item, category, taxPercent: 15, restaurantID: "reuben", image: IMAGE },
			});
			createdMenuItems.push(created);
			menuTotal++;
		}
	}
	console.log(`✅ ${menuTotal} menu items created`);

	// Create sample customers
	const customers = [
		{ fname: "John", lname: "Smith", phone: "0821234567", email: "john@example.com" },
		{ fname: "Sarah", lname: "Jones", phone: "0837654321", email: "sarah@example.com" },
		{ fname: "Mike", lname: "Brown", phone: "0849876543", email: "mike@example.com" },
		{ fname: "Lisa", lname: "Davis", phone: "0851112233", email: "lisa@example.com" },
		{ fname: "Tom", lname: "Wilson", phone: "0864445566", email: "tom@example.com" },
	];

	const createdCustomers = [];
	for (const customer of customers) {
		const c = await prisma.customer.upsert({
			where: { phone: customer.phone },
			update: {},
			create: customer,
		});
		createdCustomers.push(c);
	}
	console.log("✅ 5 customers created");

	// Create sample completed orders (history)
	const orderData = [
		{ customerIdx: 0, table: "table1", items: [0, 5], state: "completed" },
		{ customerIdx: 1, table: "table2", items: [1, 6, 10], state: "completed" },
		{ customerIdx: 2, table: "table3", items: [2, 11, 15], state: "completed" },
		{ customerIdx: 3, table: "table4", items: [3, 7, 16], state: "completed" },
		{ customerIdx: 4, table: "table5", items: [4, 8, 12, 17], state: "completed" },
	];

	for (const o of orderData) {
		const selectedItems = o.items.map((i) => createdMenuItems[i]);
		const orderTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
		const taxTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.taxPercent) / 100, 0);

		const order = await prisma.order.create({
			data: {
				restaurantID: "reuben",
				table: o.table,
				state: o.state,
				orderTotal,
				taxTotal,
				customerId: createdCustomers[o.customerIdx].id,
			},
		});

		for (const item of selectedItems) {
			await prisma.orderProduct.create({
				data: {
					orderId: order.id,
					menuId: item.id,
					price: item.price,
					tax: (item.price * item.taxPercent) / 100,
					adminApproved: true,
					fulfilled: true,
				},
			});
		}
	}
	console.log("✅ 5 sample orders created");

	await prisma.$disconnect();
	console.log("\n🎉 Done! Visit: http://localhost:3000/reuben?table=table1");
	console.log("   Admin login: reuben@gmail.com / your password");
}

seedReuben().catch((e) => { console.error(e); process.exit(1); });
