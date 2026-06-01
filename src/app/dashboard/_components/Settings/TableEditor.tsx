"use client";

import { type ChangeEvent, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Spinner, Textfield } from "xtreme-ui";
import QRCode from "qrcode";

import { useAdmin } from "#components/context/useContext";

const TableEditor = () => {
	const { tables, profileLoading, profileMutate } = useAdmin();
	const [name, setName] = useState("");
	const [adding, setAdding] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [generatingQR, setGeneratingQR] = useState<string | null>(null);

	const getTableURL = (restaurantID: string, tableUsername: string) => {
		const baseURL = typeof window !== "undefined" ? window.location.origin : "";
		return `${baseURL}/${restaurantID}?table=${tableUsername}`;
	};

	const generateAndDownloadQR = async (table: { id: string; name: string; restaurantID: string; username: string }) => {
		setGeneratingQR(table.id);
		try {
			const url = getTableURL(table.restaurantID, table.username);
			const qrDataURL = await QRCode.toDataURL(url, {
				width: 800,
				margin: 2,
				color: {
					dark: "#000000",
					light: "#FFFFFF",
				},
			});

			const link = document.createElement("a");
			link.href = qrDataURL;
			link.download = `${table.name.replace(/\s+/g, "_")}_QR.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success(`QR code for ${table.name} downloaded!`);
		} catch (error) {
			console.error("Error generating QR code:", error);
			toast.error("Failed to generate QR code");
		}
		setGeneratingQR(null);
	};

	const onAdd = async () => {
		if (!name.trim()) return toast.error("Table name is required");
		setAdding(true);
		const res = await fetch("/api/admin/table", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { 
			toast.success(data?.message); 
			setName(""); 
			await profileMutate();
		}
		setAdding(false);
	};

	const onDelete = async (id: string) => {
		setDeletingId(id);
		const res = await fetch("/api/admin/table", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); await profileMutate(); }
		setDeletingId(null);
	};

	if (profileLoading) return <Spinner fullpage label="Loading Tables..." />;

	const rowStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		borderRadius: 10,
		background: "var(--colorBackgroundSecondary)",
		marginBottom: 8,
	};

	return (
		<div style={{ padding: "15px 35px", display: "flex", flexDirection: "column", gap: 20 }}>
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<h1 style={{ margin: 0, fontSize: 24, fontVariationSettings: "'wdth' 75, 'wght' 300", color: "var(--colorContentPrimary)" }}>Tables</h1>
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<Textfield
					placeholder="Table name (e.g. Table 1)"
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
					onEnterKey={onAdd}
				/>
				<Button icon="2b" iconType="solid" size="mini" onClick={onAdd} loading={adding} />
			</div>
			<div>
				{tables.length === 0 && <p style={{ color: "var(--colorContentSecondary)" }}>No tables yet. Add one above.</p>}
				{tables.map((table) => (
					<div key={table.id} style={rowStyle}>
						<div style={{ flex: 1 }}>
							<p style={{ margin: 0, fontWeight: 600, color: "var(--colorContentPrimary)" }}>{table.name}</p>
							<p style={{ margin: 0, fontSize: 12, color: "var(--colorContentSecondary)" }}>
								URL: /{table.restaurantID}?table={table.username}
							</p>
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<Button
								icon="f029"
								iconType="solid"
								size="mini"
								type="primary"
								loading={generatingQR === table.id}
								onClick={() => generateAndDownloadQR(table)}
								label="QR"
							/>
							<Button
								icon="f2ed"
								iconType="solid"
								size="mini"
								type="secondary"
								loading={deletingId === table.id}
								onClick={() => onDelete(table.id)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TableEditor;
