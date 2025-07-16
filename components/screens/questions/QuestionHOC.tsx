"use client";

import { useSearchParams } from "next/navigation";
import Questions from "./Questions";

// const QuestionPage = dynamic(() => import("./Questions"), {
// 	ssr: false, // Client-only
// });

export default function QuestionsPageWrapper() {
	const searchParams = useSearchParams();
	const category = searchParams.get("category");

	return <Questions category={category || "all"} />;
}
