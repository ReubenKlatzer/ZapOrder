import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { _id, name, description, category, price, taxPercent, veg, foodType, image } = await req.json();
		if (!name || !price || !veg || !category) throw { status: 400, message: "Name, price, veg and category are required" };

		if (_id) {
			await prisma.menu.update({ where: { id: _id }, data: { name, description, category, price: Number(price), taxPercent: Number(taxPercent ?? 0), veg, foodType, image } });
			return NextResponse.json({ message: "Menu item updated" });
		}

		await prisma.menu.create({ data: { name, description, category, price: Number(price), taxPercent: Number(taxPercent ?? 0), veg, foodType, image, restaurantID: session.username, hidden: false } });
		return NextResponse.json({ message: "Menu item created" }, { status: 201 });
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
		if (!id) throw { status: 400, message: "Item ID is required" };

		await prisma.orderProduct.deleteMany({ where: { menuId: id } });
		await prisma.menu.delete({ where: { id } });
		return NextResponse.json({ message: "Menu item deleted" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
