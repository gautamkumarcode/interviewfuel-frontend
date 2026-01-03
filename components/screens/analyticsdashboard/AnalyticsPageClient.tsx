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
		<div className="min-h-screen">
			<div className="mx-auto">
				{/* Modern Header Design */}
				<div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
					{/* Top Section: Back Button */}
					<div className="mb-4">
						<Button
							variant="ghost"
							onClick={handleExit}
							size="sm"
							className="gap-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 -ml-2">
							<ArrowLeft className="h-4 w-4" />
							<span className="text-sm font-medium">Back</span>
						</Button>
					</div>

					{/* Main Header Section */}
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
						{/* Title Section */}
						<div className="flex-1 min-w-0">
							<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
								Analytics Dashboard
							</h1>
							<p className="text-base text-gray-500 dark:text-gray-400">
								Track your learning progress and performance
							</p>
						</div>

						{/* Time Range Selector */}
						<div className="flex items-center gap-3 sm:shrink-0">
							<Select
								value={timeRange}
								onValueChange={handleTimeRangeChange}
								disabled={isPending}>
								<SelectTrigger className="w-[160px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 h-10 font-medium">
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
								<div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap animate-pulse">
									Updating...
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Content */}
				<div
					className={
						isPending ? "opacity-50 pointer-events-none transition-opacity" : ""
					}>
					{children}
				</div>
			</div>
		</div>
	);
}
