import { NextResponse } from "next/server";

import prisma from "#utils/database/connect";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET(req: Request) {
	try {
		const id = new URL(req.url).searchParams.get("id");
		if (!id) throw { status: 400, message: "Restaurant ID is required" };

		const profile = await prisma.profile.findUnique({
			where: { restaurantID: id },
			select: { name: true, description: true, address: true, avatar: true, cover: true, categories: true },
		});

		if (!profile) throw { status: 404, message: "Profile not found" };

		return NextResponse.json(profile);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
