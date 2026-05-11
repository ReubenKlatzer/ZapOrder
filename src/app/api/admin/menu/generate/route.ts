import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import { smartGenerateText } from "#utils/ai/switcher";
import prisma from "#utils/database/connect";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { name, category } = await req.json();
		if (!name) throw { status: 400, message: "Item name is required" };

		const account = await prisma.account.findUnique({
			where: { username: session.username },
			select: { aiProvider: true, aiModel: true, aiApiKey: true },
		});

		const aiConfig = account?.aiApiKey
			? { provider: account.aiProvider ?? undefined, model: account.aiModel ?? undefined, apiKey: account.aiApiKey }
			: undefined;

		const result = await smartGenerateText(
			{
				system: "You are a restaurant menu assistant. Write concise, appetizing menu item descriptions in 1-2 sentences. Only return the description text, nothing else.",
				prompt: `Write a short menu description for: "${name}"${category ? ` (category: ${category})` : ""}`,
				maxTokens: 100,
			},
			aiConfig,
		);

		const description = result.text.trim();

		let image = "";
		try {
			const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
			if (wikiRes.ok) {
				const wikiData = await wikiRes.json();
				image = wikiData?.thumbnail?.source ?? wikiData?.originalimage?.source ?? "";
			}
		} catch {
			image = "";
		}

		return NextResponse.json({ description, image });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
