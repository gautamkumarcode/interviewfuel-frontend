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
						className="group bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
						onClick={() => router.push(`/questions/${data.slug}`)}>
						{/* Card Header with Gradient */}
						<div className="relative h-28 sm:h-36 md:h-40 bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden">
							<div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
							<div className="relative p-4 sm:p-6 h-full flex flex-col justify-between">
								<div className="flex justify-between items-start">
									<div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
										<FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
									</div>
									<span className="text-white/90 text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
										{data.stats.questionCount} Qs
									</span>
								</div>
								<h3 className="text-base sm:text-xl md:text-2xl font-bold text-white line-clamp-2 drop-shadow-sm">
									{data.name}
								</h3>
							</div>
						</div>

						{/* Card Content */}
						<div className="p-4 sm:p-6">
							<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
								{data.description}
							</p>

							<div className="flex items-center justify-between mb-3 sm:mb-4">
								<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
									<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
									{data.stats.totalViews}
								</div>
								<div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
									<Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
									234
								</div>
							</div>

							<div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
								<span className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
									Start Practice
								</span>
								<div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-all duration-300 group-hover:scale-110">
									<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 group-hover:translate-x-0.5 transition-transform" />
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
