import { generateText } from "ai";
import prisma from "#utils/database/connect";
import { models, createCustomModel } from "./config";

const PROVIDER_ORDER = Object.keys(models) as (keyof typeof models)[];

export const getProviderState = async () => {
	let config = await prisma.aIConfig.findFirst();
	if (!config) config = await prisma.aIConfig.create({ data: { exhaustedProviders: [] } });
	return config;
};

export const getAvailableProvider = async () => {
	const config = await getProviderState();
	const exhausted = new Set(config.exhaustedProviders);
	return PROVIDER_ORDER.find((p) => !exhausted.has(p)) || null;
};

export const markProviderExhausted = async (provider: string) => {
	const config = await getProviderState();
	if (!config.exhaustedProviders.includes(provider)) {
		await prisma.aIConfig.update({
			where: { id: config.id },
			data: { exhaustedProviders: [...config.exhaustedProviders, provider] },
		});
	}
};

export const resetProviders = async () => {
	const config = await getProviderState();
	await prisma.aIConfig.update({
		where: { id: config.id },
		data: { exhaustedProviders: [] },
	});
};

type AIConfig = {
	provider?: string;
	model?: string;
	apiKey?: string;
};

export const smartGenerateText = async (params: Omit<Parameters<typeof generateText>[0], "model">, aiConfig?: AIConfig) => {
	if (aiConfig?.provider && aiConfig?.apiKey) {
		try {
			const providerUrls: Record<string, string> = {
				groq: "https://api.groq.com/openai/v1",
				cerebras: "https://api.cerebras.ai/v1",
				google: "https://generativelanguage.googleapis.com/v1beta/openai",
				siliconflow: "https://api.siliconflow.com/v1",
				nova: "https://nova-litellm-production.up.railway.app",
			};
			const baseURL = providerUrls[aiConfig.provider] || aiConfig.provider;
			const model = createCustomModel(baseURL, aiConfig.apiKey, aiConfig.model || "gpt-4o-mini", aiConfig.provider);
			console.log(`[AI] Using custom provider: ${aiConfig.provider}`);
			return await generateText({ ...params, model } as Parameters<typeof generateText>[0]);
		} catch (error) {
			console.error(`[AI] Custom provider ${aiConfig.provider} failed:`, (error as Error).message);
		}
	}

	let currentProvider = await getAvailableProvider();

	if (!currentProvider) {
		await resetProviders();
		currentProvider = PROVIDER_ORDER[0];
	}

	while (currentProvider) {
		try {
			console.log(`[AI] Trying provider: ${currentProvider}`);
			const result = await generateText({
				...params,
				model: models[currentProvider],
			} as Parameters<typeof generateText>[0]);
			return result;
		} catch (error) {
			console.error(`[AI] Provider ${currentProvider} failed:`, (error as Error).message);
			await markProviderExhausted(currentProvider);
			currentProvider = await getAvailableProvider();
		}
	}
	throw new Error("All AI providers exhausted");
};
