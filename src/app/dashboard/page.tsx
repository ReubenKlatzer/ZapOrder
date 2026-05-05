"use client";

import { capitalize } from "xtreme-ui";

import { DashboardProvider } from "#components/context";
import { useAdmin } from "#components/context/useContext";
import NavSideBar from "#components/layout/NavSideBar";

import PageContainer from "./_components/PageContainer";
import "./dashboard.scss";

const navItems = [
	{ label: "orders", icon: "e43b", value: "orders" },
	{ label: "settings", icon: "f013", value: "settings" },
];

function DashboardContent() {
	const { profile } = useAdmin();
	return (
		<div className="dashboard">
			<NavSideBar 
				navItems={navItems} 
				defaultTab="orders" 
				logo={profile?.avatar} 
				logoAlt={profile?.name} 
			/>
			<PageContainer />
		</div>
	);
}

const Dashboard = () => {
	return (
		<DashboardProvider>
			<DashboardContent />
		</DashboardProvider>
	);
};

export default Dashboard;
