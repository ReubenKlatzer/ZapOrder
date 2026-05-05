import { NextResponse } from "next/server";

import prisma from "#utils/database/connect";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const restaurantID = searchParams.get("id");
		if (!restaurantID) throw { status: 400, message: "Restaurant ID is required" };

		const reviews = await prisma.review.findMany({
			where: { restaurantID },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(reviews);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function POST(req: Request) {
	try {
		const { restaurantID, customerName, rating, comment } = await req.json();
		if (!restaurantID || !customerName || !rating) throw { status: 400, message: "Restaurant, name and rating are required" };
		if (rating < 1 || rating > 5) throw { status: 400, message: "Rating must be between 1 and 5" };

		const review = await prisma.review.create({
			data: { restaurantID, customerName, rating, comment },
		});

		return NextResponse.json({ message: "Review submitted!", review }, { status: 201 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function DELETE(req: Request) {
	try {
		const session = await (await import("next-auth")).getServerSession(
			(await import("#utils/helper/authHelper")).authOptions
		);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { id } = await req.json();
		if (!id) throw { status: 400, message: "Review ID is required" };

		await prisma.review.deleteMany({ where: { id, restaurantID: session.username } });

		return NextResponse.json({ message: "Review deleted" }, { status: 200 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
