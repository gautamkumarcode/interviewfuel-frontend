"use client";

import LandingInput from "@/components/custom/searchBox/Search";

import HashLoader from "@/components/custom/loader/Loader";
import { useClusterData } from "@/context/clusterData-context";
import FrontedCard from "./components/fronted/FrontedCard";

const LandingPage = () => {
	const { categoryData, categoryLoading } = useClusterData();

	const categories = categoryData || [];
	
	return (
		<div className=" h-screen">
			<header className="flex justify-center items-center h-[40vh] ">
				<div className="flex flex-col items-center justify-center gap-10">
					<h1 className="text-4xl font-semibold">
						Hello,Welcome to{" "}
						<span className="text-[#19c862]">InterView Fuel</span>
					</h1>
					<LandingInput />
				</div>
			</header>

			{!categoryLoading ? (
				<FrontedCard frontedTopics={categories} />
			) : (
				<div className="flex items-center justify-center h-[60vh]">
					<HashLoader color="#19c862" />
				</div>
			)}
		</div>
	);
};

export default LandingPage;
