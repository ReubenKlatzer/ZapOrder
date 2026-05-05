import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { isValidThemeColor } from "xtreme-ui";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const { themeColor } = await req.json();

		if (!session) throw { status: 401, message: "Authentication Required" };
		if (!isValidThemeColor(themeColor)) throw { status: 400, message: "Valid theme color is required" };

		await prisma.profile.update({
			where: { restaurantID: session.username },
			data: { themeH: themeColor.h, themeS: themeColor.s, themeL: themeColor.l },
		});

		return NextResponse.json({ status: 200, message: "Theme applied successfully" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
