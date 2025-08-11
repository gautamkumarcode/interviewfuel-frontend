"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";

interface PauseOverlayProps {
	isPaused: boolean;
	onResume: () => void;
}

export function PauseOverlay({ isPaused, onResume }: PauseOverlayProps) {
	if (!isPaused) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-96">
				<CardContent className="p-6 text-center">
					<Pause className="h-12 w-12 mx-auto mb-4 text-gray-400" />
					<h3 className="text-lg font-semibold mb-2">Session Paused</h3>
					<p className="text-gray-600 mb-4">
						Take your time. Click resume when you&lsquo;re ready to continue.
					</p>
					<Button onClick={onResume} className="gap-2">
						<Play className="h-4 w-4" />
						Resume Session
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
