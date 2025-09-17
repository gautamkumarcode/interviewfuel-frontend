"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTheme } from "@/context/theme.context";
import { questionService } from "@/services/questions/question-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-select";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Code,
	FileText,
	Lightbulb,
	Plus,
	Save,
	Send,
	Settings2,
	Target,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const AddQuestion = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [isDraft, setIsDraft] = useState(false);
	const router = useRouter();
	const { toast } = useTheme();

	const totalSteps = STEPS.length;
	const progress = (currentStep / totalSteps) * 100;

	const { data: session } = useSession();

	// Create question mutation
	const createQuestionMutation = useMutation(
		(data: QuestionFormData) => {
			return questionService.createQuestion(data);
		},
		{
			onSuccess: (response) => {
				console.log("Mutation success:", response);
				toast.success("Question created successfully!");
				router.push("/questions");
			},
			onError: (error: any) => {
				console.error("Mutation error:", error);
				toast.error(
					error?.response?.data?.message || "Failed to create question"
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

			// Add author field from session
			const questionData = {
				...data,
				author: session?.user?.id || "anonymous",
				status: "published",
			};


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

	return (
		<div className="min-h-screen  p-4">
			<div className="max-w-7xl mx-auto">
				{/* Navigation Header */}
				<div className="flex  justify-between mb-8">
					<Button
						variant="ghost"
						onClick={onCancel}
						className="gap-2 hover:bg-white/60 backdrop-blur-sm">
						<ArrowLeft className="h-4 w-4" />
						Back to Questions
					</Button>
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-green-800 bg-clip-text text-transparent mb-4">
							Create New Question
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Build comprehensive interview questions with detailed solutions
							and examples
						</p>
					</div>
					<Button
						variant="outline"
						onClick={saveDraft}
						disabled={isDraft}
						className="gap-2 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
						<Save className="h-4 w-4" />
						{isDraft ? "Saving..." : "Save Draft"}
					</Button>
				</div>

				{/* Hero Section */}

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Form Content */}
					<div className="lg:col-span-3">
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardContent>
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
					<div className="space-y-6">
						{/* Quick Actions */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl sticky top-4 z-50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Plus className="h-5 w-5 text-blue-600" />
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Current Step
										</span>
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-700">
											{STEPS[currentStep - 1].title}
										</Badge>
									</div>
									<div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
										<span className="text-sm font-medium text-gray-700">
											Progress
										</span>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700">
											{Math.round(progress)}%
										</Badge>
									</div>
								</div>

								<Separator />

								{/* Navigation Buttons */}
								<div className="space-y-3">
									{currentStep > 1 && (
										<Button
											variant="outline"
											onClick={prevStep}
											className="w-full gap-2 bg-white/60 hover:bg-white/80">
											<ChevronLeft className="h-4 w-4" />
											Previous Step
										</Button>
									)}

									{currentStep < STEPS.length ? (
										<Button
											onClick={nextStep}
											className="w-full gap-2 bg-gradient-to-r from-green-200 to-green-600 hover:from-green-700 hover:to-indigo-700">
											Next Step
											<ChevronRight className="h-4 w-4" />
										</Button>
									) : (
										<Button
											onClick={form.handleSubmit(onSubmit)}
											disabled={
												form.formState.isSubmitting ||
												createQuestionMutation.isLoading
											}
											className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
											<Send className="h-4 w-4" />
											{form.formState.isSubmitting ||
											createQuestionMutation.isLoading
												? "Publishing..."
												: "Publish Question"}
										</Button>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Tips */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Lightbulb className="h-5 w-5 text-yellow-600" />
									Writing Tips
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
									<ul className="text-sm text-yellow-800 space-y-2">
										<li>• Write clear, concise question titles</li>
										<li>• Include detailed problem descriptions</li>
										<li>• Provide comprehensive solutions</li>
										<li>• Add relevant tags and categories</li>
										<li>• Include time complexity analysis</li>
										<li>• Test your code examples</li>
									</ul>
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
