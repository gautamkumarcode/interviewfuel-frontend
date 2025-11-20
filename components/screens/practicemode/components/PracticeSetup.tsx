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
import { useAuthModal } from "@/context/AuthModalContext";
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
	const { categoryData, categoryLoading, userData } = useClusterData();
	const { openLogin } = useAuthModal();

	const updateSettings = (updates: Partial<PracticeSettings>) => {
		onSettingsChange({ ...settings, ...updates });
	};

	const handleStartClick = async () => {
		// Validation based on source type
		if (settings.source === "db" && settings.categories.length === 0) {
			alert("Please select a category for database questions");
			return;
		}

		if (
			settings.source === "ai" &&
			settings.categories.length === 0 &&
			!settings.customTopic?.trim()
		) {
			alert(
				"Please select a category or enter a custom topic for AI questions"
			);
			return;
		}
		if (!userData) {
			openLogin();
			return;
		}

		setCreating(true);

		try {
			await onStartSession();
		} catch (error: any) {
			console.error("Failed to start session:", error);
			alert(
				error.message || "Failed to create practice session. Please try again."
			);
		} finally {
			setCreating(false);
		}
	};

	// Check if the form is in a ready state to start
	const isReadyToStart =
		settings.source === "db"
			? settings.categories.length > 0
			: settings.categories.length > 0 ||
			  (settings.customTopic?.trim()?.length ?? 0) > 0;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
					<div className="flex items-center justify-between gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="gap-1 sm:gap-2 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors px-2 sm:px-4">
							<ChevronLeft className="h-4 w-4" />
							<span className="hidden sm:inline">Back to Questions</span>
							<span className="sm:hidden text-xs">Back</span>
						</Button>

						<div className="text-center flex-1 min-w-0">
							<h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
								Practice Setup
							</h1>
							<p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
								Configure your practice session
							</p>
						</div>

						<Link href="/practice/history">
							<Button
								variant="outline"
								size="sm"
								className="gap-1 sm:gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors px-2 sm:px-3">
								<History className="h-4 w-4" />
								<span className="hidden sm:inline text-xs sm:text-sm">
									History
								</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-in fade-in duration-500">
					{/* Settings Panel */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6">
						{/* Question Source Selection */}
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
							<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
								<CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl">
									<div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-md">
										<Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
									</div>
									<span className="truncate">Question Source</span>
								</CardTitle>
								<p className="text-gray-600 text-xs sm:text-sm mt-1">
									Choose how your questions will be generated
								</p>
							</CardHeader>
							<CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div
										className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] ${
											settings.source === "ai"
												? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
												: "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
										}`}
										onClick={() => updateSettings({ source: "ai" })}>
										<div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
											<Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
											<div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
												<span className="font-semibold text-sm sm:text-base">
													AI Generated
												</span>
												<Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
													🧠 Smart
												</Badge>
											</div>
										</div>
										<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
											AI-generated questions focused on your selected category
											and difficulty level
										</p>
									</div>
									<div
										className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] ${
											settings.source === "db"
												? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
												: "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
										}`}
										onClick={() => updateSettings({ source: "db" })}>
										<div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
											<Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0" />
											<div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
												<span className="font-semibold text-sm sm:text-base">
													Database
												</span>
												<Badge className="bg-green-100 text-green-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
													📚 Curated
												</Badge>
											</div>
										</div>
										<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
											Hand-picked questions from our comprehensive database
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Session Configuration */}
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-3 text-xl">
									<div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md">
										<Clock className="h-5 w-5 text-white" />
									</div>
									Session Configuration
								</CardTitle>
								<p className="text-gray-600 text-sm">
									Customize your practice session settings
								</p>
							</CardHeader>
							<CardContent className="space-y-8 pt-0">
								{/* Duration Slider */}
								<div className="space-y-4">
									<Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
										<Timer className="h-4 w-4 text-orange-600" />
										Session Duration
									</Label>
									<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
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
										<div className="flex justify-between items-center text-sm text-gray-500 mt-4">
											<span className="text-xs sm:text-sm">15 min</span>
											<div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-orange-200">
												<Timer className="h-4 w-4 text-orange-600" />
												<span className="font-bold text-base sm:text-lg text-orange-600">
													{settings.duration}
													<span className="text-sm ml-1">min</span>
												</span>
											</div>
											<span className="text-xs sm:text-sm">120 min</span>
										</div>
									</div>
								</div>

								<Separator />

								{/* Questions, Difficulty, and Topic */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
									{/* Question Count */}
									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
											<Hash className="h-4 w-4 text-blue-600" />
											Questions
										</Label>
										<Select
											value={settings.questionCount.toString()}
											onValueChange={(value) =>
												updateSettings({
													questionCount: Number.parseInt(value),
												})
											}>
											<SelectTrigger className="h-12 w-full bg-white border-gray-300 hover:border-blue-400 transition-colors">
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

									{/* Difficulty */}
									<div className="space-y-3">
										<Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
											<Zap className="h-4 w-4 text-purple-600" />
											Difficulty
										</Label>
										<Select
											value={settings.difficulty}
											onValueChange={(value) =>
												updateSettings({ difficulty: value })
											}>
											<SelectTrigger className="h-12 w-full bg-white border-gray-300 hover:border-purple-400 transition-colors">
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Easy">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 bg-green-500 rounded-full"></div>
														Easy
													</div>
												</SelectItem>
												<SelectItem value="Medium">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
														Medium
													</div>
												</SelectItem>
												<SelectItem value="Hard">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 bg-red-500 rounded-full"></div>
														Hard
													</div>
												</SelectItem>
												<SelectItem value="Mixed">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
														Mixed
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Topic Selection */}
								<div className="space-y-4 ">
									<Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
										<BookOpen className="h-4 w-4 text-indigo-600" />
										Topic Selection
										<span className="text-sm text-gray-500 font-normal">
											(
											{settings.source === "ai"
												? "Choose category or enter custom topic"
												: "Required for database questions"}
											)
										</span>
									</Label>

									{/* Category Selection */}
									<Select
										value={
											settings.categories[0] ||
											(settings.source === "ai" && settings.customTopic?.trim()
												? "custom-topic"
												: undefined)
										}
										onValueChange={(value) => {
											if (value === "custom-topic") {
												updateSettings({
													categories: [],
													customTopic: settings.customTopic || "", // Keep existing custom topic
												});
											} else if (
												value &&
												value !== "loading" &&
												value !== "no-categories"
											) {
												updateSettings({
													categories: [value],
													customTopic: "", // Clear custom topic if category selected
												});
											}
										}}>
										<SelectTrigger className="h-12 w-full bg-white border-gray-300 hover:border-indigo-400 transition-colors">
											<SelectValue
												placeholder={
													categoryLoading
														? "Loading categories..."
														: "Select a category"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{categoryLoading ? (
												<SelectItem value="loading" disabled>
													<span className="text-gray-500">
														Loading categories...
													</span>
												</SelectItem>
											) : categoryData && categoryData.length > 0 ? (
												[
													...categoryData.map(
														(category: { _id: string; name: string }) => (
															<SelectItem
																key={category._id}
																value={category._id}>
																<div className="flex items-center gap-2">
																	<div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
																	<span className="truncate">
																		{category.name}
																	</span>
																</div>
															</SelectItem>
														)
													),
													settings.source === "ai" && (
														<SelectItem
															key="custom"
															value="custom-topic"
															className="border-t">
															<div className="flex items-center gap-2">
																<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
																<span className="text-purple-700 font-medium">
																	✨ Custom Topic
																</span>
															</div>
														</SelectItem>
													),
												]
											) : (
												<SelectItem value="no-categories" disabled>
													<span className="text-gray-500">
														No categories available
													</span>
												</SelectItem>
											)}
										</SelectContent>
									</Select>

									{/* Custom Topic Input */}
									{settings.source === "ai" &&
										settings.categories.length === 0 && (
											<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border border-purple-200 animate-in slide-in-from-top duration-300">
												<Label className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
													<Sparkles className="h-4 w-4" />
													Enter Custom Topic
												</Label>
												<input
													type="text"
													placeholder="e.g., Machine Learning, Blockchain, System Design..."
													value={settings.customTopic || ""}
													onChange={(e) =>
														updateSettings({ customTopic: e.target.value })
													}
													className="w-full h-12 px-4 text-sm sm:text-base border border-purple-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400 transition-all duration-200"
												/>
												<p className="text-xs sm:text-sm text-purple-600 mt-3 flex items-center gap-1">
													<Info className="h-3 w-3 flex-shrink-0" />
													AI will generate questions on any topic you specify
												</p>
											</div>
										)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Summary Panel */}
					<div className="space-y-6 order-1 lg:order-2">
						{/* Session Summary */}
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:sticky lg:top-24">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-3 text-xl">
									<div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-md">
										<Trophy className="h-5 w-5 text-white" />
									</div>
									Session Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 pt-0">
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
										<span className="text-sm font-medium text-gray-700">
											Duration
										</span>
										<Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1">
											{settings.duration} min
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
										<span className="text-sm font-medium text-gray-700">
											Questions
										</span>
										<Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">
											{settings.questionCount}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
										<span className="text-sm font-medium text-gray-700">
											Difficulty
										</span>
										<Badge className="bg-purple-100 text-purple-700 text-sm px-3 py-1">
											{settings.difficulty}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
										<span className="text-sm font-medium text-gray-700">
											Source
										</span>
										<Badge className="bg-orange-100 text-orange-700 text-sm px-3 py-1">
											{settings.source === "ai"
												? "🧠 AI Generated"
												: "📚 Database"}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
										<span className="text-sm font-medium text-gray-700">
											Topic
										</span>
										<Badge className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 max-w-32">
											<span className="truncate">
												{settings.customTopic?.trim()
													? `✨ ${settings.customTopic}`
													: settings.categories.length > 0 && categoryData
													? categoryData
															.filter((cat) =>
																settings.categories.includes(cat._id)
															)
															.map((cat) => cat.name)
															.join(", ")
													: "None Selected"}
											</span>
										</Badge>
									</div>
								</div>

								<Separator />

								{/* Smart Time Distribution */}
								<div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
									<div className="flex items-start gap-3">
										<Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
										<div>
											<h4 className="font-semibold text-green-900 mb-2 text-base">
												🧠 Smart Time Distribution
											</h4>
											<div className="text-sm text-green-800 space-y-1">
												<p>
													• <strong>Total Session:</strong> {settings.duration}{" "}
													minutes ({settings.duration * 60} seconds)
												</p>
												<p>
													• <strong>Questions:</strong> {settings.questionCount}{" "}
													questions
												</p>
												<p>
													• <strong>Average:</strong>{" "}
													{Math.floor(
														(settings.duration * 60) /
															settings.questionCount /
															60
													)}
													:
													{String(
														Math.floor(
															(settings.duration * 60) / settings.questionCount
														) % 60
													).padStart(2, "0")}{" "}
													per question
												</p>
												<p className="hidden sm:block">
													• AI adjusts time based on complexity while
													maintaining total
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Tips */}
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
									<div className="flex items-start gap-3">
										<Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
										<div>
											<h4 className="font-semibold text-blue-900 mb-2 text-base">
												Pro Tips
											</h4>
											<ul className="text-sm text-blue-800 space-y-1">
												<li>• Think out loud during practice</li>
												<li>• Focus on problem-solving approach</li>
												<li>• Use the timer effectively</li>
												<li>• Take breaks when needed</li>
											</ul>
										</div>
									</div>
								</div>

								{/* Start Button */}
								<div className="pt-4">
									<CustomButton
										onClick={handleStartClick}
										isLoading={creating}
										className="w-full gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
										disabled={!isReadyToStart || creating}
										content={
											<div className="flex items-center justify-center gap-3">
												<Play className="h-5 w-5" />
												<span>
													{creating
														? "Starting Session..."
														: "Start Practice Session"}
												</span>
												<ChevronRight className="h-4 w-4" />
											</div>
										}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Loading State */}
						{creating && (
							<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-in fade-in duration-500">
								<CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
									<div className="animate-pulse">
										<HashLoader size={28} color="#10b981" />
									</div>
									<div className="text-center mt-6">
										<p className="text-green-700 font-medium text-base sm:text-lg">
											{settings.source === "ai"
												? "🧠 AI generating questions & calculating time"
												: "Creating your session"}
										</p>
										{settings.source === "ai" && (
											<p className="text-green-600 text-sm sm:text-base mt-2 max-w-xs mx-auto">
												{settings.customTopic?.trim()
													? `Creating questions for "${settings.customTopic}"`
													: "Generating questions with optimal time allocation"}
											</p>
										)}
										<div className="mt-4 flex justify-center">
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
													style={{ animationDelay: "0.1s" }}></div>
												<div
													className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
													style={{ animationDelay: "0.2s" }}></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
