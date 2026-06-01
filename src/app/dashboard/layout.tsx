/* eslint-disable react/no-danger */
import type { ReactNode } from "react";
import Script from "next/script";

import { themeController } from "xtreme-ui";

import { getThemeColor } from "#utils/database/helper/getThemeColor";

export const metadata = {
	title: "ZapOrder ⌘ Admin",
};

export default async function DashboardLayout({ children }: IRootProps) {
	const themeColor = await getThemeColor();
	return (
		<>
			<Script id="theme-controller" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeController({ color: themeColor }) }} />
			{children}
		</>
	);
}

interface IRootProps {
	children?: ReactNode;
}
