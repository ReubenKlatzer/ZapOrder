import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { placeOrder } from "#services/orderService";
import type { TProduct } from "#utils/database/models/order";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const body = await req.json();

		if (!session) throw { status: 401, message: "Authentication Required" };

		const message = await placeOrder(
			session.restaurant?.username,
			session.restaurant?.table,
			session.customer?._id ?? session.customer?.id,
			body?.products as { id: string; quantity: number }[],
		);

		return NextResponse.json({ status: 200, message });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
