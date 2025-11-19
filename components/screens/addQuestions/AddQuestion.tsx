"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTheme } from "@/context/theme.context";
import { questionService } from "@/services/questions/question-services";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Code,
	FileText,
	Lightbulb,
	Save,
	Send,
	Settings2,
	Target,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { AddQuestionForm } from "./components/AddQuestionForm/AddQuestionForm";
import { questionSchema } from "./components/validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

const STEPS = [
	{
		id: 1,
		title: "Basic Info",
		description: "Question title, content and category",
		icon: FileText,
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: 2,
		title: "Details",
		description: "Tags, difficulty and time limit",
		icon: Settings2,
		color: "from-purple-500 to-pink-500",
	},
	{
		id: 3,
		title: "Answer",
		description: "Detailed answer explanation",
		icon: Target,
		color: "from-green-500 to-emerald-500",
	},
	{
		id: 4,
		title: "Solutions",
		description: "Code solutions and explanations",
		icon: Code,
		color: "from-orange-500 to-red-500",
	},
	{
		id: 5,
		title: "Additional",
		description: "Companies, hints and best practices",
		icon: Lightbulb,
		color: "from-indigo-500 to-purple-500",
	},
];

interface AddQuestionProps {
	questionId?: string;
}

const AddQuestion = ({ questionId }: AddQuestionProps) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [isDraft, setIsDraft] = useState(false);
	const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
	const router = useRouter();
	const { toast } = useTheme();

	const isEditMode = !!questionId;
	const totalSteps = STEPS.length;
	const progress = (currentStep / totalSteps) * 100;

	const { data: session } = useSession();

	// Create/Update question mutation
	const createQuestionMutation = useMutation(
		(data: QuestionFormData) => {
			if (isEditMode && questionId) {
				return questionService.updateQuestion(questionId, data);
			}
			return questionService.createQuestion(data);
		},
		{
			onSuccess: (response) => {
				console.log("Mutation success:", response);
				toast.success(
					isEditMode
						? "Question updated successfully!"
						: "Question created successfully!"
				);
				router.push("/questions");
			},
			onError: (error: any) => {
				console.error("Mutation error:", error);
				toast.error(
					error?.response?.data?.message ||
						`Failed to ${isEditMode ? "update" : "create"} question`
				);
			},
		}
	);

	const form = useForm({
		resolver: zodResolver(questionSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			content: "",
			category: "",
			difficulty: "Medium",
			tags: [],
			companies: [],
			richAnswer: "",
			media: [],
			solutions: [
				{
					title: "",
					language: "javascript",
					code: "",
					explanation: "",
				},
			],
			hints: [],
			bestPractices: [],
			relatedQuestions: [],
			timeLimit: 30,
		},
	});

	// Load question data on mount if in edit mode
	React.useEffect(() => {
		if (isEditMode && questionId) {
			setIsLoadingQuestion(true);
			questionService
				.getSingleQuestion(questionId)
				.then((response) => {
					const question = response.data;
					// Get category ID - handle both object and string formats
					const categoryId =
						typeof question.category === "object" && question.category !== null
							? (question.category as any)._id || (question.category as any).id
							: question.category;

					// Ensure difficulty is one of the valid values
					const validDifficulty =
						question.difficulty === "Easy" ||
						question.difficulty === "Medium" ||
						question.difficulty === "Hard"
							? question.difficulty
							: "Medium";

					form.reset({
						title: question.title || "",
						content: question.content || "",
						category: categoryId || "",
						difficulty: validDifficulty,
						tags: question.tags || [],
						companies: question.companies || [],
						richAnswer: question.richAnswer || "",
						media: question.media || [],
						solutions:
							question.solutions && question.solutions.length > 0
								? question.solutions
								: [
										{
											title: "",
											language: "javascript",
											code: "",
											explanation: "",
										},
								  ],
						hints: question.hints || [],
						bestPractices: question.bestPractices || [],
						relatedQuestions: question.relatedQuestions || [],
						timeLimit: question.timeLimit || 30,
					});
					setIsLoadingQuestion(false);
				})
				.catch((error) => {
					console.error("Error fetching question:", error);
					toast.error("Failed to load question data");
					setIsLoadingQuestion(false);
					router.push("/questions");
				});
		}
	}, [isEditMode, questionId]);

	const handleFormDataChange = (data: Partial<QuestionFormData>) => {
		// Auto-save functionality could be implemented here
		console.log("Form data changed:", data);
	};

	const validateCurrentStep = async () => {
		const fieldsToValidate: (keyof QuestionFormData)[] = [];

		switch (currentStep) {
			case 1:
				fieldsToValidate.push("title", "category");
				break;
			case 2:
				fieldsToValidate.push("difficulty");
				break;
			case 3:
				fieldsToValidate.push("richAnswer");
				break;
			case 4:
				// Validate all required sub-fields for each solution
				const allSolutions = form.getValues("solutions");
				if (allSolutions.length === 0) {
					// If no solutions, explicitly add an error for the solutions array itself
					fieldsToValidate.push("solutions");
				} else {
					allSolutions.forEach((_, index) => {
						fieldsToValidate.push(
							`solutions.${index}.title` as "solutions",
							`solutions.${index}.language` as "solutions",
							`solutions.${index}.code` as "solutions",
							`solutions.${index}.explanation` as "solutions"
						);
					});
				}
				break;
			case 5:
				// Optional fields, no validation needed
				break;
		}

		const result = await form.trigger(fieldsToValidate);
		return result;
	};

	const nextStep = async () => {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: QuestionFormData) => {
		try {
			let questionData: any;

			if (isEditMode) {
				// For edit mode, don't send author or status fields
				questionData = { ...data };
			} else {
				// For create mode, add author and status
				questionData = {
					...data,
					author: session?.user?.id || "anonymous",
					status: "published",
				};
			}

			// Use the mutation to submit data
			createQuestionMutation.mutate(questionData);
		} catch (error) {
			console.error("Submission error caught in client:", error);
			// Log the full error object for more detailed debugging
			if (error && (error as any).response) {
				console.error("Server response error:", (error as any).response.data);
			} else if (error instanceof Error) {
				console.error("Client-side error details:", error.message);
			} else {
				console.error("Unknown error during submission:", error);
			}
			toast.error(
				(error as any)?.response?.data?.message || "Failed to submit question"
			);
		}
	};

	const onCancel = () => {
		router.push("/questions");
	};

	const saveDraft = async () => {
		setIsDraft(true);
		// Here you could implement draft saving logic
		toast.success("Draft saved successfully!");
		setIsDraft(false);
	};

	// Show loading state while fetching question data
	if (isLoadingQuestion) {
		return (
			<div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading question data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 md:p-6">
			<div className="max-w-5xl mx-auto">
				{/* Simple Header */}
				<div className="flex items-center justify-between mb-6">
					<Button variant="ghost" onClick={onCancel} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
					<h1 className="text-2xl font-bold text-gray-900">
						{isEditMode ? "Edit Question" : "Add Question"}
					</h1>
					<Button
						variant="outline"
						onClick={saveDraft}
						disabled={isDraft}
						className="gap-2">
						<Save className="h-4 w-4" />
						{isDraft ? "Saving..." : "Save Draft"}
					</Button>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Form Content */}
					<div className="lg:col-span-3">
						<Card>
							<CardContent className="p-6">
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-6">
										<AddQuestionForm
											form={form}
											currentStep={currentStep}
											onFormDataChange={handleFormDataChange}
										/>
									</form>
								</Form>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-4">
						{/* Progress */}
						<Card className="lg:sticky lg:top-4">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium">Progress</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">
											Step {currentStep} of {STEPS.length}
										</span>
										<span className="font-medium">{Math.round(progress)}%</span>
									</div>
									<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>

								{/* Navigation Buttons */}
								<div className="space-y-2">
									{currentStep > 1 && (
										<Button
											variant="outline"
											onClick={prevStep}
											className="w-full gap-2">
											<ChevronLeft className="h-4 w-4" />
											Previous
										</Button>
									)}

									{currentStep < STEPS.length ? (
										<Button onClick={nextStep} className="w-full gap-2">
											Next
											<ChevronRight className="h-4 w-4" />
										</Button>
									) : (
										<Button
											onClick={form.handleSubmit(onSubmit)}
											disabled={
												form.formState.isSubmitting ||
												createQuestionMutation.isLoading
											}
											className="w-full gap-2 bg-green-600 hover:bg-green-700">
											<Send className="h-4 w-4" />
											{form.formState.isSubmitting ||
											createQuestionMutation.isLoading
												? isEditMode
													? "Updating..."
													: "Publishing..."
												: isEditMode
												? "Update"
												: "Publish"}
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddQuestion;
