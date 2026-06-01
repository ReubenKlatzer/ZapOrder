import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import prisma from "#utils/database/connect";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.customer?.id) throw { status: 401, message: "Authentication Required" };

		const orders = await prisma.order.findMany({
			where: { customerId: session.customer.id },
			orderBy: { createdAt: "desc" },
			include: {
				products: {
					include: { menu: true },
				},
			},
		});

		return NextResponse.json(orders);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
