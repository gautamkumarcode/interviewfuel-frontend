"use client";

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
import { Slider } from "@/components/ui/slider";
import { useClusterData } from "@/context/clusterData-context";
import {
	AlertCircle,
	BarChart3,
	ChevronLeft,
	History,
	Play,
	Target,
} from "lucide-react";
import Link from "next/link";
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
	const { categoryData } = useClusterData();

	const updateSettings = (updates: Partial<PracticeSettings>) => {
		onSettingsChange({ ...settings, ...updates });
	};

	const handleStartClick = () => {
		if (settings.categories.length === 0) {
			alert("Please select a category");
			return;
		}
		onStartSession();
	};

	// Check if the form is in a ready state to start
	const isReadyToStart = settings.categories.length > 0;

	return (
		<div className="w-full mx-auto">
			{/* Navigation Header */}
			<div className="flex items-center justify-between mb-6">
				<Button variant="ghost" className="gap-2">
					<ChevronLeft className="h-4 w-4" />
					Back to Questions
				</Button>

				<div className="flex items-center gap-2">
					<Link href="/practice/history">
						<Button variant="outline" size="sm" className="gap-2">
							<History className="h-4 w-4" />
							History
						</Button>
					</Link>
					<Link href="/practice/analytics">
						<Button variant="outline" size="sm" className="gap-2">
							<BarChart3 className="h-4 w-4" />
							Analytics
						</Button>
					</Link>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl flex items-center gap-2">
						<Target className="h-6 w-6" />
						Practice Session Setup
					</CardTitle>
					<p className="text-gray-600">
						Configure your practice session to simulate real interview
						conditions
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Session Duration */}
						<div className="space-y-2">
							<Label htmlFor="duration">Session Duration (minutes)</Label>
							<div className="px-3">
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
								<div className="flex justify-between text-sm text-gray-500 mt-1">
									<span>15 min</span>
									<span className="font-medium">{settings.duration} min</span>
									<span>120 min</span>
								</div>
							</div>
						</div>

						{/* Number of Questions */}
						<div className="space-y-2">
							<Label htmlFor="questionCount">Number of Questions</Label>
							<Select
								value={settings.questionCount.toString()}
								onValueChange={(value) =>
									updateSettings({ questionCount: Number.parseInt(value) })
								}>
								<SelectTrigger>
									<SelectValue placeholder="Select number of questions" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3">3 Questions</SelectItem>
									<SelectItem value="5">5 Questions</SelectItem>
									<SelectItem value="10">10 Questions</SelectItem>
									<SelectItem value="15">15 Questions</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Difficulty Level */}
						<div className="space-y-2">
							<Label htmlFor="difficulty">Difficulty Level</Label>
							<Select
								value={settings.difficulty}
								onValueChange={(value) =>
									updateSettings({ difficulty: value })
								}>
								<SelectTrigger>
									<SelectValue placeholder="Select difficulty" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Easy">Easy Only</SelectItem>
									<SelectItem value="Medium">Medium Only</SelectItem>
									<SelectItem value="Hard">Hard Only</SelectItem>
									<SelectItem value="Mixed">Mixed Difficulty</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Category Dropdown */}
						<div className="space-y-2">
							<Label htmlFor="categories">Category</Label>
							<Select
								value={settings.categories[0] || ""}
								onValueChange={(value) =>
									updateSettings({ categories: [value] })
								}>
								<SelectTrigger>
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{categoryData?.map((category: any) => (
										<SelectItem key={category._id} value={category._id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
							<div>
								<h4 className="font-medium text-blue-900 mb-1">
									Practice Session Tips
								</h4>
								<ul className="text-sm text-blue-800 space-y-1">
									<li>• Treat this like a real interview - think out loud</li>
									<li>
										• Focus on problem-solving approach, not just the final
										answer
									</li>
									<li>• Use the timer to practice time management</li>
									<li>
										• You can pause if needed, but try to work continuously
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex justify-center">
						<Button
							onClick={handleStartClick}
							size="lg"
							className="gap-2 bg-green-600 hover:bg-green-700"
							disabled={!isReadyToStart}>
							<Play className="h-5 w-5" />
							Start Practice Session
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
