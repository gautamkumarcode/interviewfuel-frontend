"use client";
import { Subcategory } from "@/types/interfaces/category/category-type";
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

type FrontedCardProps = {
	frontedTopics: Subcategory[];
};

const FrontedCard: React.FC<FrontedCardProps> = ({ frontedTopics }) => {
	const router = useRouter();

	return (
		<div className="p-4 w-full max-w-7xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{frontedTopics.map((data, index) => (
					<div
						key={index}
						className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
						onClick={() => router.push(`/questions/${data.slug}`)}>
						{/* Card Header with Gradient */}
						<div className="relative h-40 bg-gradient-to-r from-[#19c862] to-[#0a8c3d] overflow-hidden">
							<div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
							<div className="relative p-6 h-full flex flex-col justify-between">
								<div className="flex justify-between items-start">
									<div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
										<FileText className="h-6 w-6 text-white" />
									</div>
									<span className="text-white/80 text-sm font-medium">
										{data.stats.questionCount} Questions
									</span>
								</div>
								<h3 className="text-2xl font-bold text-white mt-2">
									{data.name}
								</h3>
							</div>
						</div>

						{/* Card Content */}
						<div className="p-6">
							<p className="text-gray-600 mb-6 line-clamp-2 h-12">
								{data.description}
							</p>

							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center text-sm text-gray-500">
									<BarChart3 className="h-4 w-4 mr-1" />
									{data.stats.totalViews} views
								</div>
								<div className="flex items-center text-sm text-gray-500">
									<Users className="h-4 w-4 mr-1" />
									234 studying
								</div>
							</div>

							<div className="flex items-center justify-between pt-4 border-t border-gray-100">
								<span className="text-sm font-medium text-[#19c862] group-hover:text-[#0a8c3d] transition-colors duration-300">
									Start practicing
								</span>
								<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
									<ArrowRight className="h-4 w-4 text-[#19c862]" />
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
