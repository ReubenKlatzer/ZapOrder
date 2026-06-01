"use client";

import useSWR from "swr";
import { fetcher } from "#utils/helper/common";
import "./customerOrderHistory.scss";

const CustomerOrderHistory = () => {
	const { data: orders = [], isLoading } = useSWR("/api/customer/orders", fetcher);

	if (isLoading) return <p className="historyLoading">Loading history...</p>;
	if (!orders.length) return <p className="historyEmpty">No past orders found.</p>;

	return (
		<div className="customerOrderHistory">
			<p className="historyTitle">Your Order History</p>
			{orders.map((order: any) => (
				<div key={order.id} className="historyCard">
					<div className="historyCardHeader">
						<span className="historyDate">{new Date(order.createdAt).toLocaleDateString()}</span>
						<span className={`historyStatus ${order.state}`}>{order.state}</span>
					</div>
					<div className="historyItems">
						{order.products.map((p: any, i: number) => (
							<div key={i} className="historyItem">
								<span>{p.menu?.name}</span>
								<span>×{p.quantity}</span>
								<span>R {(p.price * p.quantity).toFixed(2)}</span>
							</div>
						))}
					</div>
					<div className="historyTotal">
						<span>Total</span>
						<span>R {((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default CustomerOrderHistory;
