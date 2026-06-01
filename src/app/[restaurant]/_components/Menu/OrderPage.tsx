import { signOut, useSession } from "next-auth/react";
import { type SyntheticEvent, type UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { ActionCard, Button, Icon, Spinner } from "xtreme-ui";

import SearchButton from "#components/base/SearchButton";
import SideSheet from "#components/base/SideSheet";
import { useOrder, useRestaurant } from "#components/context/useContext";
import Modal from "#components/layout/Modal";
import type { TMenu } from "#utils/database/models/menu";
import useSWR from "swr";
import { fetcher } from "#utils/helper/common";
import { useQueryParams } from "#utils/hooks/useQueryParams";
import { Select } from "xtreme-ui";

import CartPage from "./CartPage";
import MenuCard from "./MenuCard";
import UserLogin from "./UserLogin";
import "./orderPage.scss";

const OrderPage = () => {
	const session = useSession();
	const { loading, loginOpen, setLoginOpen, mutate } = useOrder();
	const { restaurant } = useRestaurant();

	const menus = restaurant?.menus as Array<TMenuCustom>;
	const params = useQueryParams();
	const table = params.get("table");
	const isDevMode = params.get("dev") === "1" || !table; // Dev bypass if ?dev=1 or no table
	const searchParam = params.get("search")?.trim() ?? "";
	const categoryParam = params.get("category")?.trim();
	const category = useMemo(() => (categoryParam ? categoryParam.split(",") : []), [categoryParam]);

	const { data: restaurantsData } = useSWR(isDevMode ? "/api/restaurants" : null, fetcher);
	const [selectedRest, setSelectedRest] = useState("");
	const [selectedTable, setSelectedTable] = useState(""); 

	const order = useRef<HTMLDivElement>(null);
	const categories = useRef<HTMLDivElement>(null);
	const [sideSheetOpen, setSideSheetOpen] = useState(false);
	const [topHeading, setTopHeading] = useState(["Menu", "Category"]);
	const [orderHeading, setOrderHeading] = useState(["Explore", "Menu"]);
	const [sideSheetHeading, setSideSheetHeading] = useState(["Your", "Order"]);

	const [searchActive, setSearchActive] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [floatHeader, setFloatHeader] = useState(false);
	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);
	const [showInfoCard, setShowInfoCard] = useState<string | false>(false);

	const [filteredProducts, setFilteredProducts] = useState<Array<TMenuCustom>>(menus);
	const [selectedProducts, setSelectedProducts] = useState<Array<TMenuCustom>>([]);
	const [hasImageItems, setHasImageItems] = useState(false);
	const [hasNonImageItems, setHasNonImageItems] = useState(false);

	const showOrderButton = restaurant?.tables?.some(({ username }) => username === table);
	const eligibleToOrder = session.data?.role === "customer" && showOrderButton;

	const handleRestChange = (restUsername: string) => {
		setSelectedRest(restUsername);
		setSelectedTable("");
		params.router.replace(`/${restUsername}?table=`);
	};

	const handleTableChange = (tableUsername: string) => {
		setSelectedTable(tableUsername);
		params.router.replace(params.pathname + `?table=${tableUsername}`);
	};

	const onMenuScroll = (event: UIEvent<HTMLDivElement>) => {
		const scrollTop = (event.target as HTMLDivElement).scrollTop;
		if (scrollTop > 30) {
			setFloatHeader(true);
			setTopHeading(["Menu", "Category"]);
			if (order?.current && scrollTop >= order?.current?.offsetTop - 15) setTopHeading(orderHeading);
			return;
		}
		return setFloatHeader(false);
	};
	const onCategoryScroll = (event: SyntheticEvent) => {
		const target = event.target as HTMLElement;
		if (target.scrollLeft > 50) setLeftCategoryScroll(true);
		else setLeftCategoryScroll(false);
		if (Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth) setRightCategoryScroll(true);
		else setRightCategoryScroll(false);
	};
	const categoryScrollLeft = () => { if (categories.current) categories.current.scrollLeft -= 400; };
	const categoryScrollRight = () => { if (categories.current) categories.current.scrollLeft += 400; };
	const onCategoryClick = (categoryName: string) => {
		let newCategory = [];
		if (category.includes(categoryName)) newCategory = category.filter((item) => item !== categoryName);
		else newCategory = [...category, categoryName];
		params.set({ category: newCategory.join(",") });
	};
	const onLoginClick = () => {
		if (table) return setLoginOpen(true);
		return params.router.push("/scan");
	};
	const increaseProductQuantity = (product: TMenuCustom) => {
		const selection = [...selectedProducts];
		if (selectedProducts.some((item) => item.id === product.id)) {
			selection.forEach((item) => { if (product.id === item.id) item.quantity++; });
		} else {
			product.quantity = 1;
			selection.push(product);
		}
		setSelectedProducts(selection);
	};
	const decreaseProductQuantity = (product: TMenuCustom) => {
		let selection = [...selectedProducts];
		selection.forEach((item) => {
			if (product.id === item.id) {
				item.quantity--;
				if (item.quantity === 0) selection = selection.filter((tempItem) => tempItem.id !== product.id);
			}
		});
		setSelectedProducts(selection);
	};

	useEffect(() => {
		const search = searchParam.toLowerCase();
		setFilteredProducts(
			menus?.filter?.(
				({ name, description, category: cat }) =>
					(search ? name?.toLowerCase().includes(search) || description?.toLowerCase().includes(search) || cat?.toLowerCase().includes(search) : true) &&
					(category.length ? category.includes(cat) : true),
			),
		);
	}, [category, menus, searchParam]);

	useEffect(() => {
		params.set({ category: category.filter((e) => restaurant?.profile.categories.includes(e)).join(",") });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, restaurant, params.set]);
	useEffect(() => {
		params.set({ search: searchValue });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, params.set]);

	useEffect(() => {
		setHasImageItems(filteredProducts?.some((product) => !!product.image) ?? false);
		setHasNonImageItems(filteredProducts?.some((product) => !product.image) ?? false);
	}, [filteredProducts]);

	useEffect(() => {
		if (session.data?.role === "customer") setOrderHeading(["Choose", "Order"]);
		else setOrderHeading(["Explore", "Menu"]);
	}, [session]);

	useEffect(() => {
		if (session.status === "authenticated" && session.data?.role === "customer" && session.data?.restaurant?.username && restaurant?.username && session.data.restaurant.username !== restaurant.username) {
			signOut();
		}
	}, [restaurant?.username, session.data?.restaurant?.username, session.data?.role, session.status]);

	useEffect(() => {
		if (!loginOpen) {
			mutate?.();
		}
	}, [loginOpen, mutate]);

	useEffect(() => {
		const handleOrderRefresh = () => {
			mutate?.();
		};
		const handleAddToCart = (e: Event) => {
			const items = (e as CustomEvent<TMenuCustom[]>).detail;
			if (!items?.length) return;
			setSelectedProducts((prev) => {
				const updated = [...prev];
				items.forEach((item) => {
					const existing = updated.find((p) => p.id === item.id);
					if (existing) existing.quantity++;
					else updated.push({ ...item, quantity: 1 });
				});
				return updated;
			});
			setSideSheetOpen(true);
		};
		window.addEventListener('orderRefresh', handleOrderRefresh);
		window.addEventListener('add-to-cart', handleAddToCart);
		return () => {
			window.removeEventListener('orderRefresh', handleOrderRefresh);
			window.removeEventListener('add-to-cart', handleAddToCart);
		};
	}, [mutate]);

	return (
		<div className="orderPage">
			<div className="mainContainer" onScroll={onMenuScroll}>
				<div className={`mainHeader ${searchActive ? "searchActive" : ""} ${floatHeader ? "floatHeader" : ""}`}>
					<h1>
						{topHeading[0]} <span>{topHeading[1]}</span>
					</h1>
		{isDevMode && (
			<div className="devSelector">
				<div className="devBanner">
					<Icon code="f0ab" /> Still developing - Quick dev selector below 👇
				</div>
				<div className="devControls">
					{Array.isArray(restaurantsData) ? (
						<>
							<select value={selectedRest} onChange={(e) => handleRestChange(e.target.value)} className="restSelect">
								<option value="">Choose Restaurant</option>
								{restaurantsData.map((r: any) => (
									<option key={r.username} value={r.username}>
										{r.profile?.name || r.username}
									</option>
								))}
							</select>
							{selectedRest && (() => {
								const selectedRestaurant = restaurantsData.find((r: any) => r.username === selectedRest);
								return selectedRestaurant?.tables?.map((t: any) => (
									<select key={t.username} value={selectedTable} onChange={(e) => handleTableChange(e.target.value)} className="tableSelect">
										<option value="">Table {t.name}</option>
										<option value={t.username}>{t.name}</option>
									</select>
								));
							})()}
						</>
					) : <Spinner label="Loading restaurants..." />}
				</div>
			</div>
		)}
		<div className="options">
			<SearchButton setSearchActive={setSearchActive} placeholder="Search menu" value={searchValue} setValue={setSearchValue} />
			{(!session.data?.role || !showOrderButton) && (
				<Button className="loginButton" label={showOrderButton ? "Order" : "Scan"} onClick={onLoginClick} />
			)}
			{eligibleToOrder && (
				<Button
					icon="e43b"
					iconType="solid"
					label={`${selectedProducts?.length > 0 ? selectedProducts?.length : ""}`}
					onClick={() => setSideSheetOpen(true)}
				/>
			)}
			{session.data?.role === "admin" && (
				<Button className="dashboardButton" label="Dashboard" icon="e09f" iconType="solid" onClick={() => params.router.push("/dashboard")} />
			)}
			{session.data?.role === "kitchen" && (
				<Button className="kitchenButton" label="Kitchen" icon="e09f" iconType="solid" onClick={() => params.router.push("/kitchen")} />
			)}
		</div>
				</div>
				{restaurant && (
					<div className="category">
						<div className="itemCategories" ref={categories} onScroll={onCategoryScroll}>
							{restaurant?.profile?.categories?.map((item, i) => (
								<ActionCard key={i} className={`menuCategory ${category.includes(item) ? "active" : ""}`} onClick={() => onCategoryClick(item)}>
									<span className="title">{item}</span>
								</ActionCard>
							))}
							<div className="space" />
							<div className={`scrollLeft ${leftCategoryScroll ? "show" : ""}`} onClick={categoryScrollLeft}>
								<Icon code="f053" type="solid" />
							</div>
							<div className={`scrollRight ${rightCategoryScroll ? "show" : ""}`} onClick={categoryScrollRight}>
								<Icon code="f054" type="solid" />
							</div>
						</div>
					</div>
				)}
				{!restaurant ? (
					<Spinner label="Loading Menu..." fullpage />
				) : (
					<div className="order" ref={order}>
						<div className="header">
							<h1>
								{orderHeading[0]} <span>{orderHeading[1]}</span>
							</h1>
						</div>
						{hasImageItems && (
							<div className={`itemContainer ${!eligibleToOrder ? "restrictOrder " : ""}`}>
								<div>
									{filteredProducts?.map(
										(item, key) =>
											!item.hidden && (
												<MenuCard
													key={key}
													item={item}
													restrictOrder={!eligibleToOrder}
													increaseQuantity={increaseProductQuantity}
													decreaseQuantity={decreaseProductQuantity}
													showInfo={item.id === showInfoCard}
													setShowInfo={(v) => setShowInfoCard(v ? item.id : false)}
													show={!!item.image}
													quantity={
														(selectedProducts.some((obj) => obj.id === item.id) &&
															selectedProducts?.find((obj) => obj.id === item.id)?.quantity) ||
														0
													}
												/>
											),
									)}
								</div>
							</div>
						)}
						{hasImageItems && hasNonImageItems && <hr />}
						{hasNonImageItems && (
							<div className={`itemContainer withoutImage ${!eligibleToOrder ? "restrictOrder " : ""}`}>
								<div>
									{filteredProducts?.map((item, key) => (
										<MenuCard
											key={key}
											item={item}
											restrictOrder={!eligibleToOrder}
											increaseQuantity={increaseProductQuantity}
											decreaseQuantity={decreaseProductQuantity}
											showInfo={item.id === showInfoCard}
											setShowInfo={(v) => setShowInfoCard(v ? item.id : false)}
											show={!item.image}
											quantity={
												(selectedProducts.some((obj) => obj.id === item.id) &&
													selectedProducts?.find((obj) => obj.id === item.id)?.quantity) ||
												0
											}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			<SideSheet title={sideSheetHeading} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{loading ? (
					<Spinner label="Loading Order..." fullpage />
				) : (
					<CartPage
						selectedProducts={selectedProducts}
						increaseProductQuantity={increaseProductQuantity}
						decreaseProductQuantity={decreaseProductQuantity}
						resetSelectedProducts={() => setSelectedProducts([])}
						setSideSheetHeading={setSideSheetHeading}
					/>
				)}
			</SideSheet>
			<Modal open={loginOpen} setOpen={setLoginOpen}>
				<UserLogin setOpen={setLoginOpen} />
			</Modal>
		</div>
	);
};

export default OrderPage;

type TMenuCustom = TMenu & { quantity: number };
