"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Textfield } from "xtreme-ui";

const AISettings = () => {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [aiName, setAiName] = useState("");

	useEffect(() => {
		fetch("/api/admin/ai")
			.then((r) => r.json())
			.then((data) => {
				setAiName(data?.aiName || "");
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const onSave = async () => {
		setSaving(true);
		const res = await fetch("/api/admin/ai", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ aiName }),
		});
		if (!res.ok) toast.error("Failed to update AI name");
		else toast.success("AI assistant name updated!");
		setSaving(false);
	};

	if (loading) return null;

	return (
		<div className="aiSettingsCard">
			<h3>AI Assistant Name</h3>
			<p className="hint">Customize your restaurant's AI assistant name (e.g., Nova, Alex, Sam).</p>

			<Textfield
				placeholder="AI Name (default: ZapOder)"
				value={aiName}
				onChange={(e: any) => setAiName(e.target.value)}
			/>

			<Button label="Save" onClick={onSave} loading={saving} size="mini" />
		</div>
	);
};

export default AISettings;
