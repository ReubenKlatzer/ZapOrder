import { getServerSession } from "next-auth";
import { authOptions } from "#utils/helper/authHelper";
import prisma from "../connect";

export const getThemeColor = async (username?: string) => {
	if (!username) {
		const session = await getServerSession(authOptions);
		return session?.themeColor;
	}
	const profile = await prisma.profile.findUnique({ where: { restaurantID: username } });
	if (!profile?.themeH) return undefined;
	return { h: profile.themeH, s: profile.themeS, l: profile.themeL };
};
