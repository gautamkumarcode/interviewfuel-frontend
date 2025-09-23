"use client";

import HashLoader from "@/components/custom/loader/Loader";
import LandingInput from "@/components/custom/searchBox/Search";
import { useClusterData } from "@/context/clusterData-context";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import FrontedCard from "./components/fronted/FrontedCard";

const LandingPage = () => {
	const { categoryData, categoryLoading } = useClusterData();
	const categories = categoryData || [];

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			{/* Hero Section */}
			<section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-r from-[#19c862]/10 to-[#0a8c3d]/10">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-white to-transparent"></div>
					<div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent"></div>
				</div>

				<div className="container mx-auto px-4 relative">
					<div className="flex flex-col items-center text-center max-w-3xl mx-auto">
						<div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
							<TrendingUp className="mr-2 h-4 w-4" />
							Ace your technical interviews
						</div>

						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
							Prepare for your{" "}
							<span className="text-[#19c862]">tech interview</span>
						</h1>

						<p className="text-xl text-gray-600 mb-10 max-w-2xl">
							Master your next technical interview with curated questions,
							community insights, and personalized practice.
						</p>

						<div className="w-full max-w-2xl mb-12">
							<LandingInput />
						</div>

						<div className="flex flex-wrap justify-center gap-6 text-gray-600">
							<div className="flex items-center">
								<Users className="h-5 w-5 mr-2 text-[#19c862]" />
								<span>100,000+ developers</span>
							</div>
							<div className="flex items-center">
								<BookOpen className="h-5 w-5 mr-2 text-[#19c862]" />
								<span>10,000+ questions</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-16 md:py-20 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-14">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Explore Interview Topics
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Browse through our comprehensive collection of technical topics to
							prepare for your next interview.
						</p>
					</div>

					{!categoryLoading ? (
						<FrontedCard frontedTopics={categories} />
					) : (
						<div className="flex items-center justify-center py-20">
							<HashLoader color="#19c862" />
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default LandingPage;