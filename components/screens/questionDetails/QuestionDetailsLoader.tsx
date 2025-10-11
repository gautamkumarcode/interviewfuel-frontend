"use client";

import HashLoader from "@/components/custom/loader/Loader";

export const QuestionDetailsLoader = () => {
	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
			<div className="text-center">
				<HashLoader size={50} color="#3b82f6" />
				<p className="mt-6 text-gray-600 text-lg font-medium">
					Loading question details...
				</p>
				<p className="mt-2 text-gray-500 text-sm">
					Please wait while we fetch the information
				</p>
			</div>
		</div>
	);
};