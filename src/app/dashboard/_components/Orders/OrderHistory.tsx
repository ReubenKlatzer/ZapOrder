import { type UIEvent, useEffect, useState } from "react";

import SideSheet from "#components/base/SideSheet";
import { useAdmin } from "#components/context/useContext";
import NoContent from "#components/layout/NoContent";
import type { TOrder } from "#utils/database/models/order";
import OrderDetails from "./OrderDetails";

import OrdersCard from "./OrdersCard";

const OrderHistory = (props: TOrderHistoryProps) => {
	const { onScroll } = props;
	const { orderHistory = [], profile } = useAdmin();

	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	useEffect(() => {
		if (orderHistory?.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		} else if (!orderHistory.some(({ id }) => id === activeCardID)) {
			setActiveCardID(orderHistory[0]?.id);
			setActiveCardData(orderHistory[0]);
		}
	}, [activeCardID, orderHistory]);

	return (
		<div className="orders">
			{orderHistory.length === 0 ? (
				<NoContent label="No order history" animationName="GhostNoContent" />
			) : (
				<div className="ordersContent">
					<div className="list" onScroll={onScroll}>
						{orderHistory.map((data, i) => (
							<OrdersCard
								key={i}
								history
								data={data}
								showDetails={setSideSheetOpen}
								active={activeCardID === data.id}
								activate={(orderID) => {
									setActiveCardID(orderID);
									setActiveCardData(orderHistory.find((order) => order.id === orderID));
								}}
							/>
						))}
					</div>
					<div className="details">
						{!activeCardData ? (
							<NoContent label="No orders yet" animationName="GhostNoContent" size={200} />
						) : (
							<OrderDetails order={activeCardData} profile={profile} />
						)}
					</div>
				</div>
			)}
			<SideSheet title={["Order Details"]} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{activeCardData && <OrderDetails order={activeCardData} profile={profile} />}
			</SideSheet>
		</div>
	);
};

export default OrderHistory;

export type TOrderHistoryProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void;
};
