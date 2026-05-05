import { type UIEvent, useEffect, useState } from "react";

import SideSheet from "#components/base/SideSheet";
import { useAdmin } from "#components/context/useContext";
import NoContent from "#components/layout/NoContent";
import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";

import ItemCard from "../../../../components/layout/ItemCard";

import OrderDetail from "./OrderDetail";
import OrdersCard from "./OrdersCard";

const OrderRequests = (props: TOrderRequestsProps) => {
	const { onScroll } = props;
	const { orderRequest = [], orderAction, orderActionLoading } = useAdmin();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null; details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id) return await orderAction(orderID, "reject");
		return await orderAction(orderID, "accept");
	};

	useEffect(() => {
		if (orderRequest.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		} else if (!orderRequest.some(({ id }) => id === activeCardID)) {
			setActiveCardID(orderRequest[0]?.id);
			setActiveCardData(orderRequest[0]);
		}
	}, [activeCardID, orderRequest]);

	return (
		<div className="orders">
			{orderRequest?.length === 0 ? (
				<NoContent label="No order requests" animationName="GhostNoContent" />
			) : (
				<div className="ordersContent">
					<div className={`list ${orderActionLoading ? "disable" : ""}`} onScroll={onScroll}>
						{orderRequest?.map?.((data, i) => (
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
									setActiveCardData(orderRequest.find((order) => order.id === orderID));
								}}
							/>
						))}
					</div>
					<div className={`details ${activeCardData && rejectCard._id === activeCardData.id ? "reject " : ""}`}>
						{!activeCardData ? (
							<NoContent label="Nothing to show" animationName="GhostNoContent" size={200} />
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

export default OrderRequests;

export type TOrderRequestsProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void;
};
type TMenuCustom = TMenu & { quantity: number };
