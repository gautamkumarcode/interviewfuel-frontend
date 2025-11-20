"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	AlertTriangle,
	Home,
	RefreshCw,
	ServerCrash,
	WifiOff,
} from "lucide-react";
import Link from "next/link";

interface NetworkErrorProps {
	onRetry?: () => void;
	title?: string;
	message?: string;
	type?: "network" | "server" | "timeout";
}

export function NetworkError({
	onRetry,
	title,
	message,
	type = "network",
}: NetworkErrorProps) {
	const errorConfig = {
		network: {
			icon: WifiOff,
			defaultTitle: "No Internet Connection",
			defaultMessage:
				"Please check your internet connection and try again. Make sure you're connected to a network.",
			color: "text-orange-500",
			bgColor: "bg-orange-100 dark:bg-orange-900/20",
		},
		server: {
			icon: ServerCrash,
			defaultTitle: "Server Error",
			defaultMessage:
				"We're experiencing technical difficulties. Our team has been notified and is working on it.",
			color: "text-red-500",
			bgColor: "bg-red-100 dark:bg-red-900/20",
		},
		timeout: {
			icon: AlertTriangle,
			defaultTitle: "Request Timeout",
			defaultMessage:
				"The request took too long to complete. Please try again.",
			color: "text-yellow-500",
			bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
		},
	};

	const config = errorConfig[type];
	const Icon = config.icon;

	return (
		<div className="min-h-[400px] flex items-center justify-center p-4">
			<Card className="max-w-md w-full p-8 text-center">
				{/* Icon */}
				<div
					className={`mx-auto w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
					<Icon className={`h-10 w-10 ${config.color}`} />
				</div>

				{/* Title */}
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
					{title || config.defaultTitle}
				</h2>

				{/* Message */}
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					{message || config.defaultMessage}
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					{onRetry && (
						<Button onClick={onRetry} className="gap-2">
							<RefreshCw className="h-4 w-4" />
							Try Again
						</Button>
					)}
					<Link href="/">
						<Button variant="outline" className="gap-2 w-full sm:w-auto">
							<Home className="h-4 w-4" />
							Go Home
						</Button>
					</Link>
				</div>

				{/* Additional Help */}
				{type === "network" && (
					<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Troubleshooting tips:
						</p>
						<ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-left">
							<li>• Check if your WiFi or mobile data is turned on</li>
							<li>• Try refreshing the page</li>
							<li>• Check if other websites are working</li>
							<li>• Restart your router if needed</li>
						</ul>
					</div>
				)}
			</Card>
		</div>
	);
}
