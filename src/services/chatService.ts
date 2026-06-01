import { getSystemPrompt } from "#utils/ai/prompt";
import { smartGenerateText } from "#utils/ai/switcher";
import { getRestaurantData } from "#utils/database/helper/account";
import type { TMenu } from "#utils/database/models/menu";

export async function getChatResponse(messages: unknown[], restaurantId: string, customerName?: string) {
	const name = restaurantId.replace(/\b\w/g, (c: string) => c.toUpperCase()).replace(/[-_]/g, " ");
	const account = await getRestaurantData(restaurantId).catch(() => null);

	if (!account) throw { status: 404, message: `Restaurant '${name}' not found` };

	const items: TMenu[] = account?.menus || [];
	const menuMap = new Map(items.map((i) => [i.name.toLowerCase(), i]));

	const aiConfig = account.aiProvider ? {
		provider: account.aiProvider,
		model: account.aiModel,
		apiKey: account.aiApiKey,
	} : undefined;

	const result = await smartGenerateText({ system: getSystemPrompt(name, items, customerName, account.aiName || undefined), messages }, aiConfig);

	let text = result.text;
	const toolResults: TMenu[][] = [];
	let addToCart: TMenu[] = [];

	// Handle recommendations
	const recMatch = text.match(/<<<REC:?(.*?)>>>/);
	if (recMatch) {
		text = text.replace(recMatch[0], "").trim();
		try {
			const names = JSON.parse(recMatch[1]);
			if (Array.isArray(names)) {
				const found = names.map((n: string) => menuMap.get(n.toLowerCase())).filter((i): i is TMenu => !!i);
				if (found.length) toolResults.push(found);
			}
		} catch {}
	}

	// Handle add to cart
	const cartMatch = text.match(/<<<ADD_TO_CART:?(.*?)>>>/);
	if (cartMatch) {
		text = text.replace(cartMatch[0], "").trim();
		try {
			const names = JSON.parse(cartMatch[1]);
			if (Array.isArray(names)) {
				addToCart = names.map((n: string) => menuMap.get(n.toLowerCase())).filter((i): i is TMenu => !!i);
			}
		} catch {}
	}

	return { text, toolResults, addToCart };
}
