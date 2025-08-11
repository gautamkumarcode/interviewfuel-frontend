"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Square, Timer } from "lucide-react";
import { PracticeSession } from "../types";
import { formatTime } from "../utils";

interface SessionHeaderProps {
	session: PracticeSession;
	onPauseResume: () => void;
	onEndSession: () => void;
}

export function SessionHeader({
	session,
	onPauseResume,
	onEndSession,
}: SessionHeaderProps) {
	const progress =
		((session.currentQuestionIndex + 1) / session.questions.length) * 100;

	return (
		<div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4 mb-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Badge variant="outline" className="gap-1">
						<Timer className="h-3 w-3" />
						Question {session.currentQuestionIndex + 1} of{" "}
						{session.questions.length}
					</Badge>
					<Progress value={progress} className="w-32" />
				</div>

				<div className="flex items-center gap-4">
					<div
						className={`text-2xl font-mono font-bold ${
							session.timeRemaining < 300 ? "text-red-600" : "text-gray-900"
						}`}>
						{formatTime(session.timeRemaining)}
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onPauseResume}
							className="gap-2">
							{session.isPaused ? (
								<Play className="h-4 w-4" />
							) : (
								<Pause className="h-4 w-4" />
							)}
							{session.isPaused ? "Resume" : "Pause"}
						</Button>

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">
									<Square className="h-4 w-4" />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>End Practice Session?</DialogTitle>
									<DialogDescription>
										Are you sure you want to end this practice session? Your
										progress will be saved.
									</DialogDescription>
								</DialogHeader>
								<div className="flex justify-end gap-2">
									<Button variant="outline">Cancel</Button>
									<Button onClick={onEndSession} variant="destructive">
										End Session
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</div>
	);
}
