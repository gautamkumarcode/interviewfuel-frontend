import HashLoader from "../loader/Loader";

interface PageLoaderProps {
	loading: boolean;
	error?: string | null;
	children: React.ReactNode;
	loadingText?: string;
	minHeight?: string;
}

export const PageLoader = ({
	loading,
	error,
	children,
	loadingText = "Loading...",
	minHeight = "50vh",
}: PageLoaderProps) => {
	if (loading) {
		return (
			<div
				className={`flex flex-col items-center justify-center`}
				style={{ minHeight }}>
				<div className="text-center">
					<HashLoader size={40} color="#3b82f6" />
					<p className="mt-4 text-gray-600 text-sm">{loadingText}</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className={`flex flex-col items-center justify-center`}
				style={{ minHeight }}>
				<div className="text-center text-red-600">
					<div className="text-4xl mb-4">⚠️</div>
					<h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
					<p className="text-sm text-gray-600 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

interface ApiStateLoaderProps {
	isLoading: boolean;
	isFetching?: boolean;
	error?: any;
	children: React.ReactNode;
	loadingText?: string;
	skeletonCount?: number;
	renderSkeleton?: () => React.ReactNode;
}

export const ApiStateLoader = ({
	isLoading,
	isFetching = false,
	error,
	children,
	loadingText = "Loading...",
	skeletonCount = 3,
	renderSkeleton,
}: ApiStateLoaderProps) => {
	if (isLoading) {
		if (renderSkeleton) {
			return (
				<div className="space-y-4">
					{Array.from({ length: skeletonCount }).map((_, index) => (
						<div key={index}>{renderSkeleton()}</div>
					))}
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<HashLoader size={32} color="#3b82f6" />
					<p className="mt-3 text-gray-600 text-sm">{loadingText}</p>
				</div>
			</div>
		);
	}

	if (error) {
		const errorMessage =
			error?.response?.data?.message ||
			error?.message ||
			"Something went wrong";
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center text-red-600">
					<div className="text-2xl mb-2">❌</div>
					<p className="text-sm">{errorMessage}</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`${
				isFetching ? "opacity-75" : ""
			} transition-opacity duration-200`}>
			{children}
			{isFetching && (
				<div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
					<HashLoader size={16} color="#ffffff" />
					Updating...
				</div>
			)}
		</div>
	);
};
