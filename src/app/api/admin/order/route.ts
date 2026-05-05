import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getAllOrders } from "#services/orderService";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		return NextResponse.json(await getAllOrders(session.username));
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
