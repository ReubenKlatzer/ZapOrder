"use client";

import { useSearchParams } from "next/navigation";

import UnderConstruction from "#components/layout/UnderConstruction";

import OrderPage from "./Menu/OrderPage";
import ReviewsPage from "./Reviews/ReviewsPage";
import ContactPage from "./Contact/ContactPage";
import ExplorePage from "./Explore/ExplorePage";

export default function PageContainer() {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");

	return (
		<div className="pageContainer">
			{tab === "explore" && <ExplorePage />}
			{tab === "menu" && <OrderPage />}
			{tab === "reviews" && <ReviewsPage />}
			{tab === "contact" && <ContactPage />}
		</div>
	);
}
