"use client";

import LandingInput from "@/components/custom/searchBox/Search";

import { categoryService } from "@/services/category/categories-services";
import { AxiosResponseTypeWithPagination } from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { useQuery } from "react-query";
import FrontedCard from "./components/fronted/FrontedCard";

const LandingPage = () => {

	const { data, isLoading } = useQuery<
			AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
		>(["allcategories"], () => categoryService.getAllCategories());
	
	
		const categories = data?.data?.results || [];
		const frontedTopics = categories.find(
			(category) => category.name === "Frontend"
		)?.subcategories || [];
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

			<FrontedCard frontedTopics={frontedTopics} />
		</div>
	);
};

export default LandingPage;
