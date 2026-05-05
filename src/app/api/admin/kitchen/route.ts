import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import { hashPassword } from "#utils/helper/passwordHelper";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { username, password } = await req.json();
		if (!username || !password) throw { status: 400, message: "Username and password are required" };

		const existing = await prisma.kitchen.findUnique({ where: { username } });
		if (existing) throw { status: 400, message: "Kitchen username already exists" };

		await prisma.kitchen.create({
			data: { username, password: await hashPassword(password), restaurantID: session.username },
		});

		return NextResponse.json({ message: "Kitchen staff added" }, { status: 201 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function PUT(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { id, password } = await req.json();
		if (!id || !password) throw { status: 400, message: "ID and new password are required" };

		await prisma.kitchen.updateMany({
			where: { id, restaurantID: session.username },
			data: { password: await hashPassword(password) },
		});

		return NextResponse.json({ message: "Password updated" }, { status: 200 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { id } = await req.json();
		if (!id) throw { status: 400, message: "ID is required" };

		await prisma.kitchen.deleteMany({ where: { id, restaurantID: session.username } });

		return NextResponse.json({ message: "Kitchen staff removed" }, { status: 200 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
