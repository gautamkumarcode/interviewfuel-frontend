"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const QuestionDetailsSkeleton = () => {
	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 h-screen overflow-scroll">
			{/* Header */}
			<div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
				<Skeleton className="h-9 w-32 sm:w-40" />
			</div>

			{/* Question Header */}
			<div className="mb-6 sm:mb-8">
				<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
					<div className="flex-1">
						{/* Title */}
						<Skeleton className="h-8 sm:h-10 w-full mb-3" />
						<Skeleton className="h-6 sm:h-8 w-3/4 mb-3" />

						{/* Badges */}
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-6 w-24" />
						</div>

						{/* Tags */}
						<div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-5 w-16" />
							))}
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-6">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-4 w-20" />
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex sm:flex-row items-stretch sm:items-center gap-2 mt-4 lg:mt-0">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-9 w-20 flex-1 sm:flex-none" />
						))}
					</div>
				</div>

				{/* Content */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			</div>

			{/* Companies Card */}
			<Card className="mb-6 sm:mb-8">
				<CardHeader className="pb-3 sm:pb-6">
					<Skeleton className="h-6 w-48" />
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex flex-wrap gap-1.5 sm:gap-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-6 w-20" />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<div className="mb-6 sm:mb-8">
				<div className="grid w-full grid-cols-3 h-10 mb-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} className="h-full mx-1" />
					))}
				</div>

				{/* Tab Content */}
				<div className="space-y-6">
					{/* Rich Answer */}
					<Card>
						<CardContent className="p-3 sm:p-6">
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-4 w-full" />
								))}
								<Skeleton className="h-4 w-3/4" />
							</div>
						</CardContent>
					</Card>

					{/* Solution */}
					<Card>
						<CardHeader className="pb-3 sm:pb-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-8 w-20" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							{/* Code Block */}
							<Skeleton className="h-32 w-full mb-4 rounded-lg" />
							{/* Explanation */}
							<div className="space-y-2">
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton key={i} className="h-4 w-full" />
								))}
								<Skeleton className="h-4 w-2/3" />
							</div>
						</CardContent>
					</Card>

					{/* Best Practices */}
					<Card>
						<CardHeader className="pb-3 sm:pb-6">
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="flex items-start gap-3">
										<Skeleton className="h-2 w-2 rounded-full mt-2 flex-shrink-0" />
										<Skeleton className="h-4 flex-1" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
