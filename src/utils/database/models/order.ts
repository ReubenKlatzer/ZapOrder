import type { Menu, Order, OrderProduct, Customer } from "@prisma/client";

export type TOrder = Order & {
	id: string;
	customer: Customer;
	products: TProduct[];
};

export type TProduct = OrderProduct & {
	id: string;
	menu: Menu;
};
