"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryService } from "@/services/categories/category-services";
import {
	AlertCircle,
	Badge,
	CheckCircle2,
	Clock,
	Code,
	FileText,
	Lightbulb,
	Settings,
	Target,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
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
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);

	// Fetch categories
	const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
		["allcategories"],
		() => categoryService.getAllCategories()
	);

	const categories = categoriesData?.data?.results || [];
	const allCategories = categories.flatMap((cat) => [
		{ _id: cat._id, name: cat.name },
		...(cat.subcategories || []).map((sub) => ({
			_id: sub._id,
			name: sub.name,
		})),
	]);

	const {
		fields: solutionFields,
		append: appendSolution,
		remove: removeSolution,
	} = useFieldArray({
		control: form.control,
		name: "solutions",
	});

	const {
		fields: companyFields,
		append: appendCompany,
		remove: removeCompany,
	} = useFieldArray({
		control: form.control,
		name: "companies",
	});

	const {
		fields: hintFields,
		append: appendHint,
		remove: removeHint,
	} = useFieldArray({
		control: form.control,
		name: "hints",
	});

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
		<div className="">
			{/* Step Header */}
			<Card className="border-none shadow-none">
				<CardHeader className="">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div
								className={`p-3 bg-gradient-to-br ${currentStepConfig.color} rounded-xl shadow-lg`}>
								{(() => {
									const Icon = currentStepConfig.icon;
									return <Icon className="h-6 w-6 text-white" />;
								})()}
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-gray-900">
									{currentStepConfig.title}
								</CardTitle>
								<p className="text-gray-600 mt-1">
									{currentStepConfig.description}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<Clock className="h-4 w-4" />
								{currentStepConfig.estimatedTime}
							</div>
							{isStepValid ? (
								<Badge className="bg-green-100 text-green-700 border-green-300">
									<CheckCircle2 className="h-3 w-3 mr-1" />
									Valid
								</Badge>
							) : (
								<Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
									<AlertCircle className="h-3 w-3 mr-1" />
									Incomplete
								</Badge>
							)}
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Step Content */}
			<Card className="shadow-none border-none">
				<CardContent className="">{renderStepContent()}</CardContent>
			</Card>

			{/* Step Tips */}
			{currentStep === 1 && (
				<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-none">
					<CardContent className="p-6">
						<div className="flex items-start gap-3">
							<FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-blue-900 mb-2">
									Step 1 Tips
								</h4>
								<ul className="text-sm text-blue-800 space-y-1">
									<li>• Write a clear, specific question title</li>
									<li>• Include all necessary context in the content</li>
									<li>• Choose the most appropriate category</li>
									<li>• Be concise but comprehensive</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{currentStep === 4 && (
				<Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg">
					<CardContent className="p-6">
						<div className="flex items-start gap-3">
							<Code className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
							<div>
								<h4 className="font-semibold text-orange-900 mb-2">
									Code Solution Tips
								</h4>
								<ul className="text-sm text-orange-800 space-y-1">
									<li>• Provide multiple approaches when possible</li>
									<li>• Include time and space complexity analysis</li>
									<li>• Add clear comments in your code</li>
									<li>• Test your solutions before submitting</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
