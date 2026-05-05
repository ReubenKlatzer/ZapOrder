import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { category, action } = await req.json();
		if (!category) throw { status: 400, message: "Category name is required" };

		const profile = await prisma.profile.findUnique({ where: { restaurantID: session.username } });
		if (!profile) throw { status: 404, message: "Profile not found" };

		const cat = category.toLowerCase();
		const categories = action === "remove"
			? profile.categories.filter((c) => c !== cat)
			: profile.categories.includes(cat) ? profile.categories : [...profile.categories, cat];

		await prisma.profile.update({ where: { restaurantID: session.username }, data: { categories } });
		return NextResponse.json({ message: "Categories updated" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
