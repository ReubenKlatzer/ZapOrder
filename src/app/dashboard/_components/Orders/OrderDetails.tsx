"use client";

import { usePDF } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Button } from "xtreme-ui";

import { InvoiceDocument, type TInvoiceProps } from "#components/layout/Invoice";

import "./orderDetails.scss";

const OrderDetails = ({ order, profile }: TInvoiceProps) => {
	const [isClient, setIsClient] = useState(false);
	const [instance, updateInstance] = usePDF({ document: <InvoiceDocument order={order} profile={profile} /> });

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		updateInstance(<InvoiceDocument order={order} profile={profile} />);
	}, [order, profile, updateInstance]);

	const handleDownload = () => {
		if (instance.url) {
			const link = document.createElement("a");
			link.href = instance.url;
			link.download = `Invoice-${order.id?.slice(-6).toUpperCase()}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const handlePrint = () => {
		if (instance.url) {
			const iframe = document.createElement("iframe");
			iframe.style.display = "none";
			iframe.src = instance.url;
			document.body.appendChild(iframe);
			iframe.contentWindow?.focus();
			iframe.contentWindow?.print();
		}
	};

	const handleDownloadCSV = () => {
		const rows = [
			["Order ID", "Customer", "Phone", "Table", "Date", "Subtotal", "Tax", "Grand Total"],
			[order.id, `${order.customer?.fname} ${order.customer?.lname}`, order.customer?.phone, order.table, new Date(order.createdAt || Date.now()).toLocaleDateString(), order.orderTotal?.toFixed(2), order.taxTotal?.toFixed(2), ((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)],
			[],
			["Item", "Qty", "Price", "Total"],
			...(order.products?.map((p) => [p.menu?.name, p.quantity, p.price?.toFixed(2), (p.price * p.quantity).toFixed(2)]) || []),
		];
		const csv = rows.map((r) => r.join(",")).join("\n");
		downloadFile(csv, `Invoice-${order.id?.slice(-6).toUpperCase()}.csv`, "text/csv");
	};

	const handleDownloadTXT = () => {
		let txt = `ORDER DETAILS\n=============\n\n`;
		txt += `Order ID: ${order.id}\nCustomer: ${order.customer?.fname} ${order.customer?.lname}\nPhone: ${order.customer?.phone}\nTable: ${order.table}\nDate: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}\n\n`;
		txt += `ITEMS\n-----\n`;
		order.products?.forEach((p, i) => { txt += `${i + 1}. ${p.menu?.name} x${p.quantity} - R ${(p.price * p.quantity).toFixed(2)}\n`; });
		txt += `\nSubtotal: R ${order.orderTotal?.toFixed(2)}\nTax: R ${order.taxTotal?.toFixed(2)}\nGrand Total: R ${((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)}`;
		downloadFile(txt, `Invoice-${order.id?.slice(-6).toUpperCase()}.txt`, "text/plain");
	};

	const handleDownloadWord = () => {
		const rows = order.products?.map((p) => `<tr><td>${p.menu?.name}</td><td>x${p.quantity}</td><td>R ${p.price?.toFixed(2)}</td><td>R ${(p.price * p.quantity).toFixed(2)}</td></tr>`).join("") || "";
		const html = `<html><body><h2>Order Invoice</h2><p><b>Order ID:</b> ${order.id}</p><p><b>Customer:</b> ${order.customer?.fname} ${order.customer?.lname}</p><p><b>Phone:</b> ${order.customer?.phone}</p><p><b>Table:</b> ${order.table}</p><p><b>Date:</b> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p><table border="1"><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>${rows}</table><p><b>Subtotal:</b> R ${order.orderTotal?.toFixed(2)}</p><p><b>Tax:</b> R ${order.taxTotal?.toFixed(2)}</p><p><b>Grand Total:</b> R ${((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)}</p></body></html>`;
		downloadFile(html, `Invoice-${order.id?.slice(-6).toUpperCase()}.doc`, "application/msword");
	};

	const downloadFile = (content: string, filename: string, type: string) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	if (!isClient) return null;

	return (
		<div className="orderDetailsPreview">
			<div className="header">
				<div className="title">
					<h2>Order Details</h2>
					<div className="orderId">
						Invoice <span>#{order.id?.slice(-6).toUpperCase()}</span>
					</div>
				</div>
				<div className="actions">
					<Button icon="f019" type="primary" className="actionBtn" onClick={handleDownload} disabled={instance.loading || !instance.url} label="PDF" />
					<Button icon="f1c3" type="secondary" className="actionBtn" onClick={handleDownloadCSV} label="Excel" />
					<Button icon="f1c2" type="secondary" className="actionBtn" onClick={handleDownloadWord} label="Word" />
					<Button icon="f15c" type="secondary" className="actionBtn" onClick={handleDownloadTXT} label="TXT" />
					<Button icon="f02f" type="secondary" className="actionBtn" onClick={handlePrint} disabled={instance.loading || !instance.url} />
				</div>
			</div>

			<div className="contentScroll">
				<div className="section customerInfo">
					<div className="infoBlock">
						<span className="label">Date</span>
						<span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
					</div>
					<div className="infoBlock">
						<span className="label">Table</span>
						<span>{order.table}</span>
					</div>
					{order.customer && (
						<>
							<div className="infoBlock">
								<span className="label">Customer</span>
								<span>
									{order.customer.fname} {order.customer.lname}
								</span>
							</div>
							<div className="infoBlock">
								<span className="label">Contact</span>
								<span>{order.customer.phone}</span>
							</div>
						</>
					)}
				</div>

				<div className="section itemsList">
					<h3>Items</h3>
					<div className="table">
						<div className="row headerRow">
							<span className="col name">Item</span>
							<span className="col qty">Qty</span>
							<span className="col price">Price</span>
							<span className="col total">Total</span>
						</div>
						{order.products?.map((item, index) => (
							<div key={index} className="row">
								<span className="col name">{item.menu?.name}</span>
								<span className="col qty">x{item.quantity}</span>
								<span className="col price">R {item.price?.toFixed(2)}</span>
								<span className="col total">R {(item.price * item.quantity).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>

				<div className="section summary">
					<div className="summaryRow">
						<span>Subtotal</span>
						<span>R {order.orderTotal?.toFixed(2)}</span>
					</div>
					<div className="summaryRow">
						<span>Tax</span>
						<span>R {order.taxTotal?.toFixed(2)}</span>
					</div>
					<div className="summaryRow grandTotal">
						<span>Grand Total</span>
						<span>R {((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
