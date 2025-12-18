"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
			onSuccess: () => {
				toast.success(
					isEditMode
						? "Question updated successfully!"
						: "Question created successfully!"
				);
				router.push("/my-questions");
			},
			onError: (error: any) => {
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
		<div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
			{/* Top Navigation Bar with Progress */}
			<div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
				<div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={onCancel}
							className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 -ml-2">
							<ArrowLeft className="h-4 w-4 mr-1" />
							Back
						</Button>
						<div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />
						<div className="hidden sm:block">
							<h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
								{isEditMode ? "Edit Question" : "Create New Question"}
							</h1>
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<span>Step {currentStep} of {STEPS.length}</span>
								<span>•</span>
								<span>{STEPS[currentStep - 1].title}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center gap-1 mr-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
							{STEPS.map((step) => {
								const isActive = step.id === currentStep;
								const isCompleted = step.id < currentStep;
								const Icon = step.icon;

								return (
									<div
										key={step.id}
										className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
											isActive
												? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
												: isCompleted
												? "text-green-600 dark:text-green-400"
												: "text-gray-400 dark:text-gray-600"
										}`}
										title={step.title}>
										<Icon className={`h-4 w-4 ${isActive ? "scale-110" : ""}`} />
										{isCompleted && (
											<div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
										)}
									</div>
								);
							})}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={saveDraft}
							disabled={isDraft}
							className="hidden sm:flex items-center gap-2">
							<Save className="h-4 w-4" />
							{isDraft ? "Saving..." : "Save Draft"}
						</Button>
					</div>
				</div>
				
				{/* Progress Line */}
				<div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-100 dark:bg-gray-800">
					<div 
						className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 py-8 pb-24">
				<div className="grid gap-8">
					<Card className="border-0 shadow-xl ring-1 ring-gray-200/50 dark:ring-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
						<CardContent className="p-6 md:p-8">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
			</div>

			{/* Bottom Action Bar */}
			<div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 p-4 z-40">
				<div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
					<Button
						variant="outline"
						size="lg"
						onClick={prevStep}
						disabled={currentStep === 1}
						className={`w-32 transition-all ${currentStep === 1 ? "opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
						<ChevronLeft className="h-4 w-4 mr-2" />
						Previous
					</Button>

					<div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
						<span className="font-medium text-gray-900 dark:text-gray-100">{Math.round(progress)}%</span>
						<span>completed</span>
					</div>

					{currentStep < STEPS.length ? (
						<Button 
							size="lg"
							onClick={nextStep}
							className="w-32 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/20">
							Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					) : (
						<Button
							size="lg"
							onClick={form.handleSubmit(onSubmit)}
							disabled={form.formState.isSubmitting || createQuestionMutation.isLoading}
							className="w-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 border-0">
							{form.formState.isSubmitting || createQuestionMutation.isLoading ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Processing...</span>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<Send className="h-4 w-4" />
									<span>{isEditMode ? "Update" : "Publish"}</span>
								</div>
							)}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddQuestion;
