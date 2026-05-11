import forEach from "lodash/forEach";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export const fetcher = (url: string) => 
	fetch(url).then((r) => {
		if (!r.ok) {
			throw new Error(`HTTP error! status: ${r.status}`);
		}
		const contentType = r.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return r.json();
		}
		throw new Error("Response is not JSON");
	});
export const CatchNextResponse = (error: Partial<NextResponseError> | unknown) => {
	const err = error as Partial<NextResponseError>;
	const message = err?.message ?? "Something went wrong";
	const status = err?.status ?? 500;
	return NextResponse.json({ message, status }, { status });
};

export const scrollToSection = (section?: string) => {
	const element = document.getElementById(section ? section : "homepage") as HTMLDivElement;
	element.scrollIntoView({ behavior: "smooth" });
};

export const isEmailValid = (email?: string) => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(email ?? "");
};

export const createQueryString = (searchParams: ReadonlyURLSearchParams, query: Record<string, string>) => {
	const params = new URLSearchParams(searchParams);
	forEach(query, (value, key) => params.set(key, value));
	return params.toString();
};

export const splitStringByFirstWord = (sentence: string) => {
	if (!sentence) {
		return;
	}

	sentence = sentence.trim();
	return [
		sentence.replace(/ .*/, ""), // Get first word from sentence
		sentence.replace(/\w+ /, ""), // Get remaining sentence except first word
	];
};
