import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "#utils/helper/authHelper";
import { CatchNextResponse } from "#utils/helper/common";
import prisma from "#utils/database/connect";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: "Authentication Required" };

		const { searchParams } = new URL(req.url);
		const format = searchParams.get("format") || "csv";
		const orderId = searchParams.get("orderId");

		if (!orderId) throw { status: 400, message: "Order ID is required" };

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				customer: true,
				products: {
					include: {
						menu: true,
					},
				},
			},
		});

		if (!order) throw { status: 404, message: "Order not found" };

		if (format === "csv" || format === "excel") {
			const csvData = generateCSV(order);
			return new NextResponse(csvData, {
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="order-${order.id}.csv"`,
				},
			});
		}

		if (format === "txt") {
			const txtData = generateTXT(order);
			return new NextResponse(txtData, {
				headers: {
					"Content-Type": "text/plain",
					"Content-Disposition": `attachment; filename="order-${order.id}.txt"`,
				},
			});
		}

		if (format === "json") {
			return new NextResponse(JSON.stringify(order, null, 2), {
				headers: {
					"Content-Type": "application/json",
					"Content-Disposition": `attachment; filename="order-${order.id}.json"`,
				},
			});
		}

		throw { status: 400, message: "Invalid format. Use csv, excel, txt, or json" };
	} catch (err) {
		return CatchNextResponse(err as { message?: string; status?: number });
	}
}

function generateCSV(order: any): string {
	let csv = "Order ID,Customer Name,Phone,Table,Status,Order Total,Tax Total,Created At\n";
	csv += `${order.id},${order.customer.fname} ${order.customer.lname},${order.customer.phone},${order.table},${order.state},${order.orderTotal},${order.taxTotal},${order.createdAt}\n\n`;
	
	csv += "Item,Quantity,Price,Tax,Total\n";
	order.products.forEach((item: any) => {
		csv += `${item.menu.name},${item.quantity},${item.price},${item.tax},${item.price * item.quantity}\n`;
	});
	
	return csv;
}

function generateTXT(order: any): string {
	let txt = `ORDER DETAILS\n`;
	txt += `=============\n\n`;
	txt += `Order ID: ${order.id}\n`;
	txt += `Customer: ${order.customer.fname} ${order.customer.lname}\n`;
	txt += `Phone: ${order.customer.phone}\n`;
	txt += `Table: ${order.table}\n`;
	txt += `Status: ${order.state}\n`;
	txt += `Created: ${new Date(order.createdAt).toLocaleString()}\n\n`;
	
	txt += `ITEMS\n`;
	txt += `=====\n\n`;
	order.products.forEach((item: any, index: number) => {
		txt += `${index + 1}. ${item.menu.name}\n`;
		txt += `   Quantity: ${item.quantity}\n`;
		txt += `   Price: R ${item.price.toFixed(2)}\n`;
		txt += `   Total: R ${(item.price * item.quantity).toFixed(2)}\n\n`;
	});
	
	txt += `SUMMARY\n`;
	txt += `=======\n`;
	txt += `Subtotal: R ${order.orderTotal.toFixed(2)}\n`;
	txt += `Tax: R ${order.taxTotal.toFixed(2)}\n`;
	txt += `Grand Total: R ${(order.orderTotal + order.taxTotal).toFixed(2)}\n`;
	
	return txt;
}

export const dynamic = "force-dynamic";
