"use client";
import { categoryService } from "@/services/categories/category-services";
import {
    AlertCircle,
    Badge,
    CheckCircle2,
    Code,
    FileText,
    Lightbulb,
    Settings,
    Target,
} from "lucide-react";
import { useQuery } from "react-query";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Details } from "./Step2Details";
import { Step3Answer } from "./Step3Answer";
import { Step4Solutions } from "./Step4Solutions";
import { Step5Additional } from "./Step5Additional";

export type QuestionFormData = z.infer<typeof questionSchema>;

interface AddQuestionFormProps {
	form: any;
	currentStep: number;
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function AddQuestionForm({
	form,
	currentStep,
	onFormDataChange,
}: AddQuestionFormProps) {
	// Fetch categories
	const { data: categoriesData } = useQuery(
		["allcategories"],
		() => categoryService.getAllCategories()
	);



	const stepConfig = [
		{
			id: 1,
			title: "Basic Information",
			description: "Question title, content and category",
			icon: FileText,
			color: "from-blue-500 to-cyan-500",
			estimatedTime: "3-5 min",
		},
		{
			id: 2,
			title: "Question Details",
			description: "Tags, difficulty and time limit",
			icon: Settings,
			color: "from-purple-500 to-pink-500",
			estimatedTime: "2-3 min",
		},
		{
			id: 3,
			title: "Answer & Explanation",
			description: "Detailed answer explanation",
			icon: Target,
			color: "from-green-500 to-emerald-500",
			estimatedTime: "5-10 min",
		},
		{
			id: 4,
			title: "Code Solutions",
			description: "Code solutions and explanations",
			icon: Code,
			color: "from-orange-500 to-red-500",
			estimatedTime: "10-15 min",
		},
		{
			id: 5,
			title: "Additional Info",
			description: "Companies, hints and best practices",
			icon: Lightbulb,
			color: "from-indigo-500 to-purple-500",
			estimatedTime: "3-5 min",
		},
	];

	const currentStepConfig = stepConfig[currentStep - 1];

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return <Step1BasicInfo onFormDataChange={onFormDataChange} />;
			case 2:
				return <Step2Details onFormDataChange={onFormDataChange} />;
			case 3:
				return <Step3Answer onFormDataChange={onFormDataChange} />;
			case 4:
				return <Step4Solutions onFormDataChange={onFormDataChange} />;
			case 5:
				return <Step5Additional onFormDataChange={onFormDataChange} />;
			default:
				return null;
		}
	};

	// Get form validation status for current step
	const getStepValidationStatus = () => {
		const errors = form.formState.errors;
		switch (currentStep) {
			case 1:
				return !errors.title && !errors.content && !errors.category;
			case 2:
				return !errors.difficulty && !errors.timeLimit && !errors.tags;
			case 3:
				return !errors.richAnswer;
			case 4:
				return !errors.solutions;
			case 5:
				return true; // Optional step
			default:
				return false;
		}
	};

	const isStepValid = getStepValidationStatus();

	return (
		<div className="space-y-6">
			{/* Step Header */}
			<div className="flex items-center justify-between pb-4 border-b">
				<div className="flex items-center gap-3">
					<div
						className={`p-2 bg-gradient-to-br ${currentStepConfig.color} rounded-lg`}>
						{(() => {
							const Icon = currentStepConfig.icon;
							return <Icon className="h-5 w-5 text-white" />;
						})()}
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							{currentStepConfig.title}
						</h2>
						<p className="text-sm text-gray-500">
							{currentStepConfig.description}
						</p>
					</div>
				</div>
				{isStepValid ? (
					<Badge className="bg-green-100 text-green-700">
						<CheckCircle2 className="h-3 w-3 mr-1" />
						Complete
					</Badge>
				) : (
					<Badge className="text-gray-500">
						<AlertCircle className="h-3 w-3 mr-1" />
						Required
					</Badge>
				)}
			</div>

			{/* Step Content */}
			<div>{renderStepContent()}</div>
		</div>
	);
}
