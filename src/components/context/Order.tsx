import noop from "lodash/noop";
import pick from "lodash/pick";
import { useSession } from "next-auth/react";
import { createContext, type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";
import { fetcher } from "#utils/helper/common";

const OrderDefault: TOrderInitialType = {
	order: undefined,
	loading: false,
	placeOrder: () => new Promise(noop),
	placingOrder: false,
	cancelOrder: noop,
	cancelingOrder: false,
	loginOpen: false,
	setLoginOpen: noop,
	mutate: async () => {},
};

export const OrderContext = createContext(OrderDefault);
export const OrderProvider = ({ children }: TOrderProviderProps) => {
	const session = useSession();
	const authenticated = session.status === "authenticated";
	const { data: order, isLoading: loading, mutate, error } = useSWR(authenticated ? "/api/order" : null, fetcher, { 
		refreshInterval: 5000,
		onError: (err) => {
			console.error('Order fetch error:', err);
		},
		shouldRetryOnError: false,
	});

	const [placingOrder, setPlacingOrder] = useState(false);
	const [cancelingOrder, setCancelingOrder] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);

	const placeOrder = async (products: Array<TMenuCustom>) => {
		setPlacingOrder(true);
		try {
			const req = await fetch("/api/order/place", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					products: products.map((product) => pick(product, ["id", "quantity"])),
				}),
			});
			if (!req.ok) {
				const res = await req.json().catch(() => ({ message: "Failed to place order" }));
				toast.error(res?.message || "Failed to place order");
			} else {
				await mutate();
			}
		} catch (error) {
			console.error('Place order error:', error);
			toast.error("Failed to place order");
		} finally {
			setPlacingOrder(false);
		}
	};
	const cancelOrder = async () => {
		setCancelingOrder(true);
		try {
			const req = await fetch("/api/order/cancel", { 
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			if (!req.ok) {
				const res = await req.json().catch(() => ({ message: "Failed to cancel order" }));
				toast.error(res?.message || "Failed to cancel order");
			} else {
				await mutate();
			}
		} catch (error) {
			console.error('Cancel order error:', error);
			toast.error("Failed to cancel order");
		} finally {
			setCancelingOrder(false);
		}
	};

	useEffect(() => {
		if (authenticated) {
			mutate();
		}
	}, [authenticated, mutate]);

	return (
		<OrderContext.Provider value={{ order, loading, placeOrder, placingOrder, cancelOrder, cancelingOrder, loginOpen, setLoginOpen, mutate }}>
			{children}
		</OrderContext.Provider>
	);

};

export type TOrderProviderProps = {
	children?: ReactNode;
};

export type TOrderInitialType = {
	order?: TOrder;
	loading: boolean;
	placeOrder: (products: Array<TMenuCustom>) => Promise<void>;
	placingOrder: boolean;
	cancelOrder: () => void;
	cancelingOrder: boolean;
	loginOpen: boolean;
	setLoginOpen: (open: boolean) => void;
	mutate: () => Promise<any>;
};
type TMenuCustom = TMenu & { quantity: number };
