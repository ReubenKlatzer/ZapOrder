import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import { hashPassword, verifyPassword } from "#utils/helper/passwordHelper";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const { password, newPassword } = await req.json();

		if (!session) throw { status: 401, message: "Authentication Required" };
		if (!password) throw { status: 400, message: "Password Required" };
		if (!newPassword) throw { status: 400, message: "New Password Required" };

		const account = await prisma.account.findUnique({ where: { username: session.username } });
		if (!account) throw { status: 500, message: "Something went wrong" };

		if (!(await verifyPassword(password, account.password))) return NextResponse.json({ status: 403, message: "Password incorrect" });

		await prisma.account.update({ where: { username: session.username }, data: { password: await hashPassword(newPassword) } });
		return NextResponse.json({ status: 200, message: "Password successfully changed" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
