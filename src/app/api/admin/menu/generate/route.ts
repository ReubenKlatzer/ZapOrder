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
		
		try {
			// Try Wikipedia first
			try {
				const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
				if (wikiRes.ok) {
					const wikiData = await wikiRes.json();
					image = wikiData?.thumbnail?.source ?? wikiData?.originalimage?.source ?? "";
					if (image) console.log("Found image from Wikipedia:", image);
				}
			} catch (e) {
				console.log("Wikipedia failed:", e);
			}

			// Try Unsplash
			if (!image) {
				try {
					const unsplashRes = await fetch(
						`https://api.unsplash.com/search/photos?query=${encodeURIComponent(name + " food")}&per_page=1`,
						{ headers: { Authorization: "Client-ID tXrQAJY-AZ_m0lZu5vH_yQoc-UdVfOcnjrflDWiMh0Q" } }
					);
					if (unsplashRes.ok) {
						const unsplashData = await unsplashRes.json();
						image = unsplashData?.results?.[0]?.urls?.regular ?? "";
						if (image) console.log("Found image from Unsplash:", image);
					}
				} catch (e) {
					console.log("Unsplash failed:", e);
				}
			}

			// Try Foodish API (always returns a food image)
			if (!image) {
				try {
					const foodishRes = await fetch("https://foodish-api.com/api/");
					if (foodishRes.ok) {
						const foodishData = await foodishRes.json();
						image = foodishData?.image ?? "";
						if (image) console.log("Found image from Foodish:", image);
					}
				} catch (e) {
					console.log("Foodish failed:", e);
				}
			}

			// Try LoremFlickr (always returns an image)
			if (!image) {
				image = `https://loremflickr.com/400/300/${encodeURIComponent(name)},food`;
				console.log("Using LoremFlickr:", image);
			}

		} catch (error) {
			console.error("All image sources failed:", error);
			// Fallback to a generic food image
			image = "https://loremflickr.com/400/300/food";
		}

		console.log("Final image URL:", image);
		return NextResponse.json({ description, image });
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

export const dynamic = "force-dynamic";
