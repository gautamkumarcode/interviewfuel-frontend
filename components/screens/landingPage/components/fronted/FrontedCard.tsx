"use client";
import { CustomButton } from "@/components/custom/CustomButton/CustomButton";
import { Subcategory } from "@/types/interfaces/category/category-type";
import { Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

type FrontedCardProps = {
	frontedTopics: Subcategory[];
};
const FrontedCard: React.FC<FrontedCardProps> = ({ frontedTopics }) => {
	const router = useRouter();
	
	return (
		<div className="p-5 w-[90vw] mx-auto mt-10">
			<h2 className="text-3xl font-semibold text-center mb-6"></h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{frontedTopics.map((data, index) => (
					<div
						key={index}
						onClick={() => router.push(`/questions/${data.slug}`)}
						className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
						<div className="flex flex-col justify-center text-3xl font-semibold text-white pl-5 h-36 bg-[#5bef99]">
							{data.name}
						</div>

						<div className="p-4 space-y-4">
							<p>{data.description}</p>

							<div className="flex items-center justify-between">
								<p className="text-sm text-gray-500">
									{data.stats.questionCount} Questions
								</p>
							</div>

							<div className="flex items-center justify-between">
								<p className="flex items-center gap-1 text-sm text-gray-700">
									<Users className="h-4 w-4" />
									{data.stats.totalViews} <span>views</span>
								</p>

								<CustomButton
									content="Explore"
									onClick={() => router.push(`/questions/${data.slug}`)}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FrontedCard;
