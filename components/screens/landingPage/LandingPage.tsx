"use client";

import LandingInput from "@/components/custom/searchBox/Search";

import FrontedCard from "./components/fronted/FrontedCard";

const LandingPage = () => {
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

			<FrontedCard />
		</div>
	);
};

export default LandingPage;
