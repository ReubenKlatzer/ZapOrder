"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Avatar, Button, Spinner, Textfield } from "xtreme-ui";

import { useAdmin } from "#components/context/useContext";
import { splitStringByFirstWord } from "#utils/helper/common";

import AISettings from "./AISettings";
import KitchenEditor from "./KitchenEditor";
import PasswordSettings from "./PasswordSettings";
import "./settingsAccount.scss";
import "./aiSettings.scss";

const SettingsAccount = () => {
	const router = useRouter();
	const { profile, profileMutate } = useAdmin();
	const session = useSession();
	const [restaurantName, setRestaurantName] = useState<string[]>([]);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const [form, setForm] = useState({ name: "", address: "", description: "", avatar: "" });

	useEffect(() => {
		if (profile?.name) setRestaurantName(splitStringByFirstWord(profile.name) ?? []);
		if (profile) setForm({ name: profile.name ?? "", address: profile.address ?? "", description: profile.description ?? "", avatar: profile.avatar ?? "" });
	}, [profile]);

	const onLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
		const reader = new FileReader();
		reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result as string }));
		reader.readAsDataURL(file);
	};

	const onSave = async () => {
		if (!form.name.trim()) return toast.error("Restaurant name is required");
		setSaving(true);
		const res = await fetch("/api/admin/profile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success("Profile updated!"); await profileMutate(); setEditing(false); }
		setSaving(false);
	};

	if (session.status === "loading" || !profile) return <Spinner fullpage label="Loading Account..." />;

	return (
		<div className="settingsAccount">
			<div className="profileSettingsCard">
				<div className="avatarWrapper" onClick={() => editing && fileRef.current?.click()}>
					<Avatar className="avatar" src={form.avatar || profile?.avatar || ""} />
					{editing && <div className="avatarOverlay">📷 Change</div>}
					<input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onLogoChange} />
				</div>

				{!editing ? (
					<div className="restaurantDetails">
						<h1 className="name">
							{restaurantName[0]} <span>{restaurantName[1]}</span>
						</h1>
						<h6 className="address">{profile?.address}</h6>
						{profile?.description && <p className="description">{profile.description}</p>}
					</div>
				) : (
					<div className="editForm">
						<Textfield placeholder="Restaurant name *" value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))} />
						<Textfield placeholder="Address" value={form.address} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, address: e.target.value }))} />
						<Textfield placeholder="Description" value={form.description} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, description: e.target.value }))} />
						<Textfield placeholder="Logo URL (or upload above)" value={form.avatar} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, avatar: e.target.value }))} />
					</div>
				)}

				<div className="profileActions">
					{!editing ? (
						<>
							<Button icon="f304" iconType="solid" size="mini" type="secondary" onClick={() => setEditing(true)} label="Edit" />
							<Button className="logout" icon="f011" size="mini" onClick={() => router.push("/logout")} />
						</>
					) : (
						<>
							<Button label="Cancel" type="secondary" size="mini" onClick={() => { setEditing(false); setForm({ name: profile.name ?? "", address: profile.address ?? "", description: profile.description ?? "", avatar: profile.avatar ?? "" }); }} />
							<Button label="Save" size="mini" onClick={onSave} loading={saving} />
						</>
					)}
				</div>
			</div>
			<AISettings />
			<KitchenEditor />
			<PasswordSettings />
		</div>
	);
};

export default SettingsAccount;
