"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Clock,
	Coffee,
	Lightbulb,
	Pause,
	Play,
	RefreshCw,
	Target,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PauseOverlayProps {
	isPaused: boolean;
	onResume: () => void;
}

export function PauseOverlay({ isPaused, onResume }: PauseOverlayProps) {
	const [pausedTime, setPausedTime] = useState(0);

	useEffect(() => {
		if (isPaused) {
			const interval = setInterval(() => {
				setPausedTime((prev) => prev + 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setPausedTime(0);
		}
	}, [isPaused]);

	if (!isPaused) return null;

	const formatPausedTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const tips = [
		"Take deep breaths and stay calm",
		"Review your approach before continuing",
		"Consider alternative solutions",
		"Think about edge cases you might have missed",
		"Organize your thoughts and structure your answer",
	];

	const randomTip = tips[Math.floor(Math.random() * tips.length)];

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
				<CardHeader className="text-center pb-4">
					<div className="flex justify-center mb-4">
						<div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
							<Pause className="h-8 w-8 text-white" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900 mb-2">
						Session Paused
					</CardTitle>
					<p className="text-gray-600">
						Take a moment to recharge. Your timer is stopped.
					</p>
				</CardHeader>

				<Separator />

				<CardContent className="pt-6 space-y-6">
					{/* Pause Duration */}
					<div className="text-center">
						<Badge
							variant="outline"
							className="gap-2 bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
							<Clock className="h-4 w-4" />
							Paused for {formatPausedTime(pausedTime)}
						</Badge>
					</div>

					{/* Quick Tip */}
					<div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
						<div className="flex items-start gap-3">
							<Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-yellow-900 mb-1">
									Quick Tip
								</h4>
								<p className="text-sm text-yellow-800">{randomTip}</p>
							</div>
						</div>
					</div>

					{/* Break Activities */}
					<div className="space-y-3">
						<h4 className="font-medium text-gray-700 flex items-center gap-2">
							<Coffee className="h-4 w-4 text-brown-600" />
							Use this break to:
						</h4>
						<div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
							<div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
								<Target className="h-4 w-4 text-blue-600" />
								<span>Review your current approach</span>
							</div>
							<div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
								<RefreshCw className="h-4 w-4 text-green-600" />
								<span>Consider alternative solutions</span>
							</div>
							<div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
								<Coffee className="h-4 w-4 text-orange-600" />
								<span>Take a mental break</span>
							</div>
						</div>
					</div>

					{/* Resume Button */}
					<div className="text-center pt-4">
						<Button
							onClick={onResume}
							size="lg"
							className="gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
							<Play className="h-5 w-5" />
							Resume Session
						</Button>
						<p className="text-xs text-gray-500 mt-2">
							Your progress is automatically saved
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
