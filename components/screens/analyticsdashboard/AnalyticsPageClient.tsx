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
			<div className="max-w-7xl mx-auto">
				{/* Header with controls - Fully Responsive */}
				<div className="flex flex-col gap-4 mb-6 sm:mb-8">
					{/* Top row: Back button and title */}
					<div className="flex items-start gap-2 sm:gap-4">
						<Button
							variant="ghost"
							onClick={handleExit}
							className="gap-2 shrink-0 px-2 sm:px-4">
							<ArrowLeft className="h-6 w-6" />
							<span className="hidden sm:inline">Back</span>
						</Button>
						<div className="flex-1 ">
							<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
								Analytics Dashboard
							</h1>
							<p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
								Track your learning progress and performance
							</p>
						</div>
					</div>

					{/* Bottom row: Time range selector */}
					<div className="flex items-center justify-between sm:justify-end gap-3">
						<Select
							value={timeRange}
							onValueChange={handleTimeRangeChange}
							disabled={isPending}>
							<SelectTrigger className="w-full sm:w-40">
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
							<div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
								Loading...
							</div>
						)}
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
