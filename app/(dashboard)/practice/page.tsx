"use client";

import PracticeModeHOC from "@/components/screens/practicemode/PracticeModeHOC";

export default function PracticePage() {
	return <PracticeModeHOC onExit={() => window.history.back()} />;
}
