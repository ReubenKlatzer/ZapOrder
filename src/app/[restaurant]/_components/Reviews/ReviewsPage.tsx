"use client";

import { usePathname } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Button, Spinner, Textfield } from "xtreme-ui";

import { fetcher } from "#utils/helper/common";

import "./reviews.scss";

type TReview = {
	id: string;
	customerName: string;
	rating: number;
	comment?: string;
	createdAt: string;
};

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
	<div className="starRating">
		{[1, 2, 3, 4, 5].map((star) => (
			<span
				key={star}
				className={`star ${star <= value ? "filled" : ""} ${onChange ? "interactive" : ""}`}
				onClick={() => onChange?.(star)}
			>
				★
			</span>
		))}
	</div>
);

const ReviewsPage = () => {
	const pathname = usePathname();
	const restaurantID = pathname.replace("/", "");
	const { data: reviews = [], isLoading, mutate } = useSWR<TReview[]>(`/api/reviews?id=${restaurantID}`, fetcher);

	const [name, setName] = useState("");
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const avgRating = reviews.length
		? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
		: null;

	const onSubmit = async () => {
		if (!name.trim()) return toast.error("Please enter your name");
		if (rating === 0) return toast.error("Please select a rating");
		setSubmitting(true);
		const res = await fetch("/api/reviews", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ restaurantID, customerName: name, rating, comment }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else {
			toast.success("Review submitted!");
			setName(""); setRating(0); setComment("");
			await mutate();
		}
		setSubmitting(false);
	};

	if (isLoading) return <Spinner fullpage label="Loading reviews..." />;

	return (
		<div className="reviewsPage">
			<div className="reviewsHeader">
				<h1 className="reviewsTitle">Reviews</h1>
				{avgRating && (
					<div className="reviewsAvg">
						<span className="avgScore">{avgRating}</span>
						<StarRating value={Math.round(Number(avgRating))} />
						<span className="reviewCount">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
					</div>
				)}
			</div>

			<div className="reviewForm">
				<h3>Leave a Review</h3>
				<Textfield placeholder="Your name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
				<div className="ratingRow">
					<span>Rating</span>
					<StarRating value={rating} onChange={setRating} />
				</div>
				<Textfield placeholder="Comment (optional)" value={comment} onChange={(e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)} onEnterKey={onSubmit} />
				<Button label="Submit Review" onClick={onSubmit} loading={submitting} />
			</div>

			<div className="reviewsList">
				{reviews.length === 0 && <p className="noReviews">No reviews yet. Be the first!</p>}
				{reviews.map((review) => (
					<div key={review.id} className="reviewCard">
						<div className="reviewCardHeader">
							<div className="reviewerInfo">
								<div className="reviewerAvatar">{review.customerName[0].toUpperCase()}</div>
								<div>
									<p className="reviewerName">{review.customerName}</p>
									<p className="reviewDate">{new Date(review.createdAt).toLocaleDateString()}</p>
								</div>
							</div>
							<StarRating value={review.rating} />
						</div>
						{review.comment && <p className="reviewComment">{review.comment}</p>}
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewsPage;
