"use client";
import { CategoryType } from "@/services/categories/category-services";
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

type FrontedCardProps = {
	frontedTopics: CategoryType[];
};

const FrontedCard: React.FC<FrontedCardProps> = ({ frontedTopics }) => {
	const router = useRouter();

	return (
		<div className="w-full max-w-7xl mx-auto">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
				{frontedTopics.map((data, index) => (
					<div
						key={index}
						className="group bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 cursor-pointer"
						onClick={() => router.push(`/questions/${data.slug}`)}>
						{/* Card Header with Gradient */}
						<div className="relative h-24 sm:h-36 md:h-40 bg-gradient-to-r from-[#19c862] to-[#0a8c3d] overflow-hidden">
							<div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
							<div className="relative p-3 sm:p-6 h-full flex flex-col justify-between">
								<div className="flex justify-between items-start">
									<div className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
										<FileText className="h-3 w-3 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
									</div>
									<span className="text-white/80 text-xs font-medium">
										{data.stats.questionCount} Qs
									</span>
								</div>
								<h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white mt-1 line-clamp-2">
									{data.name}
								</h3>
							</div>
						</div>

						{/* Card Content */}
						<div className="p-3 sm:p-6">
							<p className="text-gray-600 text-xs sm:text-base md:mb-4 lg:mb-6 line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem]">
								{data.description}
							</p>

							<div className="flex items-center justify-between mb-2 sm:mb-4">
								<div className="flex items-center text-xs text-gray-500">
									<BarChart3 className="h-3 w-3 mr-1" />
									{data.stats.totalViews}
								</div>
								<div className="flex items-center text-xs text-gray-500">
									<Users className="h-3 w-3 mr-1" />
									234
								</div>
							</div>

							<div className="flex items-center justify-between  sm:pt-4 border-t border-gray-100">
								<span className="text-xs font-medium text-[#19c862] group-hover:text-[#0a8c3d] transition-colors duration-300">
									Start
								</span>
								<div className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
									<ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 text-[#19c862]" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FrontedCard;
