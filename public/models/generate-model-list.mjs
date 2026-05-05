/**
 * Generate 3D Model List
 * 
 * This script generates a list of all menu items that need 3D models.
 * Run: node public/models/generate-model-list.mjs
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function generateModelList() {
	console.log("📋 Generating 3D model list...\n");

	const menus = await prisma.menu.findMany({
		where: { hidden: false },
		select: { name: true, category: true, image: true },
		orderBy: { category: "asc" },
	});

	const modelList = menus.map((item) => {
		const filename = item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
		return {
			name: item.name,
			category: item.category,
			hasImage: !!item.image,
			glbFile: `${filename}.glb`,
			usdzFile: `${filename}.usdz`,
		};
	});

	// Group by category
	const byCategory = modelList.reduce((acc, item) => {
		if (!acc[item.category]) acc[item.category] = [];
		acc[item.category].push(item);
		return acc;
	}, {});

	// Generate markdown
	let markdown = "# 3D Models Needed\n\n";
	markdown += `Total items: ${modelList.length}\n\n`;
	markdown += "## By Category\n\n";

	for (const [category, items] of Object.entries(byCategory)) {
		markdown += `### ${category} (${items.length} items)\n\n`;
		items.forEach((item) => {
			markdown += `- [ ] **${item.name}**\n`;
			markdown += `  - File: \`${item.glbFile}\`\n`;
			markdown += `  - Has Image: ${item.hasImage ? "✅" : "❌"}\n`;
		});
		markdown += "\n";
	}

	// Generate simple list
	markdown += "## File List (for batch download)\n\n";
	markdown += "```\n";
	modelList.forEach((item) => {
		markdown += `${item.glbFile}\n`;
	});
	markdown += "```\n";

	// Save to file
	writeFileSync("public/models/MODEL_LIST.md", markdown);
	console.log("✅ Model list saved to: public/models/MODEL_LIST.md");
	console.log(`📊 Total items: ${modelList.length}`);
	console.log(`📁 Categories: ${Object.keys(byCategory).length}`);

	await prisma.$disconnect();
}

generateModelList().catch((e) => {
	console.error(e);
	process.exit(1);
});
