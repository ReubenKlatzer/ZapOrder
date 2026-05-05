import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "#utils/database/connect";
import { isEmailValid } from "./common";
import { hashPassword, verifyPassword } from "./passwordHelper";

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			id: "restaurant",
			name: "restaurant",
			credentials: {
				username: { label: "Username", type: "text" },
				kitchen: { label: "Kitchen Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(cred) {
				if (!cred?.username) throw new Error("Restaurant username is required");
				if (!cred?.password) throw new Error("Password is required");

				const where = isEmailValid(cred.username) ? { email: cred.username } : { username: cred.username };
				const account = await prisma.account.findUnique({
					where,
					include: {
						profile: true,
						kitchens: cred.kitchen ? { where: { username: cred.kitchen } } : false,
					},
				});

				if (!account) throw new Error("Account not found.");

				if (cred.kitchen) {
					const kitchen = account.kitchens?.[0];
					if (!kitchen || !(await verifyPassword(cred.password, kitchen.password))) throw new Error("Invalid kitchen credentials");
					return {
						id: account.id,
						role: "kitchen",
						themeColor: account.profile ? { h: account.profile.themeH, s: account.profile.themeS, l: account.profile.themeL } : undefined,
						_doc: { role: "kitchen", username: account.username, email: account.email, accountActive: account.accountActive, verified: account.verified },
					};
				}

				if (!(await verifyPassword(cred.password, account.password))) throw new Error("Invalid admin credentials");
				return {
					id: account.id,
					role: "admin",
					themeColor: account.profile ? { h: account.profile.themeH, s: account.profile.themeS, l: account.profile.themeL } : undefined,
					_doc: { role: "admin", username: account.username, email: account.email, accountActive: account.accountActive, verified: account.verified },
				};
			},
		}),
		CredentialsProvider({
			id: "customer",
			name: "customer",
			credentials: {
				restaurant: { label: "Restaurant Username", type: "text" },
				table: { label: "Table ID", type: "string" },
				phone: { label: "Phone Number", type: "number" },
				fname: { label: "First Name", type: "text" },
				lname: { label: "Last Name", type: "text" },
			},
			async authorize(cred) {
				if (!cred?.restaurant) throw new Error("Restaurant id is required");
				if (!cred?.table) throw new Error("Table id is required");
				if (!cred?.fname) throw new Error("First name is required");
				if (!cred?.lname) throw new Error("Last name is required");
				if (!cred?.phone) throw new Error("Phone number is required");

				let customer = await prisma.customer.findUnique({ where: { phone: cred.phone } });
				if (!customer) customer = await prisma.customer.create({ data: { fname: cred.fname, lname: cred.lname, phone: cred.phone } });

				const account = await prisma.account.findUnique({
					where: { username: cred.restaurant },
					include: { profile: true, tables: true },
				});

				if (!account) throw new Error("Restaurant not found.");
				if (!account.tables.some((t) => t.username === cred.table)) throw new Error("Invalid table id");

				return {
					id: customer.id,
					role: "customer",
					themeColor: account.profile ? { h: account.profile.themeH, s: account.profile.themeS, l: account.profile.themeL } : undefined,
					_doc: {
						role: "customer",
						customer,
						restaurant: {
							username: account.username,
							table: cred.table,
							name: account.profile?.name,
							avatar: account.profile?.avatar,
						},
					},
				};
			},
		}),
	],
	session: { 
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: "/",
	},
	callbacks: {
		async session({ session, token }) {
			session = { ...session, ...token?.user };
			delete session.user;
			return session;
		},
		async jwt({ token, user, account }) {
			if (account?.provider === "restaurant" || account?.provider === "customer") {
				if (user) token.user = user._doc;
			}
			return token;
		},
	},
};
