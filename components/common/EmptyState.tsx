"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	actionHref?: string;
	onAction?: () => void;
	secondaryActionLabel?: string;
	secondaryActionHref?: string;
	onSecondaryAction?: () => void;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionHref,
	onAction,
	secondaryActionLabel,
	secondaryActionHref,
	onSecondaryAction,
}: EmptyStateProps) {
	return (
		<Card className="p-12 text-center">
			{/* Icon */}
			<div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
				<Icon className="h-10 w-10 text-gray-400 dark:text-gray-600" />
			</div>

			{/* Title */}
			<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
				{title}
			</h3>

			{/* Description */}
			<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
				{description}
			</p>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				{actionLabel && (
					<>
						{actionHref ? (
							<Link href={actionHref}>
								<Button className="w-full sm:w-auto">{actionLabel}</Button>
							</Link>
						) : (
							<Button onClick={onAction} className="w-full sm:w-auto">
								{actionLabel}
							</Button>
						)}
					</>
				)}

				{secondaryActionLabel && (
					<>
						{secondaryActionHref ? (
							<Link href={secondaryActionHref}>
								<Button variant="outline" className="w-full sm:w-auto">
									{secondaryActionLabel}
								</Button>
							</Link>
						) : (
							<Button
								variant="outline"
								onClick={onSecondaryAction}
								className="w-full sm:w-auto">
								{secondaryActionLabel}
							</Button>
						)}
					</>
				)}
			</div>
		</Card>
	);
}
