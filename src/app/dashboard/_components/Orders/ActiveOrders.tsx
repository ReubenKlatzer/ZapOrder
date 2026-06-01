import { type UIEvent, useEffect, useState } from "react";

import SideSheet from "#components/base/SideSheet";
import { useAdmin } from "#components/context/useContext";
import ItemCard from "#components/layout/ItemCard";
import NoContent from "#components/layout/NoContent";
import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";
import { Button } from "xtreme-ui";

import OrderDetail from "./OrderDetail";
import OrdersCard from "./OrdersCard";

const ActiveOrders = (props: TActiveOrdersProps) => {
	const { onScroll } = props;
	const { orderActive = [], orderAction, orderActionLoading } = useAdmin();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null; details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id) return await orderAction(orderID, "rejectOnActive");
		return await orderAction(orderID, "complete");
	};

	useEffect(() => {
		if (orderActive?.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
			setDetailOpen(false);
		} else if (!orderActive.some(({ id }) => id === activeCardID)) {
			setActiveCardID(orderActive[0]?.id);
			setActiveCardData(orderActive[0]);
		}
	}, [activeCardID, orderActive]);

	const rejectClass = activeCardData && rejectCard._id === activeCardData.id ? "reject " : "";
	const detailClass = `details ${rejectClass}${detailOpen ? "open" : ""}`;

	return (
		<div className="orders">
			{orderActive?.length === 0 ? (
				<NoContent label="No active orders" animationName="GhostNoContent" />
			) : (
				<div className="ordersContent">
					<div className={`list ${orderActionLoading ? "disable" : ""}`} onScroll={onScroll}>
						{orderActive.map((data, i) => (
							<OrdersCard
								key={i}
								actions
								data={data}
								action={onOrderAction}
								showDetails={setSideSheetOpen}
								details={!!rejectCard?._id && rejectCard.details}
								reject={rejectCard._id === data.id}
								setReject={setRejectCard}
								active={activeCardID === data.id}
								busy={orderActionLoading}
								activate={(orderID: string) => {
									setActiveCardID(orderID);
									setActiveCardData(orderActive.find((order) => order.id === orderID));
									setDetailOpen(true);
								}}
							/>
						))}
					</div>
					<div className={detailClass}>
						<Button
							className="mobileBackBtn"
							icon="f053"
							iconType="solid"
							size="mini"
							type="secondary"
							label="Back"
							onClick={() => setDetailOpen(false)}
						/>
						{!activeCardData ? (
							<NoContent label="No approved orders from this table yet!" animationName="GhostNoContent" size={200} />
						) : (
							<OrderDetail
								actions
								data={activeCardData}
								action={onOrderAction}
								setReject={setRejectCard}
								busy={orderActionLoading}
								reject={activeCardData && rejectCard._id === activeCardData.id}
							/>
						)}
					</div>
				</div>
			)}
			<SideSheet title={[activeCardData ? `Table: ${activeCardData?.table}` : ""]} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{activeCardData?.products.map((product, key) => {
					return <ItemCard item={{ ...product.menu, quantity: product.quantity } as TMenuCustom} key={key} staticCard />;
				})}
			</SideSheet>
		</div>
	);
};

export default ActiveOrders;

export type TActiveOrdersProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void;
};

type TMenuCustom = TMenu & { quantity: number };
