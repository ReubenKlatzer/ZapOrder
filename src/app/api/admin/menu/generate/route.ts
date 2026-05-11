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
			},
			aiConfig,
		);

		const description = result.text.trim();

		let image = "";
		const searchQueries = [
			`${name} food dish`,
			`${name} food`,
			`${name} meal`,
			`${name} cuisine`,
			name,
			category ? `${category} food` : ""
		].filter(Boolean);

		try {
			for (const query of searchQueries) {
				if (image) break;

				const unsplashRes = await fetch(
					`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=tXrQAJY-AZ_m0lZu5vH_yQoc-UdVfOcnjrflDWiMh0Q`
				);
				if (unsplashRes.ok) {
					const unsplashData = await unsplashRes.json();
					image = unsplashData?.results?.[0]?.urls?.regular ?? "";
				}
			}

			if (!image) {
				const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
				if (wikiRes.ok) {
					const wikiData = await wikiRes.json();
					image = wikiData?.thumbnail?.source ?? wikiData?.originalimage?.source ?? "";
				}
			}

			if (!image) {
				for (const query of searchQueries) {
					if (image) break;
					
					const pexelsRes = await fetch(
						`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
						{ headers: { Authorization: "563492ad6f91700001000001c9d8d2a9c3d54d7f8b8c8f8c8c8c8c8c" } }
					);
					if (pexelsRes.ok) {
						const pexelsData = await pexelsRes.json();
						image = pexelsData?.photos?.[0]?.src?.large ?? "";
					}
				}
			}

			if (!image) {
				const pixabayRes = await fetch(
					`https://pixabay.com/api/?key=47581730-8b597d89f8c8b8c8c8c8c8c8&q=${encodeURIComponent(name + " food")}&image_type=photo&per_page=3`
				);
				if (pixabayRes.ok) {
					const pixabayData = await pixabayRes.json();
					image = pixabayData?.hits?.[0]?.largeImageURL ?? "";
				}
			}

			if (!image) {
				const foodishRes = await fetch(`https://foodish-api.com/api/`);
				if (foodishRes.ok) {
					const foodishData = await foodishRes.json();
					image = foodishData?.image ?? "";
				}
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
