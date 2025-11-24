"use client";

import { AuthGuard } from "@/components/common";
import HistroyHOC from "@/components/screens/practicemode/history/HistroyHOC";

export default function HistoryPage() {
	return (
		<AuthGuard redirectMessage="Sign in to view your practice history">
			<HistroyHOC />
		</AuthGuard>
	);
}
