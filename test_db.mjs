import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	const accounts = await prisma.account.findMany();
	const profiles = await prisma.profile.findMany();
	console.log("Accounts:", JSON.stringify(accounts, null, 2));
	console.log("Profiles:", JSON.stringify(profiles, null, 2));
	await prisma.$disconnect();
}

main().catch(console.error);
