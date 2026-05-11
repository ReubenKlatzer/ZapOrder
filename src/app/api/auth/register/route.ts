import { NextResponse } from "next/server";

import prisma from "#utils/database/connect";
import { CatchNextResponse, isEmailValid } from "#utils/helper/common";
import { hashPassword } from "#utils/helper/passwordHelper";

export async function POST(req: Request) {
	try {
		const { name, username, email, password, secret } = await req.json();

		console.log("Registration attempt:", { name, username, email, hasPassword: !!password, hasSecret: !!secret });
		console.log("Expected secret:", process.env.REGISTER_SECRET);

		if (secret !== process.env.REGISTER_SECRET) {
			console.error("Secret mismatch:", { received: secret, expected: process.env.REGISTER_SECRET });
			throw { status: 403, message: "Not authorized to register" };
		}
		if (!name || !username || !email || !password) throw { status: 400, message: "All fields are required" };
		if (!isEmailValid(email)) throw { status: 400, message: "Invalid email address" };
		if (!/^[a-z0-9_]+$/.test(username)) throw { status: 400, message: "Username can only contain lowercase letters, numbers, and underscores" };

		const existing = await prisma.account.findFirst({ where: { OR: [{ email }, { username }] } });
		if (existing) throw { status: 409, message: existing.email === email ? "Email already in use" : "Username already taken" };

		const hashed = await hashPassword(password);
		const account = await prisma.account.create({ data: { username, email, password: hashed } });
		await prisma.profile.create({ data: { name, restaurantID: account.username } });

		console.log("Restaurant created successfully:", username);
		return NextResponse.json({ message: "Restaurant registered successfully" }, { status: 201 });
	} catch (err) {
		console.error("Registration error:", err);
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}
