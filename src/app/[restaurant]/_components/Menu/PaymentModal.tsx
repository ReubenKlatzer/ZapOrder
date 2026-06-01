"use client";

import { useState } from "react";
import { Button } from "xtreme-ui";
import "./paymentModal.scss";

type PaymentModalProps = {
	isOpen: boolean;
	onClose: () => void;
	orderTotal: number;
	taxTotal: number;
	onPaymentComplete: () => void;
};

const PaymentModal = ({ isOpen, onClose, orderTotal, taxTotal, onPaymentComplete }: PaymentModalProps) => {
	const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">("card");
	const [processing, setProcessing] = useState(false);

	if (!isOpen) return null;

	const grandTotal = orderTotal + taxTotal;

	const handlePayment = async () => {
		setProcessing(true);
		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setProcessing(false);
		onPaymentComplete();
		onClose();
	};

	return (
		<div className="paymentModalOverlay" onClick={onClose}>
			<div className="paymentModal" onClick={(e) => e.stopPropagation()}>
				<div className="modalHeader">
					<h3>Complete Payment</h3>
					<button className="closeBtn" onClick={onClose}>×</button>
				</div>

				<div className="modalBody">
					<div className="billSummary">
						<div className="summaryRow">
							<span>Subtotal</span>
							<span className="rupee">R {orderTotal}</span>
						</div>
						<div className="summaryRow">
							<span>Tax</span>
							<span className="rupee">R {taxTotal}</span>
						</div>
						<hr />
						<div className="summaryRow total">
							<span>Total Amount</span>
							<span className="rupee">R {grandTotal}</span>
						</div>
					</div>

					<div className="paymentMethods">
						<h4>Select Payment Method</h4>
						<div className="methodOptions">
							<button
								className={`methodBtn ${paymentMethod === "card" ? "active" : ""}`}
								onClick={() => setPaymentMethod("card")}>
								<i className="fa fa-credit-card" />
								<span>Card</span>
							</button>
							<button
								className={`methodBtn ${paymentMethod === "upi" ? "active" : ""}`}
								onClick={() => setPaymentMethod("upi")}>
								<i className="fa fa-mobile" />
								<span>UPI</span>
							</button>
							<button
								className={`methodBtn ${paymentMethod === "cash" ? "active" : ""}`}
								onClick={() => setPaymentMethod("cash")}>
								<i className="fa fa-money-bill" />
								<span>Cash</span>
							</button>
						</div>
					</div>

					{paymentMethod === "card" && (
						<div className="paymentForm">
							<input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" />
							<div className="formRow">
								<input type="text" placeholder="MM/YY" defaultValue="12/25" />
								<input type="text" placeholder="CVV" defaultValue="123" />
							</div>
						</div>
					)}

					{paymentMethod === "upi" && (
						<div className="paymentForm">
							<input type="text" placeholder="UPI ID" defaultValue="demo@upi" />
						</div>
					)}

					{paymentMethod === "cash" && (
						<div className="cashNote">
							<p>💵 Please pay at the counter</p>
						</div>
					)}

					<div className="demoNotice">
						🎭 Demo Mode - No real payment will be processed
					</div>
				</div>

				<div className="modalFooter">
					<Button type="secondary" size="mini" label="Cancel" onClick={onClose} />
					<Button
						type="primary"
						size="mini"
						label={processing ? "Processing..." : `Pay R ${grandTotal}`}
						loading={processing}
						onClick={handlePayment}
					/>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
