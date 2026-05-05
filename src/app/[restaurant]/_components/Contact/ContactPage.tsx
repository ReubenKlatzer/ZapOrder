"use client";

import { usePathname } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Button, Icon, Textfield } from "xtreme-ui";

import { fetcher } from "#utils/helper/common";

import "./contact.scss";

type TProfile = {
	name: string;
	address?: string;
	description?: string;
};

const ContactPage = () => {
	const pathname = usePathname();
	const restaurantID = pathname.replace("/", "");
	const { data: profile } = useSWR<TProfile>(`/api/baseProfile?id=${restaurantID}`, fetcher);

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async () => {
		if (!name.trim()) return toast.error("Please enter your name");
		if (!phone.trim()) return toast.error("Please enter your phone number");
		if (!message.trim()) return toast.error("Please enter a message");
		setSubmitting(true);
		await new Promise((r) => setTimeout(r, 800));
		toast.success("Message sent! We'll get back to you soon.");
		setName("");
		setPhone("");
		setMessage("");
		setSubmitting(false);
	};

	return (
		<div className="contactPage">
			<div className="contactHeader">
				<h1 className="contactTitle">Contact Us</h1>
				{profile?.description && <p className="contactDesc">{profile.description}</p>}
			</div>

			{profile?.address && (
				<div className="contactInfoCard">
					<div className="contactInfoRow">
						<Icon code="f3c5" type="solid" size={16} />
						<span>{profile.address}</span>
					</div>
				</div>
			)}

			<div className="contactForm">
				<h3>Send us a message</h3>
				<Textfield
					placeholder="Your name"
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
				/>
				<Textfield
					placeholder="Your phone number"
					value={phone}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
				/>
				<Textfield
					placeholder="Your message"
					value={message}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
					onEnterKey={onSubmit}
				/>
				<Button label="Send Message" onClick={onSubmit} loading={submitting} />
			</div>
		</div>
	);
};

export default ContactPage;
