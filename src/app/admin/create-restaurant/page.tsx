"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Textfield } from "xtreme-ui";

import "./create-restaurant.scss";

type TAccount = {
	id: string;
	username: string;
	email: string;
	createdAt: string;
	profile?: { name: string };
};

export default function CreateRestaurantPage() {
	const [adminPassword, setAdminPassword] = useState("");
	const [unlocked, setUnlocked] = useState(false);
	const [unlocking, setUnlocking] = useState(false);
	const [tab, setTab] = useState<"create" | "delete">("create");

	// Create fields
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// Delete
	const [accounts, setAccounts] = useState<TAccount[]>([]);
	const [loadingAccounts, setLoadingAccounts] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

	const unlock = () => {
		setUnlocking(true);
		setTimeout(() => {
			if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
				setUnlocked(true);
			} else {
				toast.error("Incorrect password");
			}
			setUnlocking(false);
		}, 500);
	};

	const fetchAccounts = async () => {
		setLoadingAccounts(true);
		const res = await fetch(`/api/admin/deleteAccount?secret=${process.env.NEXT_PUBLIC_REGISTER_SECRET}`);
		const data = await res.json();
		if (res.ok) setAccounts(data);
		else toast.error(data?.message);
		setLoadingAccounts(false);
	};

	useEffect(() => {
		if (unlocked && tab === "delete") fetchAccounts();
	}, [unlocked, tab]);

	const onCreate = async () => {
		if (!name || !username || !email || !password) return toast.error("All fields are required");
		setSubmitting(true);
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, username, email, password, secret: process.env.NEXT_PUBLIC_REGISTER_SECRET }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else {
			toast.success(`Restaurant "${name}" created!`);
			setName(""); setUsername(""); setEmail(""); setPassword("");
		}
		setSubmitting(false);
	};

	const onDelete = async (username: string) => {
		setDeletingId(username);
		const res = await fetch("/api/admin/deleteAccount", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, secret: process.env.NEXT_PUBLIC_REGISTER_SECRET }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else {
			toast.success(data.message);
			setAccounts((prev) => prev.filter((a) => a.username !== username));
		}
		setDeletingId(null);
		setConfirmDelete(null);
	};

	return (
		<div className="createRestaurantPage">
			<div className="createCard">
				{!unlocked ? (
					<>
						<h2>Admin Access</h2>
						<p>Enter your admin password to continue</p>
						<Textfield
							type="password"
							icon="f023"
							placeholder="Admin password"
							value={adminPassword}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminPassword(e.target.value)}
							onEnterKey={unlock}
						/>
						<Button label="Unlock" onClick={unlock} loading={unlocking} />
					</>
				) : (
					<>
						<div className="adminTabs">
							<button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>Create</button>
							<button className={tab === "delete" ? "active" : ""} onClick={() => setTab("delete")}>Manage</button>
						</div>

						{tab === "create" && (
							<>
								<h2>Create Restaurant</h2>
								<p>Fill in the details for the new restaurant account</p>
								<Textfield icon="f015" placeholder="Restaurant name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
								<Textfield icon="f007" placeholder="Username (e.g. starbucks)" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value.toLowerCase())} />
								<Textfield icon="f0e0" placeholder="Owner email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
								<Textfield type="password" icon="f023" placeholder="Account password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} onEnterKey={onCreate} />
								<Button label="Create Restaurant" onClick={onCreate} loading={submitting} />
							</>
						)}

						{tab === "delete" && (
							<>
								<h2>Manage Accounts</h2>
								<p>{accounts.length} restaurant{accounts.length !== 1 ? "s" : ""} registered</p>
								{loadingAccounts ? (
									<p className="loadingText">Loading accounts...</p>
								) : (
									<div className="accountsList">
										{accounts.map((acc) => (
											<div key={acc.id} className={`accountRow ${confirmDelete === acc.username ? "confirming" : ""}`}>
												<div className="accountInfo">
													<p className="accountName">{acc.profile?.name ?? acc.username}</p>
													<p className="accountEmail">{acc.email}</p>
												</div>
												{confirmDelete === acc.username ? (
													<div className="confirmBtns">
														<Button size="mini" type="primaryDanger" label="Yes, delete" loading={deletingId === acc.username} onClick={() => onDelete(acc.username)} />
														<Button size="mini" type="secondary" label="Cancel" onClick={() => setConfirmDelete(null)} />
													</div>
												) : (
													<Button size="mini" type="primaryDanger" icon="f2ed" iconType="solid" onClick={() => setConfirmDelete(acc.username)} />
												)}
											</div>
										))}
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
