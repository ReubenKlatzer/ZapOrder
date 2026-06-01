import { NextResponse } from "next/server";
import { CatchNextResponse } from "#utils/helper/common";
import prisma from "#utils/database/connect";

export async function POST(req: Request) {
	try {
		const { restaurantID, customerName, phone, mealName, description } = await req.json();
		
		if (!restaurantID || !customerName || !phone || !mealName) {
			throw { status: 400, message: "Restaurant ID, customer name, phone, and meal name are required" };
		}

		const suggestion = await prisma.mealSuggestion.create({
			data: {
				restaurantID,
				customerName,
				phone,
				mealName,
				description: description || null,
			},
		});

		return NextResponse.json({ message: "Meal suggestion submitted successfully", suggestion }, { status: 201 });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const restaurantID = searchParams.get("restaurantID");

		if (!restaurantID) throw { status: 400, message: "Restaurant ID is required" };

		const suggestions = await prisma.mealSuggestion.findMany({
			where: { restaurantID },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(suggestions);
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
