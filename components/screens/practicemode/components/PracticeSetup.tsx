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
		<div className="min-h-screen  p-4">
			{/* Navigation Header */}
			<div className=" mx-auto">
				<div className="flex  justify-between">
					<Button
						variant="ghost"
						className="gap-2 hover:bg-white/60 backdrop-blur-sm">
						<ChevronLeft className="h-4 w-4" />
						Back to Questions
					</Button>
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
							Practice Session Setup
						</h1>
					</div>

					<div className="flex  gap-3">
						<Link href="/practice/history">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
								<History className="h-4 w-4" />
								History
							</Button>
						</Link>
						{/* <Link href="/practice/analytics">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
								<BarChart3 className="h-4 w-4" />
								Analytics
							</Button>
						</Link> */}
					</div>
				</div>

				{/* Hero Section */}

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Settings Panel */}
					<div className="lg:col-span-2 space-y-6">
						{/* Question Source Selection */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-3 text-xl">
									<div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
										<Sparkles className="h-5 w-5 text-white" />
									</div>
									Question Source
								</CardTitle>
								<p className="text-gray-600">
									Choose how your questions will be generated
								</p>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div
										className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
											settings.source === "ai"
												? "border-blue-500 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
										onClick={() => updateSettings({ source: "ai" })}>
										<div className="flex items-center gap-3 mb-2">
											<Brain className="h-6 w-6 text-blue-600" />
											<span className="font-semibold">AI Generated</span>
											<Badge
												variant="secondary"
												className="bg-blue-100 text-blue-700">
												Smart
											</Badge>
										</div>
										<p className="text-sm text-gray-600">
											Personalized questions tailored to your skill level and
											preferences
										</p>
									</div>
									<div
										className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
											settings.source === "db"
												? "border-green-500 bg-green-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
										onClick={() => updateSettings({ source: "db" })}>
										<div className="flex items-center gap-3 mb-2">
											<Database className="h-6 w-6 text-green-600" />
											<span className="font-semibold">Database</span>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-700">
												Curated
											</Badge>
										</div>
										<p className="text-sm text-gray-600">
											Hand-picked questions from our comprehensive database
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Session Configuration */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent className="space-y-8">
								{/* Duration Slider */}
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Clock className="h-5 w-5 text-orange-600" />
										<Label className="text-base font-medium">
											Session Duration
										</Label>
									</div>
									<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
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
										<div className="flex justify-between text-sm text-gray-500 mt-3">
											<span>15 min</span>
											<div className="flex items-center gap-2">
												<Timer className="h-4 w-4" />
												<span className="font-bold text-lg text-orange-600">
													{settings.duration} minutes
												</span>
											</div>
											<span>120 min</span>
										</div>
									</div>
								</div>

								<Separator />

								{/* Questions and Difficulty */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<Hash className="h-5 w-5 text-blue-600" />
											<Label className="text-base font-medium">
												Number of Questions
											</Label>
										</div>
										<Select
											value={settings.questionCount.toString()}
											onValueChange={(value) =>
												updateSettings({
													questionCount: Number.parseInt(value),
												})
											}>
											<SelectTrigger className="h-12 bg-white/80">
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

									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<Zap className="h-5 w-5 text-purple-600" />
											<Label className="text-base font-medium">
												Difficulty Level
											</Label>
										</div>
										<Select
											value={settings.difficulty}
											onValueChange={(value) =>
												updateSettings({ difficulty: value })
											}>
											<SelectTrigger className="h-12 bg-white/80">
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Easy">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														Easy Only
													</div>
												</SelectItem>
												<SelectItem value="Medium">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
														Medium Only
													</div>
												</SelectItem>
												<SelectItem value="Hard">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-red-500 rounded-full"></div>
														Hard Only
													</div>
												</SelectItem>
												<SelectItem value="Mixed">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
														Mixed Difficulty
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<BookOpen className="h-5 w-5 text-indigo-600" />
											<Label className="text-base font-medium">Category</Label>
										</div>
										<Select
											value={settings.categories[0] || ""}
											onValueChange={(value) =>
												updateSettings({ categories: [value] })
											}>
											<SelectTrigger className="h-12 bg-white/80">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categoryData?.map(
													(category: { _id: string; name: string }) => (
														<SelectItem key={category._id} value={category._id}>
															<div className="flex items-center gap-2">
																<div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
																{category.name}
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
					<div className="space-y-6">
						{/* Session Summary */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl sticky top-4">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<Trophy className="h-5 w-5 text-yellow-600" />
									Session Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Duration
										</span>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-700">
											{settings.duration} min
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Questions
										</span>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700">
											{settings.questionCount}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Difficulty
										</span>
										<Badge
											variant="secondary"
											className="bg-purple-100 text-purple-700">
											{settings.difficulty}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Source
										</span>
										<Badge
											variant="secondary"
											className="bg-orange-100 text-orange-700">
											{settings.source === "ai" ? "AI Generated" : "Database"}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Category
										</span>
										<Badge
											variant="secondary"
											className="bg-orange-100 text-orange-700">
											{categoryData
												?.filter((cat) => settings.categories.includes(cat._id))
												.map((cat) => (
													<span key={cat._id}>{cat.name}</span>
												))}
										</Badge>
									</div>
								</div>

								<Separator />

								{/* Tips */}
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
									<div className="flex items-start gap-3">
										<Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
										<div>
											<h4 className="font-semibold text-blue-900 mb-2">
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
										className="w-full gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
										disabled={!isReadyToStart || creating}
										content={
											<div className="flex items-center gap-3">
												<Play className="h-5 w-5" />
												{creating
													? "Starting Session..."
													: "Start Practice Session"}
												<ChevronRight className="h-4 w-4" />
											</div>
										}
									/>
								</div>
							</CardContent>
						</Card>

						{creating && (
							<div className="flex gap-2   items-center justify-center mt-6 p-4 bg-white/30 backdrop-blur-sm border-white/20 rounded-xl shadow-md top-1/2 left-1/2 absolute ">
								<HashLoader size={20} color="#008236" />
								<p className=" text-green-700 animate-pulse">
									Creating your session{" "}
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
