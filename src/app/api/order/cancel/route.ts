import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { cancelOrder } from "#services/orderService";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		await cancelOrder(session.restaurant?.username, session.customer?._id ?? session.customer?.id);

		return NextResponse.json({ status: 200, message: "Order canceled." });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
