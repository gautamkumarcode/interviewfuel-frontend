"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center">
				{/* Error Icon */}
				<div className="relative mb-8">
					<div className="mx-auto w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
						<AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
					</div>
				</div>

				{/* Error Message */}
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Something Went Wrong
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
					We encountered an unexpected error while processing your request.
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
					{error.message || "An unknown error occurred"}
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Button
						onClick={reset}
						className="gap-2 min-w-[160px] bg-blue-600 hover:bg-blue-700">
						<RefreshCw className="h-4 w-4" />
						Try Again
					</Button>
					<Link href="/">
						<Button variant="outline" className="gap-2 min-w-[160px]">
							<Home className="h-4 w-4" />
							Go Home
						</Button>
					</Link>
				</div>

				{/* Error Details (Development Only) */}
				{process.env.NODE_ENV === "development" && (
					<div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
							Error Details (Development Only)
						</h3>
						<pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
							{error.stack}
						</pre>
						{error.digest && (
							<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				)}

				{/* Support Info */}
				<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						If this problem persists, please contact our support team.
					</p>
				</div>
			</div>
		</div>
	);
}
