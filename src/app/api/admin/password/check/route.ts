import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import { verifyPassword } from "#utils/helper/passwordHelper";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const { password } = await req.json();

		if (!session) throw { status: 401, message: "Authentication Required" };
		if (!password) throw { status: 400, message: "Password Required" };

		const account = await prisma.account.findUnique({ where: { username: session.username } });
		if (!account) throw { status: 500, message: "Something went wrong" };

		if (await verifyPassword(password, account.password)) return NextResponse.json({ status: 200, message: "Authentication Successful" });
		return NextResponse.json({ status: 403, message: "Password incorrect" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
