import HashLoader from "../loader/Loader";

interface LoadingSpinnerProps {
	size?: number;
	color?: string;
	className?: string;
	text?: string;
}

export const LoadingSpinner = ({
	size = 20,
	color = "#3b82f6",
	className = "",
	text,
}: LoadingSpinnerProps) => {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<HashLoader size={size} color={color} />
			{text && <span className="text-sm text-gray-600">{text}</span>}
		</div>
	);
};

export const LoadingOverlay = ({ text = "Loading..." }: { text?: string }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 flex items-center gap-3">
				<HashLoader size={24} color="#3b82f6" />
				<span className="text-gray-700">{text}</span>
			</div>
		</div>
	);
};
