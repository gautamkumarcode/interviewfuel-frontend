"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center">
				{/* 404 Animation */}
				<div className="relative mb-8">
					<div className="text-[150px] md:text-[200px] font-bold text-gray-200 dark:text-gray-800 leading-none">
						404
					</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<FileQuestion className="h-24 w-24 md:h-32 md:w-32 text-green-500 animate-bounce" />
					</div>
				</div>

				{/* Error Message */}
				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Page Not Found
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
					Oops! The page you&apos;re looking for doesn&apos;t exist. It might
					have been moved or deleted.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Button
						onClick={() => router.back()}
						variant="outline"
						className="gap-2 min-w-[160px]">
						<ArrowLeft className="h-4 w-4" />
						Go Back
					</Button>
					<Link href="/">
						<Button className="gap-2 min-w-[160px] bg-green-600 hover:bg-green-700">
							<Home className="h-4 w-4" />
							Go Home
						</Button>
					</Link>
					<Link href="/search">
						<Button variant="outline" className="gap-2 min-w-[160px]">
							<Search className="h-4 w-4" />
							Search
						</Button>
					</Link>
				</div>

				{/* Helpful Links */}
				<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
						Here are some helpful links instead:
					</p>
					<div className="flex flex-wrap gap-4 justify-center text-sm">
						<Link
							href="/questions"
							className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline">
							Browse Questions
						</Link>
						<Link
							href="/practice"
							className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline">
							Practice Mode
						</Link>
						<Link
							href="/analytics"
							className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline">
							Analytics
						</Link>
						<Link
							href="/categories"
							className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline">
							Categories
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
