"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body>
				<div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
					<div className="max-w-2xl w-full text-center">
						{/* Error Icon */}
						<div className="relative mb-8">
							<div className="mx-auto w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
							</div>
						</div>

						{/* Error Message */}
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Critical Error
						</h1>
						<p className="text-lg text-gray-600 mb-2">
							A critical error occurred. Please try refreshing the page.
						</p>
						<p className="text-sm text-gray-500 mb-8">
							{error.message || "An unknown error occurred"}
						</p>

						{/* Action Button */}
						<Button
							onClick={reset}
							className="gap-2 min-w-[160px] bg-green-600 hover:bg-green-700">
							<RefreshCw className="h-4 w-4" />
							Refresh Page
						</Button>
					</div>
				</div>
			</body>
		</html>
	);
}
