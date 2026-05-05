"use client";

import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { Spinner } from "xtreme-ui";

import type { TMenu } from "#utils/database/models/menu";
import { fetcher } from "#utils/helper/common";

import "./explore.scss";

type TProfile = {
	name: string;
	description?: string;
	address?: string;
	avatar?: string;
	cover?: string;
	categories?: string[];
};

type TReview = { rating: number };

const Stars = ({ value }: { value: number }) => (
	<div className="stars">
		{[1, 2, 3, 4, 5].map((s) => (
			<span key={s} className={s <= Math.round(value) ? "filled" : ""}>★</span>
		))}
	</div>
);

const ExplorePage = () => {
	const pathname = usePathname();
	const router = useRouter();
	const id = pathname.replace("/", "");

	const { data: profile, isLoading } = useSWR<TProfile>(`/api/publicProfile?id=${id}`, fetcher);
	const { data: reviewsRaw } = useSWR<TReview[]>(`/api/reviews?id=${id}`, fetcher);
	const { data: menuRaw } = useSWR<TMenu[]>(`/api/menu?id=${id}`, fetcher);

	const reviews: TReview[] = Array.isArray(reviewsRaw) ? reviewsRaw : [];
	const menu: TMenu[] = Array.isArray(menuRaw) ? menuRaw : [];

	const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
	const featured = menu.filter((i) => !i.hidden).slice(0, 6);

	if (isLoading) return <Spinner fullpage label="Loading..." />;

	return (
		<div className="explorePage">

			{/* Hero */}
			<div className="hero" style={{ backgroundImage: profile?.cover ? `url(${profile.cover})` : undefined }}>
				<div className="heroOverlay" />
				<div className="heroContent">
					{profile?.avatar && <img className="heroLogo" src={profile.avatar} alt={profile.name} />}
					<div className="heroText">
						<h1>{profile?.name}</h1>
						{profile?.description && <p>{profile.description}</p>}
						{!!profile?.categories?.length && (
							<div className="chips">
								{profile.categories.map((c) => <span key={c} className="chip">{c}</span>)}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="exploreBody">

				{/* Rating Snapshot */}
				{avg !== null && (
					<div className="card ratingCard">
						<div className="ratingLeft">
							<span className="avgScore">{avg.toFixed(1)}</span>
							<div>
								<Stars value={avg} />
								<span className="reviewCount">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
							</div>
						</div>
						<button onClick={() => router.push(`${pathname}?tab=reviews`)}>See all reviews →</button>
					</div>
				)}

				{/* Featured Items */}
				{featured.length > 0 && (
					<div className="section">
						<div className="sectionHead">
							<h2>Featured Items</h2>
							<button onClick={() => router.push(`${pathname}?tab=menu`)}>View menu →</button>
						</div>
						<div className="featuredGrid">
							{featured.map((item) => (
								<div key={item.id} className="featuredCard" onClick={() => router.push(`${pathname}?tab=menu`)}>
									{item.image
										? <div className="featuredImg" style={{ backgroundImage: `url(${item.image})` }} />
										: <div className="featuredImgPlaceholder">🍽️</div>
									}
									<div className="featuredInfo">
										<p className="featuredName">{item.name}</p>
										{item.description && <p className="featuredDesc">{item.description}</p>}
										<p className="featuredPrice rupee">{item.price}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Location */}
				{profile?.address && (
					<div className="section">
						<h2>Location</h2>
						<div className="card locationCard">
							<p className="address">📍 {profile.address}</p>
							<iframe
								className="mapEmbed"
								src={`https://maps.google.com/maps?q=${encodeURIComponent(profile.address)}&output=embed`}
								loading="lazy"
								title="Location"
							/>
							<a
								className="directionsLink"
								href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								Get Directions →
							</a>
						</div>
					</div>
				)}

			</div>
		</div>
	);
};

export default ExplorePage;
