import { usePathname, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { ChangeEvent, RefObject } from "react";
import { useRef } from "react";	
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Textfield } from "xtreme-ui";

import "./userLogin.scss";

const mobileNumberPattern = /^(\+27[-\s]?)?[6-8]\d{8}$/; // SA: +27 6/7/8XXXXXXXX (9 digits after code)
const UserLogin = ({ setOpen }: UserLoginProps) => {
	const pathname = usePathname();
	const params = useSearchParams();
	const [page, setPage] = useState("phone");
	const [buttonLabel, setButtonLabel] = useState("Next");
	const [busy, setBusy] = useState(false);

const [dialCode] = useState("27");
	const phoneRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);	
	const [phone, setPhone] = useState("");

	const [fname, setFName] = useState("");
	const [lname, setLName] = useState("");
	const [heading, setHeading] = useState(["Let's", " start ordering"]);

const phoneNumber = `+${dialCode}${phone}`;
	const onNext = async () => {
		if (page === "phone") {
			if (!mobileNumberPattern.test(phoneNumber)) {
				return toast.error("Please enter a valid phone number");
			}

			setBusy(true);
			setTimeout(() => {
				setBusy(false);
				setPage("signOTP");
			}, 400);
		} else if (page === "signOTP" || page === "loginOTP") {
			if (!params.get("table")) return toast.error("Please scan the QR Code");

			setBusy(true);

			const res = await signIn("customer", {
				redirect: false,
				restaurant: pathname.replaceAll("/", ""),
				phone: phoneNumber,
				fname,
				lname,
				table: params.get("table"),
				callbackUrl: `${window.location.origin}`,
			});

			if (res?.error) {
				toast.error(res?.error);
			} else {
				// Refresh order after successful login
				window.dispatchEvent(new CustomEvent('orderRefresh'));
			}
			setOpen(false);
			setBusy(false);
		}
	};

	useEffect(() => {
		if (page === "phone") {
			setHeading(["Let's", " start ordering"]);
			setButtonLabel("Next");
			phoneRef.current?.focus();
		} else if (page === "signOTP") {
			setHeading(["Glad to", " see you here"]);
			setButtonLabel("Order");
		} else if (page === "loginOTP") {
			setHeading(["Welcome", " back User"]);
			setButtonLabel("Log In");
		}
	}, [page]);	

	useEffect(() => {
		phoneRef.current?.focus();
	}, []);	

	return (
		<div className={`userLogin ${page}`}>
			<div className="header">
				<span className="heading">
					<span>{heading[0]}</span>
					{heading[1]}
				</span>
			</div>
			<div className="content">
				<div className="phoneContainer">
					<span style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap" }}>🇿🇦 +27</span>
					<Textfield
						id="user-login-phone"
						inputRef={phoneRef}
						className="phone"
						type="text"
						placeholder="e.g. 0821234567"
						autoComplete="tel-local"
						value={phone}
						onEnterKey={onNext}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
					/>
				</div>	
				<div className="otpContainer">
					<Textfield
						id="user-login-fname"
						className="fName"
						placeholder="First Name"
						autoComplete="given-name"
						value={fname}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setFName(e.target.value)}
					/>
					<Textfield
						id="user-login-lname"
						className="lName"
						placeholder="Last Name"
						autoComplete="family-name"
						onEnterKey={onNext}
						value={lname}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setLName(e.target.value)}
					/>
					{/* <Textfield
						className='otp'
						placeholder='Enter Your otp'
						autoComplete='one-time-code'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
					/> */}
				</div>
			</div>
			<div className="footer">
				<Button label={buttonLabel} onClick={onNext} loading={busy} />
			</div>
		</div>
	);
};

export default UserLogin;

type UserLoginProps = {
	setOpen: (open: boolean) => void;
};
