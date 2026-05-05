import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getMenuByUsername } from "#services/menuService";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET(req: Request) {
	try {
		let username = new URL(req.url).searchParams.get("id");

		if (!username) {
			const session = await getServerSession(authOptions);
			username = session?.username ?? null;
		}
		if (!username) throw { status: 400, message: "Restaurant id is required to fetch menu" };

		return NextResponse.json(await getMenuByUsername(username));
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
