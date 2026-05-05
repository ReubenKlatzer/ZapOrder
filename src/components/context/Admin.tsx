import noop from "lodash/noop";
import { useSearchParams } from "next/navigation";
import { createContext, type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

import type { Kitchen } from "@prisma/client";
import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";
import type { TProfile } from "#utils/database/models/profile";
import type { TTable } from "#utils/database/models/table";
import { fetcher } from "#utils/helper/common";

const AdminDefault: TAdminInitialType = {
	profile: undefined,
	menus: [],
	tables: [],
	kitchens: [],
	profileLoading: false,
	profileMutate: () => new Promise(noop),
	orderRequest: [],
	orderActive: [],
	orderHistory: [],
	orderAction: () => new Promise(noop),
	orderActionLoading: false,
	orderLoading: false,
};

const sortByDate = (a: { updatedAt: string | number | Date }, b: { updatedAt: string | number | Date }) =>
	new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

export const AdminContext = createContext(AdminDefault);
export const AdminProvider = ({ children }: TAdminProviderProps) => {
	const params = useSearchParams();
	const _tab = params.get("tab");
	const _subTab = params.get("subTab");
	const { data: { profile, menus = [], tables = [], kitchens = [] } = {}, isLoading: profileLoading, mutate: profileMutate } = useSWR("/api/admin", fetcher);
	const { data: orderData = [], isLoading: orderLoading, mutate } = useSWR("/api/admin/order", fetcher, { refreshInterval: 5000 });
	const [orderActionLoading, setOrderActionLoading] = useState(false);

	const { orderRequest, orderActive, orderHistory } =
		orderData?.reduce?.(
			(acc: { orderRequest: TOrder[]; orderActive: TOrder[]; orderHistory: TOrder[] }, order: TOrder) => {
				const prods = order.products ?? [];
				if (order.state === "active") {
					if (prods.some(({ adminApproved }) => adminApproved)) acc.orderActive.push(order);
					if (prods.some(({ adminApproved }) => !adminApproved)) acc.orderRequest.push(order);
				} else acc.orderHistory.push(order);
				return acc;
			},
			{ orderRequest: [], orderActive: [], orderHistory: [] },
		) ?? {};

	[orderRequest, orderActive, orderHistory].forEach((arr) => arr?.sort?.(sortByDate));

	const orderAction = async (orderID: string, action: TOrderAction) => {
		if (orderActionLoading) return;
		setOrderActionLoading(true);
		const req = await fetch("/api/admin/order/action", { method: "POST", body: JSON.stringify({ orderID, action }) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setOrderActionLoading(false);
	};

	useEffect(() => {
		mutate();
	}, [mutate]);

	return (
		<AdminContext.Provider
			value={{
				profile,
				menus,
				tables,
				kitchens,
				profileLoading,
				profileMutate,
				orderRequest,
				orderActive,
				orderHistory,
				orderAction,
				orderActionLoading,
				orderLoading,
			}}>
			{children}
		</AdminContext.Provider>
	);
};

export type TAdminProviderProps = {
	children?: ReactNode;
};

export type TAdminInitialType = {
	profile?: TProfile;
	menus: TMenu[];
	tables: TTable[];
	kitchens: Kitchen[];
	profileLoading: boolean;
	profileMutate: () => Promise<unknown>;
	orderRequest: TOrder[];
	orderActive: TOrder[];
	orderHistory: TOrder[];
	orderAction: (orderID: string, action: TOrderAction) => Promise<void>;
	orderActionLoading: boolean;
	orderLoading: boolean;
};

export type TOrderAction = "accept" | "complete" | "reject" | "rejectOnActive";
