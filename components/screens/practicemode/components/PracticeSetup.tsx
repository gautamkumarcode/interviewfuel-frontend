"use client";

import { CustomButton, HashLoader } from "@/components/custom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useClusterData } from "@/context/clusterData-context";
import {
	BookOpen,
	Brain,
	ChevronLeft,
	ChevronRight,
	Clock,
	Database,
	Hash,
	History,
	Info,
	Play,
	Sparkles,
	Timer,
	Trophy,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PracticeSettings } from "../types";

interface PracticeSetupProps {
	settings: PracticeSettings;
	onSettingsChange: (settings: PracticeSettings) => void;
	onStartSession: () => void;
}

export function PracticeSetup({
	settings,
	onSettingsChange,
	onStartSession,
}: PracticeSetupProps) {
	const [creating, setCreating] = useState(false);
	const { categoryData } = useClusterData();

	const updateSettings = (updates: Partial<PracticeSettings>) => {
		onSettingsChange({ ...settings, ...updates });
	};

	const handleStartClick = async () => {
		if (settings.categories.length === 0) {
			alert("Please select a category");
			return;
		}
		setCreating(true);

		try {
			await onStartSession();

			// Only reset if onStartSession doesn't navigate away
			// If it navigates to a new page, this component will unmount anyway
		} catch (error) {
			console.error("Failed to start session:", error);
			setCreating(false);
		} finally {
			setCreating(false);
		}
	};

	// Check if the form is in a ready state to start
	const isReadyToStart = settings.categories.length > 0;

	return (
		<div className="min-h-screen p-2 sm:p-4 lg:p-6">
			{/* Navigation Header */}
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
					<Button
						variant="ghost"
						className="gap-1 sm:gap-2 hover:bg-white/60 backdrop-blur-sm text-sm sm:text-base">
						<ChevronLeft className="h-4 w-4" />
						<span className="hidden sm:inline">Back to Questions</span>
						<span className="sm:hidden">Back</span>
					</Button>

					<div className="text-center flex-1 sm:flex-none">
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
							Practice Session Setup
						</h1>
					</div>

					<div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
						<Link href="/practice/history" className="flex-1 sm:flex-none">
							<Button
								variant="outline"
								size="sm"
								className="gap-1 sm:gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 w-full sm:w-auto text-xs sm:text-sm">
								<History className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="hidden sm:inline">History</span>
								<span className="sm:hidden">📚</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
					{/* Settings Panel */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
						{/* Question Source Selection */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader className="pb-3 sm:pb-4">
								<CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
									<div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
										<Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
									</div>
									<span className="truncate">Question Source</span>
								</CardTitle>
								<p className="text-gray-600 text-sm sm:text-base">
									Choose how your questions will be generated
								</p>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div
										className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
											settings.source === "ai"
												? "border-blue-500 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
										onClick={() => updateSettings({ source: "ai" })}>
										<div className="flex items-center gap-2 sm:gap-3 mb-2">
											<Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 shrink-0" />
											<span className="font-semibold text-sm sm:text-base">
												AI Generated
											</span>
											<Badge
												variant="secondary"
												className="bg-blue-100 text-blue-700 text-xs">
												Smart
											</Badge>
										</div>
										<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
											Personalized questions tailored to your skill level and
											preferences
										</p>
									</div>
									<div
										className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
											settings.source === "db"
												? "border-green-500 bg-green-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
										onClick={() => updateSettings({ source: "db" })}>
										<div className="flex items-center gap-2 sm:gap-3 mb-2">
											<Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 shrink-0" />
											<span className="font-semibold text-sm sm:text-base">
												Database
											</span>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-700 text-xs">
												Curated
											</Badge>
										</div>
										<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
											Hand-picked questions from our comprehensive database
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Session Configuration */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent className="space-y-6 sm:space-y-8 pt-4 sm:pt-6">
								{/* Duration Slider */}
								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-center gap-2 sm:gap-3">
										<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
										<Label className="text-sm sm:text-base font-medium">
											Session Duration
										</Label>
									</div>
									<div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 sm:p-6 rounded-xl">
										<Slider
											id="duration"
											min={15}
											max={120}
											step={15}
											value={[settings.duration]}
											onValueChange={(value) =>
												updateSettings({ duration: value[0] })
											}
											className="w-full"
										/>
										<div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
											<span>15 min</span>
											<div className="flex items-center gap-1 sm:gap-2">
												<Timer className="h-3 w-3 sm:h-4 sm:w-4" />
												<span className="font-bold text-sm sm:text-lg text-orange-600">
													{settings.duration}{" "}
													<span className="hidden sm:inline">minutes</span>
													<span className="sm:hidden">min</span>
												</span>
											</div>
											<span>120 min</span>
										</div>
									</div>
								</div>

								<Separator />

								{/* Questions and Difficulty */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
									<div className="space-y-2 sm:space-y-3">
										<div className="flex items-center gap-2 sm:gap-3">
											<Hash className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
											<Label className="text-sm sm:text-base font-medium">
												<span className="hidden sm:inline">
													Number of Questions
												</span>
												<span className="sm:hidden">Questions</span>
											</Label>
										</div>
										<Select
											value={settings.questionCount.toString()}
											onValueChange={(value) =>
												updateSettings({
													questionCount: Number.parseInt(value),
												})
											}>
											<SelectTrigger className="h-10 sm:h-12 bg-white/80 text-sm sm:text-base">
												<SelectValue placeholder="Select questions" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="3">3 Questions</SelectItem>
												<SelectItem value="5">5 Questions</SelectItem>
												<SelectItem value="10">10 Questions</SelectItem>
												<SelectItem value="15">15 Questions</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2 sm:space-y-3">
										<div className="flex items-center gap-2 sm:gap-3">
											<Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
											<Label className="text-sm sm:text-base font-medium">
												<span className="hidden sm:inline">
													Difficulty Level
												</span>
												<span className="sm:hidden">Difficulty</span>
											</Label>
										</div>
										<Select
											value={settings.difficulty}
											onValueChange={(value) =>
												updateSettings({ difficulty: value })
											}>
											<SelectTrigger className="h-10 sm:h-12 bg-white/80 text-sm sm:text-base">
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Easy">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														<span className="hidden sm:inline">Easy Only</span>
														<span className="sm:hidden">Easy</span>
													</div>
												</SelectItem>
												<SelectItem value="Medium">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
														<span className="hidden sm:inline">
															Medium Only
														</span>
														<span className="sm:hidden">Medium</span>
													</div>
												</SelectItem>
												<SelectItem value="Hard">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-red-500 rounded-full"></div>
														<span className="hidden sm:inline">Hard Only</span>
														<span className="sm:hidden">Hard</span>
													</div>
												</SelectItem>
												<SelectItem value="Mixed">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
														<span className="hidden sm:inline">
															Mixed Difficulty
														</span>
														<span className="sm:hidden">Mixed</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
										<div className="flex items-center gap-2 sm:gap-3">
											<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
											<Label className="text-sm sm:text-base font-medium">
												Category
											</Label>
										</div>
										<Select
											value={settings.categories[0] || ""}
											onValueChange={(value) =>
												updateSettings({ categories: [value] })
											}>
											<SelectTrigger className="h-10 sm:h-12 bg-white/80 text-sm sm:text-base">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categoryData?.map(
													(category: { _id: string; name: string }) => (
														<SelectItem key={category._id} value={category._id}>
															<div className="flex items-center gap-2">
																<div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
																<span className="truncate">
																	{category.name}
																</span>
															</div>
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Category Selection */}
							</CardContent>
						</Card>
					</div>

					{/* Summary Panel */}
					<div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
						{/* Session Summary */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl lg:sticky lg:top-4">
							<CardHeader className="pb-3 sm:pb-6">
								<CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
									<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
									Session Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4 pt-0">
								<div className="space-y-2 sm:space-y-3">
									<div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
										<span className="text-xs sm:text-sm font-medium text-gray-700">
											Duration
										</span>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-700 text-xs">
											{settings.duration} min
										</Badge>
									</div>
									<div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
										<span className="text-xs sm:text-sm font-medium text-gray-700">
											Questions
										</span>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700 text-xs">
											{settings.questionCount}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
										<span className="text-xs sm:text-sm font-medium text-gray-700">
											Difficulty
										</span>
										<Badge
											variant="secondary"
											className="bg-purple-100 text-purple-700 text-xs">
											{settings.difficulty}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
										<span className="text-xs sm:text-sm font-medium text-gray-700">
											Source
										</span>
										<Badge
											variant="secondary"
											className="bg-orange-100 text-orange-700 text-xs">
											<span className="hidden sm:inline">
												{settings.source === "ai" ? "AI Generated" : "Database"}
											</span>
											<span className="sm:hidden">
												{settings.source === "ai" ? "AI" : "DB"}
											</span>
										</Badge>
									</div>
									<div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
										<span className="text-xs sm:text-sm font-medium text-gray-700">
											Category
										</span>
										<Badge
											variant="secondary"
											className="bg-indigo-100 text-indigo-700 text-xs max-w-24 sm:max-w-none">
											<span className="truncate">
												{categoryData
													?.filter((cat) =>
														settings.categories.includes(cat._id)
													)
													.map((cat) => cat.name)
													.join(", ") || "None"}
											</span>
										</Badge>
									</div>
								</div>

								<Separator />

								{/* Tips */}
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
									<div className="flex items-start gap-2 sm:gap-3">
										<Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
										<div>
											<h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
												Pro Tips
											</h4>
											<ul className="text-xs sm:text-sm text-blue-800 space-y-1">
												<li>• Think out loud during practice</li>
												<li>• Focus on problem-solving approach</li>
												<li className="hidden sm:list-item">
													• Use the timer effectively
												</li>
												<li className="hidden sm:list-item">
													• Take breaks when needed
												</li>
											</ul>
										</div>
									</div>
								</div>

								{/* Start Button */}
								<div className="pt-3 sm:pt-4">
									<CustomButton
										onClick={handleStartClick}
										isLoading={creating}
										className="w-full gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
										disabled={!isReadyToStart || creating}
										content={
											<div className="flex items-center justify-center gap-2 sm:gap-3">
												<Play className="h-4 w-4 sm:h-5 sm:w-5" />
												<span className="hidden sm:inline">
													{creating
														? "Starting Session..."
														: "Start Practice Session"}
												</span>
												<span className="sm:hidden">
													{creating ? "Starting..." : "Start Session"}
												</span>
												<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
											</div>
										}
									/>
								</div>
							</CardContent>
						</Card>

						{creating && (
							<div className="flex gap-2 items-center justify-center mt-4 sm:mt-6 p-3 sm:p-4 bg-white/30 backdrop-blur-sm border-white/20 rounded-xl shadow-md">
								<HashLoader size={16} color="#008236" className="sm:hidden" />
								<HashLoader
									size={20}
									color="#008236"
									className="hidden sm:block"
								/>
								<p className="text-green-700 animate-pulse text-sm sm:text-base">
									<span className="hidden sm:inline">
										Creating your session
									</span>
									<span className="sm:hidden">Creating session</span>
									<span className="animate-caret-blink">...</span>
								</p>
							</div>
						)}
						{/* Info Box */}
					</div>
				</div>
			</div>
		</div>
	);
}
