"use client";
import { AppLayout } from "@/components/custom/Layout/Layout";
import React from "react";

type LayoutProps = {
	children: React.ReactNode;

}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
	return <AppLayout>{children}</AppLayout>;
}

export default DashboardLayout 
