"use client";

import { type ChangeEvent, type UIEvent, useRef, useState, useCallback } from "react";

import { toast } from "react-toastify";
import { Button, Icon, Spinner, Textfield } from "xtreme-ui";

import { useAdmin } from "#components/context/useContext";
import Modal from "#components/layout/Modal";
import type { TMenu } from "#utils/database/models/menu";

import MenuEditorItem from "./MenuEditorItem";
import "./menuEditor.scss";

const emptyForm = { name: "", description: "", category: "", price: "", taxPercent: "0", veg: "veg", foodType: "", image: "", _id: "" };


const MenuEditor = () => {
	const { profile, menus, profileLoading, profileMutate } = useAdmin();
	const [modalOpen, setModalOpen] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [saving, setSaving] = useState(false);
	const [aiGenerating, setAiGenerating] = useState(false);
	const [hideSettingsLoading, setHideSettingsLoading] = useState<string[]>([]);
	const [deleteItemLoading, setDeleteItemLoading] = useState<string[]>([]);
	const [category, setCategory] = useState(0);
	const [newCategory, setNewCategory] = useState("");
	const [categoryLoading, setCategoryLoading] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const categories = useRef<HTMLDivElement>(null);
	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	const set = (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
		setForm((f) => ({ ...f, [key]: e.target.value }));

	const onCategoryScroll = (event: UIEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement;
		setLeftCategoryScroll(target.scrollLeft > 50);
		setRightCategoryScroll(Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth);
	};
	const categoryScrollLeft = () => { if (categories?.current) categories.current.scrollLeft -= 400; };
	const categoryScrollRight = () => { if (categories?.current) categories.current.scrollLeft += 400; };

	const onAddCategory = async () => {
		if (!newCategory.trim()) return;
		setCategoryLoading(true);
		const res = await fetch("/api/admin/category", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ category: newCategory }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { setNewCategory(""); await profileMutate(); }
		setCategoryLoading(false);
	};

	const onDeleteCategory = async (cat: string) => {
		setCategoryLoading(true);
		const res = await fetch("/api/admin/category", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ category: cat, action: "remove" }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { await profileMutate(); setCategory(0); }
		setCategoryLoading(false);
	};

	const onHide = async (itemId: string, hidden: boolean) => {
		setHideSettingsLoading((v) => [...v, itemId]);
		const req = await fetch("/api/admin/menu/hidden", { method: "POST", body: JSON.stringify({ itemId, hidden }) });
		const res = await req.json();
		if (res?.status !== 200) toast.error(res?.message);
		await profileMutate();
		setHideSettingsLoading((v) => v.filter((item) => item !== itemId));
	};

	const onDeleteItem = async (id: string) => {
		setDeleteItemLoading((v) => [...v, id]);
		const res = await fetch("/api/admin/menu/item", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); await profileMutate(); }
		setDeleteItemLoading((v) => v.filter((i) => i !== id));
	};

	const onEdit = (item: TMenu) => {
		setForm({
			name: item.name,
			description: item.description ?? "",
			category: item.category,
			price: String(item.price),
			taxPercent: String(item.taxPercent ?? 0),
			veg: item.veg,
			foodType: item.foodType ?? "",
			image: item.image ?? "",
			_id: item.id,
		});
		setModalOpen(true);
	};

	const onSave = async () => {
		if (!form.name || !form.price || !form.category) return toast.error("Name, price and category are required");
		setSaving(true);
		const res = await fetch("/api/admin/menu/item", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...form, price: Number(form.price), taxPercent: Number(form.taxPercent) }),
		});
		const data = await res.json();
		if (!res.ok) toast.error(data?.message);
		else { toast.success(data?.message); setModalOpen(false); setForm(emptyForm); await profileMutate(); }
		setSaving(false);
	};

	const onAiFill = async () => {
		if (!form.name) return toast.error("Enter an item name first");
		setAiGenerating(true);
		try {
			const res = await fetch("/api/admin/menu/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: form.name, category: form.category }),
			});
			const data = await res.json();
			console.log("AI Fill response:", data);
			if (!res.ok) toast.error(data?.message);
			else {
				setForm((f) => ({ ...f, description: data.description, image: data.image || "" }));
				if (data.image) toast.success("Description and image generated!");
				else toast.success("Description generated! (No image found)");
			}
		} catch (error) {
			console.error("AI generation error:", error);
			toast.error("AI generation failed");
		}
		setAiGenerating(false);
	};

	const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
		reader.readAsDataURL(file);
		e.target.value = "";
	}, []);

	const closeModal = (v: boolean) => { setModalOpen(v); if (!v) setForm(emptyForm); };

	if (profileLoading) return <Spinner fullpage label="Loading Menu..." />;

	const selectStyle = {
		padding: "12px",
		borderRadius: 10,
		border: "1px solid var(--colorBorderPrimary)",
		background: "var(--colorBackgroundSecondary)",
		color: "var(--colorContentPrimary)",
		width: "100%",
	};

	return (
		<div className="menuEditor">
			<Modal open={modalOpen} setOpen={closeModal}>
				<div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
					<h3 style={{ margin: 0 }}>{form._id ? "Edit Item" : "Add Menu Item"}</h3>
					<Textfield placeholder="Item name *" value={form.name} onChange={set("name")} />
					<Button label={aiGenerating ? "Generating..." : "AI Fill"} onClick={onAiFill} loading={aiGenerating} type="secondary" />
					<Textfield placeholder="Description" value={form.description} onChange={set("description")} />
					<select value={form.category} onChange={set("category")} style={selectStyle}>
						<option value="">Select category *</option>
						{profile?.categories?.map((c) => <option key={c} value={c}>{c}</option>)}
					</select>
					<Textfield placeholder="Price *" type="number" value={form.price} onChange={set("price")} />
					<Textfield placeholder="Tax (%)" value={form.taxPercent} type="number" onChange={set("taxPercent")} />
					<select value={form.veg} onChange={set("veg")} style={selectStyle}>
						<option value="veg">Veg</option>
						<option value="non-veg">Non-Veg</option>
						<option value="contains-egg">Contains Egg</option>
					</select>
					<select value={form.foodType} onChange={set("foodType")} style={selectStyle}>
						<option value="">Food type (optional)</option>
						<option value="spicy">Spicy</option>
						<option value="extra-spicy">Extra Spicy</option>
						<option value="sweet">Sweet</option>
					</select>
					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<Textfield placeholder="Image URL (optional)" value={form.image} onChange={set("image")} />
						<input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
						<Button icon="f03e" iconType="solid" size="mini" type="secondary" label="Upload" onClick={() => fileInputRef.current?.click()} />
					</div>
					{form.image?.startsWith("data:") && (
						<img src={form.image} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }} />
					)}
					<Button label={form._id ? "Update" : "Add Item"} onClick={onSave} loading={saving} />
				</div>
			</Modal>
			<div className="menuCategoryEditor">
				<div className="menuCategoryHeader">
					<h1 className="menuCategoryHeading">Menu Categories</h1>
					<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<Textfield
							placeholder="New category"
							value={newCategory}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
							onEnterKey={onAddCategory}
						/>
						<Button icon="2b" iconType="solid" size="mini" onClick={onAddCategory} loading={categoryLoading} />
					</div>
				</div>
				<div className="menuCategoryContainer" ref={categories} onScroll={onCategoryScroll}>
					{profile?.categories?.map((item, i) => (
						<div key={i} className={`menuCategory ${category === i ? "active" : ""}`} onClick={() => setCategory(i)}>
							<span className="title">{item}</span>
							<button className="deleteCategoryBtn" onClick={(e) => { e.stopPropagation(); onDeleteCategory(item); }} title="Delete category">
								<Icon code="f00d" type="solid" size={10} />
							</button>
						</div>
					))}
					<div className="space" />
				</div>
				<div className={`scrollLeft ${leftCategoryScroll ? "show" : ""}`} onClick={categoryScrollLeft}>
					<Icon code="f053" type="solid" />
				</div>
				<div className={`scrollRight ${rightCategoryScroll ? "show" : ""}`} onClick={categoryScrollRight}>
					<Icon code="f054" type="solid" />
				</div>
			</div>
			<div className="menuItemEditor">
				<div className="menuItemHeader">
					<h1 className="menuItemHeading">Menu Items</h1>
					<div className="menuItemOptions" />
				</div>
				<div className="menuItemContainer">
					{menus.map((item, id) => (
						<MenuEditorItem key={id} item={item} onEdit={onEdit} onHide={onHide} onDelete={onDeleteItem} hideSettingsLoading={hideSettingsLoading.includes(item.id)} deleteLoading={deleteItemLoading.includes(item.id)} />
					))}
				</div>
			</div>
			<Button
				className={`menuEditorAdd ${modalOpen ? "active" : ""}`}
				onClick={() => { setForm(emptyForm); setModalOpen(true); }}
				icon="2b"
				iconType="solid"
			/>
		</div>
	);
};

export default MenuEditor;
