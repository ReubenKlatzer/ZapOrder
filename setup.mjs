import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

const menuItems = {
    "Braai & Grills": [
        { name: "Boerewors Roll", price: 45, veg: "non-veg", description: "Grilled boerewors in a fresh roll with chakalaka" },
        { name: "Lamb Chops (3pc)", price: 189, veg: "non-veg", description: "Marinated lamb chops grilled over open flame" },
        { name: "T-Bone Steak 300g", price: 245, veg: "non-veg", description: "Prime T-bone with garlic butter and chips" },
    ],
    "Burgers": [
        { name: "Classic Beef Burger", price: 89, veg: "non-veg", description: "Beef patty, lettuce, tomato, cheese and sauce" },
        { name: "Double Smash Burger", price: 119, veg: "non-veg", description: "Two smashed beef patties with special sauce" },
    ],
    "Desserts": [
        { name: "Chocolate Brownie", price: 45, veg: "veg", description: "Warm chocolate brownie with ice cream" },
        { name: "Waffle & Ice Cream", price: 65, veg: "veg", description: "Belgian waffle with ice cream and syrup" },
    ],
    "Cold Drinks": [
        { name: "Milkshake", price: 45, veg: "veg", description: "Thick milkshake in vanilla, choc or strawberry" },
    ],
};

async function setup() {
    console.log("🚀 Setting up demo restaurant...");

    const password = await bcrypt.hash("nova123", 10);

    const account = await prisma.account.upsert({
        where: { username: "nova" },
        update: {},
        create: {
            username: "nova",
            email: "admin@nova.com",
            password,
            verified: true,
            accountActive: true,
            subscriptionActive: true,
            aiProvider: "groq",
            aiName: "ZapOder",
        },
    });
    console.log("✅ Account created: admin@nova.com / nova123");

    await prisma.profile.upsert({
        where: { restaurantID: "nova" },
        update: {},
        create: {
            restaurantID: "nova",
            name: "Nova Kitchen & Bar",
            description: "A proudly South African dining experience.",
            address: "12 Mandela Square, Sandton, Johannesburg",
            categories: Object.keys(menuItems),
        },
    });
    console.log("✅ Profile created");

    await prisma.table.createMany({
        data: [
            { name: "Table 1", username: "table1", restaurantID: "nova" },
            { name: "Table 2", username: "table2", restaurantID: "nova" },
            { name: "Table 3", username: "table3", restaurantID: "nova" },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Tables created");

    await prisma.menu.deleteMany({ where: { restaurantID: "nova" } });

    let total = 0;
    for (const [category, items] of Object.entries(menuItems)) {
        for (const item of items) {
            await prisma.menu.create({
                data: { ...item, category, taxPercent: 15, restaurantID: "nova", image: IMAGE },
            });
            total++;
        }
    }
    console.log(`✅ Created ${total} menu items`);

    await prisma.$disconnect();
    console.log("\n🎉 Done! Visit: http://localhost:3000/nova?table=table1");
    console.log("   Admin login: admin@nova.com / nova123");
}

setup().catch((e) => { console.error(e); process.exit(1); });
