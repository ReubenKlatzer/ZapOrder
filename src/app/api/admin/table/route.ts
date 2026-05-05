import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { name } = await req.json();
		if (!name) throw { status: 400, message: "Table name is required" };

		const username = name.toLowerCase().replace(/\s+/g, "-");
		await prisma.table.create({ data: { name, username, restaurantID: session.username } });

		return NextResponse.json({ message: "Table created" }, { status: 201 });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { id } = await req.json();
		if (!id) throw { status: 400, message: "Table ID is required" };

		await prisma.table.deleteMany({ where: { id, restaurantID: session.username } });

		return NextResponse.json({ message: "Table deleted" }, { status: 200 });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
