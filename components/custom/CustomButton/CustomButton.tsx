import HashLoader from "../loader/Loader";

export const CustomButton = ({
	content,
	onClick,
	className = "",
	disabled = false,
	isLoading = false,
	variant = "primary",
}: {
	content: string | React.ReactNode;
	onClick?: () => void;
	className?: string;
	isLoading?: boolean;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "outline";
}) => {
	const getButtonStyles = () => {
		const baseStyles =
			"px-4 py-2 rounded transition-colors flex justify-center items-center cursor-pointer font-medium";

		switch (variant) {
			case "secondary":
				return `${baseStyles} bg-gray-500 text-white hover:bg-gray-600`;
			case "outline":
				return `${baseStyles} border border-blue-500 text-blue-500 hover:bg-blue-50`;
			default:
				return `${baseStyles} bg-blue-500 text-white hover:bg-blue-600`;
		}
	};

	const getLoaderColor = () => {
		switch (variant) {
			case "secondary":
				return "#ffffff";
			case "outline":
				return "#3b82f6";
			default:
				return "#ffffff";
		}
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled || isLoading}
			className={`${getButtonStyles()} ${
				disabled || isLoading ? "opacity-75 cursor-not-allowed" : ""
			} ${className}`}>
			{isLoading ? <HashLoader color={getLoaderColor()} size={20} /> : content}
		</button>
	);
};
