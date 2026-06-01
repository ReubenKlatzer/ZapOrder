import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import prisma from "#utils/database/connect";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { orderId, status, estimatedTime, message } = await req.json();
		if (!orderId || !status) throw { status: 400, message: "Order ID and status are required" };

		await prisma.order.update({
			where: { id: orderId },
			data: {
				trackingStatus: status,
				estimatedTime: estimatedTime || null,
			},
		});

		await prisma.orderTracking.create({
			data: {
				orderId,
				status,
				message: message || null,
			},
		});

		return NextResponse.json({ message: "Order tracking updated successfully" });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const orderId = searchParams.get("orderId");

		if (!orderId) throw { status: 400, message: "Order ID is required" };

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			select: {
				trackingStatus: true,
				estimatedTime: true,
				trackingHistory: {
					orderBy: { createdAt: "asc" },
				},
			},
		});

		if (!order) throw { status: 404, message: "Order not found" };

		return NextResponse.json(order);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
