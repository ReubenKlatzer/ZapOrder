import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { name, address, avatar, description } = await req.json();

		await prisma.profile.update({
			where: { restaurantID: session.username },
			data: {
				...(name && { name }),
				...(address !== undefined && { address }),
				...(avatar !== undefined && { avatar }),
				...(description !== undefined && { description }),
			},
		});

		return NextResponse.json({ message: "Profile updated successfully" });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic";
