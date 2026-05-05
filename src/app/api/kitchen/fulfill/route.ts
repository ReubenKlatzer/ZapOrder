import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { orderId, productId } = await req.json();
		if (!orderId || !productId) throw { status: 400, message: "orderId and productId are required" };

		await prisma.orderProduct.update({
			where: { id: productId },
			data: { fulfilled: true },
		});

		return NextResponse.json({ message: "Item marked as fulfilled" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
