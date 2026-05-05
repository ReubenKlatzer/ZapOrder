import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const account = await prisma.account.findUnique({
			where: { username: session.username },
			include: { profile: true, tables: true, menus: true, kitchens: true },
		});

		if (!account) throw { status: 500, message: "Unable to fetch data" };

		return NextResponse.json({ profile: account.profile, menus: account.menus, tables: account.tables, kitchens: account.kitchens });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
