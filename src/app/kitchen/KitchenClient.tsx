"use client";

import { useEffect, useState } from "react";

import "./kitchen.scss";

type OrderProduct = {
	id: string;
	quantity: number;
	price: number;
	adminApproved: boolean;
	fulfilled: boolean;
	menu: { name: string; category: string | null; image: string | null };
};

type Order = {
	id: string;
	table: string;
	state: string;
	orderTotal: number;
	createdAt: string;
	customer: { fname: string; lname: string; phone: string };
	products: OrderProduct[];
};

const KitchenClient = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [fulfilling, setFulfilling] = useState<string | null>(null);

	const fetchOrders = async () => {
		const res = await fetch("/api/admin/order");
		if (res.ok) {
			const data: Order[] = await res.json();
			setOrders(data.filter((o) => o.state === "active" && o.products.some((p) => p.adminApproved)));
		}
		setLoading(false);
	};

	const fulfillItem = async (orderId: string, productId: string) => {
		setFulfilling(productId);
		await fetch("/api/kitchen/fulfill", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ orderId, productId }),
		});
		await fetchOrders();
		setFulfilling(null);
	};

	useEffect(() => {
		fetchOrders();
		const interval = setInterval(fetchOrders, 5000);
		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return (
			<div className="kitchen">
				<div className="kitchenLoading">
					<div className="pulse" />
					<p>Loading orders...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="kitchen">
			<div className="kitchenHeader">
				<div className="kitchenHeaderLeft">
					<span className="kitchenLive" />
					<h1>Kitchen Dashboard</h1>
				</div>
				<p className="kitchenCount">{orders.length} active {orders.length === 1 ? "order" : "orders"}</p>
			</div>

			{orders.length === 0 ? (
				<div className="kitchenEmpty">
					<div className="kitchenEmptyIcon">🍽️</div>
					<h2>All caught up!</h2>
					<p>No active orders right now. New orders will appear here automatically.</p>
				</div>
			) : (
				<div className="kitchenGrid">
					{orders.map((order) => {
						const approved = order.products.filter((p) => p.adminApproved);
						const allDone = approved.every((p) => p.fulfilled);
						return (
							<div key={order.id} className={`kitchenCard ${allDone ? "done" : ""}`}>
								<div className="kitchenCardHeader">
									<div className="kitchenCardTable">
										<span className="tableIcon">🪑</span>
										<span>Table {order.table}</span>
									</div>
									<div className="kitchenCardMeta">
										<span className="customerName">{order.customer.fname} {order.customer.lname}</span>
										<span className={`kitchenCardStatus ${allDone ? "ready" : "cooking"}`}>
											{allDone ? "✅ Ready" : "🔥 Cooking"}
										</span>
									</div>
								</div>

								<div className="kitchenCardItems">
									{approved.map((product) => (
										<div key={product.id} className={`kitchenItem ${product.fulfilled ? "fulfilled" : ""}`}>
											<div className="kitchenItemInfo">
												<span className="kitchenItemQty">×{product.quantity}</span>
												<div className="kitchenItemDetails">
													<span className="kitchenItemName">{product.menu.name}</span>
													{product.menu.category && <span className="kitchenItemCat">{product.menu.category}</span>}
												</div>
											</div>
											<button
												type="button"
												className={`kitchenItemBtn ${product.fulfilled ? "done" : ""}`}
												disabled={product.fulfilled || fulfilling === product.id}
												onClick={() => fulfillItem(order.id, product.id)}
											>
												{fulfilling === product.id ? "..." : product.fulfilled ? "Done ✓" : "Mark Done"}
											</button>
										</div>
									))}
								</div>

								<div className="kitchenCardFooter">
									<span className="kitchenCardTime">
										{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
									</span>
									<span className="kitchenCardTotal">R{order.orderTotal.toFixed(2)}</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default KitchenClient;
