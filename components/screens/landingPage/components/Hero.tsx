"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
			{/* Geometric Background */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50 via-white to-white dark:from-green-950/20 dark:via-gray-950 dark:to-gray-950 z-0" />
			<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20 z-0" />

			{/* Floating Orbs */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2 }}
				className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob"
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2, delay: 1 }}
				className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"
			/>

			<div className="container relative z-10 px-4 mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 backdrop-blur-sm">
					<Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
					<span className="text-sm font-medium text-green-700 dark:text-green-300">
						New: AI Mock Interviews V2.0
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
					Master Your Next <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400">
						Technical Interview
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
					Join 100,000+ developers practicing with AI-powered mock interviews,
					premium system design questions, and real-time feedback.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
					<Link href="/practice">
						<Button
							size="lg"
							className="h-14 px-8 text-lg rounded-xl bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95">
							Start Practicing Free
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>
					</Link>
					<Link href="/questions">
						<Button
							variant="outline"
							size="lg"
							className="h-14 px-8 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 backdrop-blur-sm text-gray-900 dark:text-white transition-all">
							Explore Questions
						</Button>
					</Link>
				</motion.div>

				{/* 3D Dashboard Mockup */}
				<motion.div
					initial={{ opacity: 0, y: 40, rotateX: 20 }}
					animate={{ opacity: 1, y: 0, rotateX: 0 }}
					transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
					className="relative max-w-5xl mx-auto perspective-1000">
					<div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl shadow-green-900/10 overflow-hidden transform-gpu">
						{/* Window Header */}
						<div className="h-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center px-4 gap-2">
							<div className="w-3 h-3 rounded-full bg-red-400/80" />
							<div className="w-3 h-3 rounded-full bg-yellow-400/80" />
							<div className="w-3 h-3 rounded-full bg-green-400/80" />
							<div className="ml-4 px-3 py-1 bg-white dark:bg-gray-800 rounded-md text-xs text-gray-400 font-mono flex items-center gap-2">
								<Terminal className="w-3 h-3" />
								interview-fuel.tsx
							</div>
						</div>

						{/* Mock Content */}
						<div className="p-1 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50/30 dark:bg-gray-900/30 min-h-[400px]">
							{/* Sidebar Mock */}
							<div className="hidden md:block col-span-3 space-y-4">
								<div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
								<div className="space-y-2">
									<div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
									<div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
									<div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
								</div>
							</div>

							{/* Main Content Mock */}
							<div className="col-span-12 md:col-span-9 space-y-6">
								<div className="h-64 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm relative overflow-hidden group">
									<div className="flex items-center justify-between mb-6">
										<div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg" />
										<div className="h-8 w-24 bg-green-100 dark:bg-green-900/20 rounded-lg" />
									</div>
									<div className="space-y-3 font-mono text-sm">
										<div className="flex gap-4">
											<span className="text-gray-400">01</span>
											<span className="text-purple-500">function</span>{" "}
											<span className="text-blue-500">solveProblem</span>(
											<span className="text-orange-500">input</span>) {"{"}
										</div>
										<div className="flex gap-4">
											<span className="text-gray-400">02</span>
											<span className="pl-4 text-gray-600 dark:text-gray-400">
												{/* Optimized specific solution using Two Pointers */}
											</span>
										</div>
										<div className="flex gap-4">
											<span className="text-gray-400">03</span>
											<span className="pl-4 text-purple-500">const</span>{" "}
											<span className="text-blue-500">result</span> = [];
										</div>
										<div className="flex gap-4">
											<span className="text-gray-400">04</span>
											<span className="pl-4 text-purple-500">return</span>{" "}
											<span className="text-blue-500">result</span>;
										</div>
										<div className="flex gap-4">
											<span className="text-gray-400">05</span>
											<span>{"}"}</span>
										</div>
									</div>
									
									{/* Overlay Gradient */}
									<div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-900 dark:via-transparent dark:to-transparent opacity-50" />
								</div>
							</div>
						</div>
					</div>
					
					{/* Glow behind dashboard */}
					<div className="absolute -inset-4 bg-green-500/20 blur-3xl -z-10 rounded-[3rem]" />
				</motion.div>
			</div>
		</section>
	);
}
