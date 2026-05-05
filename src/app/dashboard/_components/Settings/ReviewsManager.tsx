"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Button, Spinner } from "xtreme-ui";

import { useAdmin } from "#components/context/useContext";
import { fetcher } from "#utils/helper/common";

type TReview = {
	id: string;
	customerName: string;
	rating: number;
	comment?: string;
	createdAt: string;
};

const Stars = ({ value }: { value: number }) => (
	<span style={{ color: "#f5a623", fontSize: 14 }}>{"★".repeat(value)}{"☆".repeat(5 - value)}</span>
);

const ReviewsManager = () => {
	const { profile } = useAdmin();
	const restaurantID = profile?.restaurantID;
	const { data: reviews = [], isLoading, mutate } = useSWR<TReview[]>(
		restaurantID ? `/api/reviews?id=${restaurantID}` : null,
		fetcher,
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const onDelete = async (id: string) => {
		setDeletingId(id);
		const res = await fetch("/api/reviews", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); await mutate(); }
		setDeletingId(null);
	};

	if (isLoading) return <Spinner fullpage label="Loading reviews..." />;

	const rowStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "flex-start",
		justifyContent: "space-between",
		padding: "14px 16px",
		borderRadius: 10,
		background: "var(--colorBackgroundSecondary)",
		marginBottom: 8,
		gap: 12,
	};

	return (
		<div style={{ padding: "15px 35px", display: "flex", flexDirection: "column", gap: 20 }}>
			<h1 style={{ margin: 0, fontSize: 24, fontVariationSettings: "'wdth' 75, 'wght' 300", color: "var(--colorContentPrimary)" }}>
				Reviews <span style={{ fontSize: 14, color: "var(--colorContentSecondary)", fontVariationSettings: "'wght' 400" }}>({reviews.length})</span>
			</h1>
			{reviews.length === 0 && <p style={{ color: "var(--colorContentSecondary)" }}>No reviews yet.</p>}
			{reviews.map((review) => (
				<div key={review.id} style={rowStyle}>
					<div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
							<p style={{ margin: 0, fontWeight: 600, color: "var(--colorContentPrimary)" }}>{review.customerName}</p>
							<Stars value={review.rating} />
							<p style={{ margin: 0, fontSize: 11, color: "var(--colorContentSecondary)" }}>
								{new Date(review.createdAt).toLocaleDateString()}
							</p>
						</div>
						{review.comment && <p style={{ margin: 0, fontSize: 13, color: "var(--colorContentSecondary)" }}>{review.comment}</p>}
					</div>
					<Button
						icon="f2ed"
						iconType="solid"
						size="mini"
						type="secondary"
						loading={deletingId === review.id}
						onClick={() => onDelete(review.id)}
					/>
				</div>
			))}
		</div>
	);
};

export default ReviewsManager;
