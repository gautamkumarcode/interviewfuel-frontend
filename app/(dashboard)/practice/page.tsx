"use client";

import { AuthGuard } from "@/components/common";
import PracticeModeHOC from "@/components/screens/practicemode/PracticeModeHOC";

const PracticePage: React.FC = () => {
	return (
		<AuthGuard redirectMessage="Sign in to start practicing interview questions">
			<PracticeModeHOC />
		</AuthGuard>
	);
};

export default PracticePage;




