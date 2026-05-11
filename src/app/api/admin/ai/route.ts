import { getServerSession } from "next-auth";
import prisma from "#utils/database/connect";
import { authOptions } from "#utils/helper/authHelper";

export async function PUT(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.username) return Response.json({ error: "Unauthorized" }, { status: 401 });

		const { aiProvider, aiModel, aiApiKey, aiName } = await req.json();

		await prisma.account.update({
			where: { username: session.username },
			data: { aiProvider, aiModel, aiApiKey, aiName },
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error updating AI config:", error);
		return Response.json({ error: "Failed to update AI config" }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.username) return Response.json({ error: "Unauthorized" }, { status: 401 });

		const account = await prisma.account.findUnique({
			where: { username: session.username },
			select: { aiProvider: true, aiModel: true, aiName: true },
		});

		return Response.json(account);
	} catch (error) {
		console.error("Error fetching AI config:", error);
		return Response.json({ error: "Failed to fetch AI config" }, { status: 500 });
	}
}
