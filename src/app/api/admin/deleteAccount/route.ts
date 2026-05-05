import { NextResponse } from "next/server";

import prisma from "#utils/database/connect";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET(req: Request) {
	try {
		const secret = new URL(req.url).searchParams.get("secret");
		if (secret !== process.env.REGISTER_SECRET) throw { status: 403, message: "Not authorized" };

		const accounts = await prisma.account.findMany({
			select: { id: true, username: true, email: true, createdAt: true, profile: { select: { name: true } } },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(accounts);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function DELETE(req: Request) {
	try {
		const { username, secret } = await req.json();
		if (secret !== process.env.REGISTER_SECRET) throw { status: 403, message: "Not authorized" };
		if (!username) throw { status: 400, message: "Username is required" };

		await prisma.profile.deleteMany({ where: { restaurantID: username } });
		await prisma.kitchen.deleteMany({ where: { restaurantID: username } });
		await prisma.table.deleteMany({ where: { restaurantID: username } });

		// Delete order products first (they reference menus)
		const menus = await prisma.menu.findMany({ where: { restaurantID: username }, select: { id: true } });
		const menuIds = menus.map((m) => m.id);
		await prisma.orderProduct.deleteMany({ where: { menuId: { in: menuIds } } });

		// Delete orders for this restaurant
		const orders = await prisma.order.findMany({ where: { restaurantID: username }, select: { id: true } });
		const orderIds = orders.map((o) => o.id);
		await prisma.orderProduct.deleteMany({ where: { orderId: { in: orderIds } } });
		await prisma.order.deleteMany({ where: { restaurantID: username } });

		await prisma.menu.deleteMany({ where: { restaurantID: username } });
		await prisma.account.delete({ where: { username } });

		return NextResponse.json({ message: `Account "${username}" deleted successfully` });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
