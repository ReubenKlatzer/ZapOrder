"use client";

import { type ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button, Textfield } from "xtreme-ui";

import { useAdmin } from "#components/context/useContext";

const KitchenEditor = () => {
	const { kitchens, profileMutate } = useAdmin();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [adding, setAdding] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [newPassword, setNewPassword] = useState("");
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const onAdd = async () => {
		if (!username.trim() || !password.trim()) return toast.error("Username and password are required");
		setAdding(true);
		const res = await fetch("/api/admin/kitchen", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); setUsername(""); setPassword(""); await profileMutate(); }
		setAdding(false);
	};

	const onDelete = async (id: string) => {
		setDeletingId(id);
		const res = await fetch("/api/admin/kitchen", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); await profileMutate(); }
		setDeletingId(null);
	};

	const onUpdate = async (id: string) => {
		if (!newPassword.trim()) return toast.error("New password is required");
		setUpdatingId(id);
		const res = await fetch("/api/admin/kitchen", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, password: newPassword }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); setEditingId(null); setNewPassword(""); await profileMutate(); }
		setUpdatingId(null);
	};

	const rowStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		borderRadius: 10,
		background: "var(--colorBackgroundSecondary)",
		marginBottom: 8,
		gap: 8,
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ margin: 0, color: "var(--colorContentPrimary)", fontSize: 18 }}>Kitchen Staff</h3>
			<div style={{ display: "flex", gap: 8 }}>
				<Textfield placeholder="Username" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
				<Textfield type="password" placeholder="Password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} onEnterKey={onAdd} />
				<Button icon="2b" iconType="solid" size="mini" onClick={onAdd} loading={adding} />
			</div>
			<div>
				{kitchens.length === 0 && <p style={{ color: "var(--colorContentSecondary)", margin: 0 }}>No kitchen staff yet.</p>}
				{kitchens.map((k) => (
					<div key={k.id} style={rowStyle}>
						<p style={{ margin: 0, fontWeight: 600, color: "var(--colorContentPrimary)", minWidth: 100 }}>{k.username}</p>
						{editingId === k.id ? (
							<>
								<Textfield type="password" placeholder="New password" value={newPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} onEnterKey={() => onUpdate(k.id)} />
								<Button icon="f00c" iconType="solid" size="mini" loading={updatingId === k.id} onClick={() => onUpdate(k.id)} />
								<Button icon="f00d" iconType="solid" size="mini" type="secondary" onClick={() => { setEditingId(null); setNewPassword(""); }} />
							</>
						) : (
							<div style={{ display: "flex", gap: 8 }}>
								<Button icon="f304" iconType="solid" size="mini" type="secondary" onClick={() => setEditingId(k.id)} />
								<Button icon="f2ed" iconType="solid" size="mini" type="secondary" loading={deletingId === k.id} onClick={() => onDelete(k.id)} />
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default KitchenEditor;
