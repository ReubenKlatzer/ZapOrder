"use client";

import { useState, useEffect } from "react";
import { Button } from "xtreme-ui";
import QRCode from "qrcode";
import "./paymentModal.scss";

type PaymentModalProps = {
	isOpen: boolean;
	onClose: () => void;
	orderTotal: number;
	taxTotal: number;
	onPaymentComplete: () => void;
};

const PaymentModal = ({ isOpen, onClose, orderTotal, taxTotal, onPaymentComplete }: PaymentModalProps) => {
	const [paymentMethod, setPaymentMethod] = useState<"qr" | "cash">("qr");
	const [processing, setProcessing] = useState(false);
	const [qrCode, setQrCode] = useState("");
	const [countdown, setCountdown] = useState(0);

	if (!isOpen) return null;

	const grandTotal = orderTotal + taxTotal;

	useEffect(() => {
		if (isOpen && paymentMethod === "qr") {
			// Generate QR code for UPI payment
			const upiString = `upi://pay?pa=restaurant@upi&pn=ZapOrder&am=${grandTotal}&cu=ZAR&tn=Order Payment`;
			QRCode.toDataURL(upiString, { width: 250, margin: 2 })
				.then(setQrCode)
				.catch(console.error);
		}
	}, [isOpen, paymentMethod, grandTotal]);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
		if (countdown === 0 && processing) {
			onPaymentComplete();
			onClose();
			setProcessing(false);
		}
	}, [countdown, processing, onPaymentComplete, onClose]);

	const handlePayment = async () => {
		setProcessing(true);
		setCountdown(3); // 3 second countdown
	};

	return (
		<div className="paymentModalOverlay" onClick={onClose}>
			<div className="paymentModalNew" onClick={(e) => e.stopPropagation()}>
				<button className="closeBtn" onClick={onClose} aria-label="Close">×</button>
				
				<div className="paymentHeader">
					<h2>Complete Payment</h2>
					<div className="totalAmount">
						<span className="currency">R</span>
						<span className="amount">{grandTotal.toFixed(2)}</span>
					</div>
				</div>

				<div className="paymentBody">
					<div className="methodTabs">
						<button
							className={`methodTab ${paymentMethod === "qr" ? "active" : ""}`}
							onClick={() => setPaymentMethod("qr")}>
							<i className="fa fa-qrcode" />
							<span>Scan & Pay</span>
						</button>
						<button
							className={`methodTab ${paymentMethod === "cash" ? "active" : ""}`}
							onClick={() => setPaymentMethod("cash")}>
							<i className="fa fa-money-bill-wave" />
							<span>Pay at Counter</span>
						</button>
					</div>

					{paymentMethod === "qr" && (
						<div className="qrPayment">
							{qrCode && (
								<div className="qrCodeContainer">
									<img src={qrCode} alt="Payment QR Code" className="qrCode" />
									<p className="qrInstruction">Scan with any UPI app</p>
								</div>
							)}
							<div className="paymentApps">
								<span className="appLabel">Supported apps:</span>
								<div className="appIcons">
									<span className="appIcon">📱 Banking App</span>
									<span className="appIcon">💳 Card</span>
									<span className="appIcon">💰 Wallet</span>
								</div>
							</div>
						</div>
					)}

					{paymentMethod === "cash" && (
						<div className="cashPayment">
							<div className="cashIcon">💵</div>
							<h3>Pay at Counter</h3>
							<p>Please proceed to the counter to complete your payment</p>
							<div className="orderNumber">
								<span>Order Total</span>
								<strong>R {grandTotal.toFixed(2)}</strong>
							</div>
						</div>
					)}

					<div className="billBreakdown">
						<div className="breakdownRow">
							<span>Subtotal</span>
							<span>R {orderTotal.toFixed(2)}</span>
						</div>
						<div className="breakdownRow">
							<span>Tax</span>
							<span>R {taxTotal.toFixed(2)}</span>
						</div>
						<div className="breakdownRow total">
							<span>Total</span>
							<span>R {grandTotal.toFixed(2)}</span>
						</div>
					</div>

					<div className="demoNotice">
						🎭 Demo Mode - No real payment will be processed
					</div>
				</div>

				<div className="paymentFooter">
					{processing && countdown > 0 ? (
						<div className="processingState">
							<div className="spinner" />
							<span>Processing payment... {countdown}s</span>
						</div>
					) : (
						<Button
							type="primary"
							size="large"
							label={paymentMethod === "qr" ? "I've Paid" : "Confirm Order"}
							onClick={handlePayment}
							className="confirmPaymentBtn"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
