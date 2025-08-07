"use client";

import HashLoader from "@/components/custom/loader/Loader";
import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { questionService } from "@/services/questions/question-services";
import {
  AxiosErrorResponseType,
  AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { ChevronRight, Clock, Star, TrendingUp, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useQuery, useQueryClient } from "react-query";

export default function Questions() {
  const params = useSearchParams();
  const category = params?.get("category");
  const router = useRouter();

  const queryClient = useQueryClient();

  const decodedCategory = decodeURIComponent((category as string) || "")
    .trim()
    .toLowerCase();

  const cachedCategories = queryClient.getQueryData<
    AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
  >(["allcategories"]);

  const categoryList = cachedCategories?.data?.results ?? [];

  let matchedSubcategory = null;

  for (const cat of categoryList) {
    const sub = cat.subcategories?.find(
      (sub) => sub.slug.toLowerCase() === decodedCategory
    );
    if (sub) {
      matchedSubcategory = sub;
      break;
    }
  }

	const categoryId = matchedSubcategory?._id;
	const categoryName = matchedSubcategory?.name ?? "All";
	const { data, isLoading, isFetching, error } = useQuery<
		AxiosResponseTypeWithPagination<GetAllQuestionsResponseType[]>,
		AxiosError<AxiosErrorResponseType>
	>(
		["allquestions", categoryId],
		() => questionService.getAllQuestions(categoryId),
		{
			staleTime: 1000 * 60 * 5,
			cacheTime: 1000 * 60 * 10,
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
					return false;
				}
				return failureCount < 2;
			},
		}
	);

  const filteredQuestions = data?.data?.results ?? [];

	// Loading skeleton component
	const QuestionSkeleton = () => (
		<Card className="border-gray-200">
			<CardContent className="p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div className="flex gap-2 mb-3">
							<div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
						</div>
						<div className="flex items-center gap-4">
							<div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>
					<div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</CardContent>
		</Card>
	);

	const getDifficultyColor = (difficulty: string) => {
		const colors: Record<string, string> = {
			Easy: "bg-green-100 text-green-800 border-green-200",
			Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
			Hard: "bg-red-100 text-red-800 border-red-200",
		};
		return colors[difficulty] || "bg-gray-100 text-gray-800 border-gray-200";
	};

  const handleCardClick = (question: GetAllQuestionsResponseType) => {
    const questionCategory =
      question.category?.name?.toLowerCase() || "general";

    router.push(`/questions/${questionCategory}/${question.slug}`);
  };

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					{categoryName} Questions
					{isFetching && !isLoading && (
						<span className="ml-2 text-sm text-blue-600 font-normal">
							Updating...
						</span>
					)}
				</h1>
				<p className="text-gray-600">
					Master {categoryName} concepts with targeted practice questions
				</p>
			</div>

      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push("/practice")}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Clock className="h-4 w-4" />
          Practice {categoryName}
        </Button>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={() => router.push("/analytics")}
        >
          <TrendingUp className="h-4 w-4" />
          View Progress
        </Button>
      </div>

			<ApiStateLoader
				isLoading={isLoading}
				isFetching={isFetching}
				error={error}
				loadingText="Loading questions..."
				renderSkeleton={() => <QuestionSkeleton />}
				skeletonCount={5}
			>
				<div className="space-y-4">
					{filteredQuestions.length > 0 ? (
						filteredQuestions.map((question) => (
							<Card
								key={question.id}
								onClick={() => handleCardClick(question)}
								className="border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer group">
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<Badge
													className={getDifficultyColor(question.difficulty)}>
													{question.difficulty}
												</Badge>
												<Badge variant="outline" className="text-xs">
													{question.category?.name || "Uncategorized"}
												</Badge>
											</div>

											<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
												{question.title}
											</h3>

											<div className="flex flex-wrap gap-2 mb-3">
												{question.tags?.map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-xs bg-gray-100 text-gray-700">
														{tag}
													</Badge>
												))}
											</div>

											<div className="flex items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<Star className="h-4 w-4" />
													<span>{question.stats?.likes || 0}</span>
												</div>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													<span>{question.stats?.views || 0} views</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													<span>
														{new Date(question.createdAt).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>

										<ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card className="border-gray-200">
							<CardContent className="p-12 text-center">
								<div className="text-gray-500">
									<h3 className="text-lg font-medium mb-2">No questions found</h3>
									<p>
										{categoryName
											? `Questions for ${categoryName} will be available soon.`
											: "No questions available at the moment."}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</ApiStateLoader>
		</>
	);
}
