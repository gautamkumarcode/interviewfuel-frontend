"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface AnalyticsPageClientProps {
	children: React.ReactNode;
	currentTimeRange: number;
}

export function AnalyticsPageClient({
	children,
	currentTimeRange,
}: AnalyticsPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [timeRange, setTimeRange] = useState(currentTimeRange.toString());

	const handleTimeRangeChange = (newTimeRange: string) => {
		setTimeRange(newTimeRange);
		startTransition(() => {
			const params = new URLSearchParams(searchParams);
			params.set("timeRange", newTimeRange);
			router.push(`/analytics?${params.toString()}`);
		});
	};

	const handleExit = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header with controls */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div className="flex items-center gap-4">
						<Button variant="ghost" onClick={handleExit} className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Analytics Dashboard
							</h1>
							<p className="text-gray-600 mt-2">
								Track your learning progress and performance
							</p>
							<p className="text-xs text-gray-500 mt-1 md:hidden">
								Activity view optimized for mobile (30 days)
							</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Select
							value={timeRange}
							onValueChange={handleTimeRangeChange}
							disabled={isPending}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="7">Last 7 days</SelectItem>
								<SelectItem value="30">Last 30 days</SelectItem>
								<SelectItem value="90">Last 3 months</SelectItem>
								<SelectItem value="365">Last year</SelectItem>
							</SelectContent>
						</Select>
						{isPending && (
							<div className="text-sm text-gray-500">Loading...</div>
						)}
					</div>
				</div>

				{/* Content */}
				<div className={isPending ? "opacity-50 pointer-events-none" : ""}>
					{children}
				</div>
			</div>
		</div>
	);
}
