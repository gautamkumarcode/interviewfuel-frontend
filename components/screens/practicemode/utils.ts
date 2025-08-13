export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
};

export const getDifficultyColor = (difficulty: string): string => {
	switch (difficulty) {
		case "Easy":
			return "bg-green-100 text-green-800 border-green-200";
		case "Medium":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "Hard":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};
