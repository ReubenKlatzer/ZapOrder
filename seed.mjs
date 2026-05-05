import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// High-end food placeholder
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";

const categories = [
    "Braai & Grills", "Bunny Chow", "Pap & Vleis", "Seafood", "Burgers",
    "Wraps & Rolls", "Salads", "Starters", "Pasta & Rice", "Vetkoek",
    "Desserts", "Cold Drinks", "Hot Drinks", "Alcoholic Drinks", "Kids Meals",
];

const menuItems = {
    "Braai & Grills": [
        { name: "Boerewors Roll", price: 45, veg: "non-veg", description: "Grilled boerewors in a fresh roll with chakalaka", image: "https://images.unsplash.com/photo-1599321955323-e06aa59f567c?q=80&w=1000&auto=format&fit=crop" },
        { name: "Lamb Chops (3pc)", price: 189, veg: "non-veg", description: "Marinated lamb chops grilled over open flame", image: "https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=1000&auto=format&fit=crop" },
        { name: "T-Bone Steak 300g", price: 245, veg: "non-veg", description: "Prime T-bone with garlic butter and chips", image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=1000&auto=format&fit=crop" },
        { name: "Mixed Braai Platter", price: 299, veg: "non-veg", description: "Boerewors, chops, chicken and ribs for two", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Bunny Chow": [
        { name: "Quarter Mutton Bunny", price: 75, veg: "non-veg", description: "Durban-style mutton curry in a quarter loaf", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop" },
        { name: "Quarter Bean Bunny", price: 55, veg: "veg", description: "Butter bean curry in a quarter loaf", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Pap & Vleis": [
        { name: "Pap & Boerewors", price: 79, veg: "non-veg", description: "Stiff pap with grilled boerewors and tomato relish", image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Seafood": [
        { name: "Grilled Hake & Chips", price: 99, veg: "non-veg", description: "Fresh hake fillet grilled with lemon butter", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop" },
        { name: "Prawn Skewers (6pc)", price: 145, veg: "non-veg", description: "Peri-peri marinated prawns on skewers", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Burgers": [
        { name: "Classic Beef Burger", price: 89, veg: "non-veg", description: "Beef patty, lettuce, tomato, cheese and sauce", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
        { name: "Double Smash Burger", price: 119, veg: "non-veg", description: "Two smashed beef patties with special sauce", image: "https://images.unsplash.com/photo-1550317144-b38c5f6906bf?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Desserts": [
        { name: "Chocolate Brownie", price: 45, veg: "veg", description: "Warm chocolate brownie with ice cream", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=1000&auto=format&fit=crop" },
        { name: "Waffle & Ice Cream", price: 65, veg: "veg", description: "Belgian waffle with ice cream and syrup", image: "https://images.unsplash.com/photo-1562329265-95a6d7a83440?q=80&w=1000&auto=format&fit=crop" },
    ],
    "Cold Drinks": [
        { name: "Milkshake", price: 45, veg: "veg", description: "Thick milkshake in vanilla, choc or strawberry", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop" },
    ],
};

async function seed() {
    console.log("🚀 Seeding Nova with Online Images...");

    await prisma.profile.update({
        where: { restaurantID: "nova" },
        data: {
            name: "Nova Kitchen & Bar",
            description: "A proudly South African dining experience.",
            address: "12 Mandela Square, Sandton, Johannesburg, 2196",
            categories,
        },
    });

    // Upsert Account for nova with AI config
    await prisma.account.upsert({
      where: { username: "nova" },
      update: {
        aiProvider: "nova",
        aiModel: "gpt-4o-mini",
        aiApiKey: process.env.AI_NOVA_KEY || "",\n        aiName: "ZapOder"\n      },\n      create: {
        username: "nova",
        email: "nova@orderworder.ai",
        password: await bcrypt.hash("nova123", 10),
        verified: true,
        accountActive: true,
        subscriptionActive: true,
        aiProvider: "nova",
        aiModel: "gpt-4o-mini",
        aiApiKey: process.env.AI_NOVA_KEY || "",\n        aiName: "ZapOder"\n      }\n    });\n    console.log("✅ Account 'nova' created/updated with aiName='ZapOder'");\n

    await prisma.menu.deleteMany({ where: { restaurantID: "nova" } });

    let total = 0;
    for (const [category, items] of Object.entries(menuItems)) {
        for (const item of items) {
            await prisma.menu.create({
                data: {
                    name: item.name,
                    price: item.price,
                    veg: item.veg,
                    description: item.description,
                    image: item.image || DEFAULT_IMAGE,
                    category,
                    taxPercent: 15,
                    restaurantID: "nova",
                    hidden: false,
                },
            });
            total++;
        }
    }

    console.log(`✅ Created ${total} items with live URLs.`);
    await prisma.$disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
