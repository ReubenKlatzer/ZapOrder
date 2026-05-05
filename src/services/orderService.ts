import prisma from "#utils/database/connect";

export async function getActiveOrder(restaurantID: string, customerId: string) {
	return prisma.order.findFirst({
		where: { restaurantID, customerId, state: "active" },
		include: { customer: true, products: { include: { menu: true } } },
	});
}

export async function getAllOrders(restaurantID: string) {
	return prisma.order.findMany({
		where: { restaurantID },
		include: { customer: true, products: { include: { menu: true } } },
	});
}

export async function placeOrder(restaurantID: string, table: string, customerId: string, rawProducts: { id: string; quantity: number }[]) {
	if (!rawProducts?.length) throw { status: 400, message: "Can't place order on empty cart" };

	const products = await Promise.all(
		rawProducts.map(async (p) => {
			const menuItem = await prisma.menu.findUnique({ where: { id: p.id } });
			if (!menuItem) throw { status: 404, message: "Ordered product(s) not found." };
			return {
				menuId: p.id,
				quantity: p.quantity,
				price: menuItem.price,
				tax: Number(((menuItem.price * menuItem.taxPercent) / 100).toFixed(2)),
			};
		}),
	);

	const existing = await prisma.order.findFirst({ where: { restaurantID, customerId, state: "active" } });

	if (existing) {
		await prisma.orderProduct.createMany({ data: products.map((p) => ({ ...p, orderId: existing.id })) });
		await recalcOrderTotals(existing.id);
		return "Additional items ordered successfully";
	}

	const order = await prisma.order.create({ data: { restaurantID, table, customerId, products: { create: products } } });
	await recalcOrderTotals(order.id);
	return "Order placed successfully";
}

export async function cancelOrder(restaurantID: string, customerId: string) {
	const order = await prisma.order.findFirst({ where: { restaurantID, customerId, state: "active" } });
	if (!order) throw { status: 400, message: "No active orders found" };
	await prisma.order.update({ where: { id: order.id }, data: { state: "cancel" } });
}

const VALID_ACTIONS = ["accept", "reject", "rejectOnActive", "complete"] as const;

export async function performOrderAction(orderID: string, action: string) {
	if (!orderID) throw { status: 400, message: "Order id is required to perform an action" };
	if (!VALID_ACTIONS.includes(action as (typeof VALID_ACTIONS)[number])) throw { status: 400, message: "Invalid action provided" };

	const order = await prisma.order.findUnique({ where: { id: orderID }, include: { products: true } });
	if (!order) throw { status: 400, message: `Order with id: ${orderID} not found` };

	if (action === "accept") {
		await prisma.orderProduct.updateMany({ where: { orderId: orderID }, data: { adminApproved: true } });
	} else if (action === "reject") {
		const hasApproved = order.products.some((p) => p.adminApproved);
		if (!hasApproved) {
			await prisma.order.update({ where: { id: orderID }, data: { state: "reject" } });
		} else {
			await prisma.orderProduct.deleteMany({ where: { orderId: orderID, adminApproved: false } });
		}
	} else if (action === "rejectOnActive") {
		await prisma.order.update({ where: { id: orderID }, data: { state: "reject" } });
	} else if (action === "complete") {
		await prisma.order.update({ where: { id: orderID }, data: { state: "complete" } });
	}

	await recalcOrderTotals(orderID);
}

async function recalcOrderTotals(orderId: string) {
	const products = await prisma.orderProduct.findMany({ where: { orderId } });
	const orderTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
	const taxTotal = products.reduce((sum, p) => sum + p.tax, 0);
	await prisma.order.update({ where: { id: orderId }, data: { orderTotal, taxTotal } });
}
