"use client";

import { Icon } from "xtreme-ui";
import useSWR from "swr";
import { fetcher } from "#utils/helper/common";
import "./orderTracking.scss";

const STEPS = [
	{ key: "placed", label: "Order Placed", icon: "f46d" },
	{ key: "confirmed", label: "Confirmed", icon: "f058" },
	{ key: "preparing", label: "Preparing", icon: "f2e7" },
	{ key: "transit", label: "On the Way", icon: "f554" },
	{ key: "delivered", label: "Delivered", icon: "f560" },
];

const OrderTracking = ({ orderId }: { orderId: string }) => {
	const { data } = useSWR(`/api/order/tracking?orderId=${orderId}`, fetcher, { refreshInterval: 5000 });

	if (!data) return null;

	const currentIndex = STEPS.findIndex((s) => s.key === data.trackingStatus);

	return (
		<div className="orderTracking">
			<p className="trackingTitle">Order Status</p>
			{data.estimatedTime && (
				<p className="trackingEta">
					<Icon code="f017" type="solid" size={12} /> Estimated time: <strong>{data.estimatedTime} min</strong>
				</p>
			)}
			<div className="trackingSteps">
				{STEPS.map((step, i) => (
					<div key={step.key} className={`trackingStep ${i <= currentIndex ? "done" : ""} ${i === currentIndex ? "active" : ""}`}>
						<div className="stepIcon">
							<Icon code={step.icon} type="solid" size={14} />
						</div>
						<p className="stepLabel">{step.label}</p>
						{i < STEPS.length - 1 && <div className={`stepLine ${i < currentIndex ? "done" : ""}`} />}
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderTracking;
