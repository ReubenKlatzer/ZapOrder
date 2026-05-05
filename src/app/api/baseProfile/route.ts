import pick from "lodash/pick";
import { NextResponse } from "next/server";

import prisma from "#utils/database/connect";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET(req: Request) {
	try {
		const email = new URL(req.url).searchParams.get("email");
		if (!email) throw { status: 400, message: "Email is required" };

		const account = await prisma.account.findUnique({ where: { email }, include: { profile: true } });
		if (!account) throw { status: 404, message: "Account not found" };

		const profile = account.profile;
		const themeColor = profile?.themeH ? { h: profile.themeH, s: profile.themeS, l: profile.themeL } : undefined;
		return NextResponse.json({ ...pick(profile, ["name", "address", "avatar"]), themeColor });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
