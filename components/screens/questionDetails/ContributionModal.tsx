"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	contributionService,
	SubmitContributionData,
} from "@/services/contribution-services";
import { Building, Code2, Lightbulb, Sparkles, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

interface ContributionModalProps {
	open: boolean;
	onClose: () => void;
	questionId: string;
}

const contributionTypes = [
	{
		value: "solution",
		label: "Add Solution",
		icon: Code2,
	},
	{
		value: "hint",
		label: "Add Hint",
		icon: Lightbulb,
	},
	{
		value: "explanation",
		label: "Improve Explanation",
		icon: Sparkles,
	},
	{
		value: "bestPractice",
		label: "Add Best Practice",
		icon: Star,
	},
	{
		value: "company",
		label: "Add Company",
		icon: Building,
	},
	{
		value: "correction",
		label: "Report Error",
		icon: Zap,
	},
];

export function ContributionModal({
	open,
	onClose,
	questionId,
}: ContributionModalProps) {
	const queryClient = useQueryClient();
	const [type, setType] = useState<string>("");
	const [description, setDescription] = useState("");

	// Solution fields
	const [solutionTitle, setSolutionTitle] = useState("");
	const [language, setLanguage] = useState("javascript");
	const [code, setCode] = useState("");
	const [explanation, setExplanation] = useState("");
	const [timeComplexity, setTimeComplexity] = useState("");
	const [spaceComplexity, setSpaceComplexity] = useState("");

	// Hint fields
	const [hintOrder, setHintOrder] = useState(1);
	const [hintContent, setHintContent] = useState("");

	// Explanation field
	const [richAnswer, setRichAnswer] = useState("");

	// Best practice field
	const [practice, setPractice] = useState("");

	// Company fields
	const [companyName, setCompanyName] = useState("");
	const [frequency, setFrequency] = useState(1);

	// Correction fields
	const [correctionField, setCorrectionField] = useState("");
	const [oldValue, setOldValue] = useState("");
	const [newValue, setNewValue] = useState("");
	const [reason, setReason] = useState("");

	const { mutate: submitContribution, isLoading } = useMutation(
		(data: SubmitContributionData) =>
			contributionService.submitContribution(questionId, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["question", questionId]);
				onClose();
				resetForm();
			},
		}
	);

	const resetForm = () => {
		setType("");
		setDescription("");
		setSolutionTitle("");
		setLanguage("javascript");
		setCode("");
		setExplanation("");
		setTimeComplexity("");
		setSpaceComplexity("");
		setHintOrder(1);
		setHintContent("");
		setRichAnswer("");
		setPractice("");
		setCompanyName("");
		setFrequency(1);
		setCorrectionField("");
		setOldValue("");
		setNewValue("");
		setReason("");
	};

	const handleSubmit = () => {
		const content: any = {};

		switch (type) {
			case "solution":
				content.solution = {
					title: solutionTitle,
					language,
					code,
					explanation,
					timeComplexity,
					spaceComplexity,
				};
				break;
			case "hint":
				content.hint = { order: hintOrder, content: hintContent };
				break;
			case "explanation":
				content.explanation = { richAnswer };
				break;
			case "bestPractice":
				content.bestPractice = { practice };
				break;
			case "company":
				content.company = { name: companyName, frequency };
				break;
			case "correction":
				content.correction = {
					field: correctionField,
					oldValue,
					newValue,
					reason,
				};
				break;
		}

		submitContribution({ type: type as any, content, description });
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl">Contribute to Question</DialogTitle>
					<DialogDescription>
						Help improve this question by contributing solutions, hints, or
						corrections
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Contribution Type Selector */}
					<div className="space-y-2">
						<Label>Contribution Type</Label>
						<Select value={type} onValueChange={setType}>
							<SelectTrigger>
								<SelectValue placeholder="Select contribution type" />
							</SelectTrigger>
							<SelectContent>
								{contributionTypes.map((ct) => (
									<SelectItem key={ct.value} value={ct.value}>
										<div className="flex items-center gap-2">
											<ct.icon className="h-4 w-4" />
											<span>{ct.label}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* {type && (
							<p className="text-sm text-gray-500">
								{contributionTypes.find((ct) => ct.value === type)?.description}
							</p>
						)} */}
					</div>

					{/* Dynamic Form Based on Type */}
					{type === "solution" && (
						<SolutionForm
							title={solutionTitle}
							setTitle={setSolutionTitle}
							language={language}
							setLanguage={setLanguage}
							code={code}
							setCode={setCode}
							explanation={explanation}
							setExplanation={setExplanation}
							timeComplexity={timeComplexity}
							setTimeComplexity={setTimeComplexity}
							spaceComplexity={spaceComplexity}
							setSpaceComplexity={setSpaceComplexity}
						/>
					)}

					{type === "hint" && (
						<HintForm
							order={hintOrder}
							setOrder={setHintOrder}
							content={hintContent}
							setContent={setHintContent}
						/>
					)}

					{type === "explanation" && (
						<ExplanationForm
							richAnswer={richAnswer}
							setRichAnswer={setRichAnswer}
						/>
					)}

					{type === "bestPractice" && (
						<BestPracticeForm practice={practice} setPractice={setPractice} />
					)}

					{type === "company" && (
						<CompanyForm
							name={companyName}
							setName={setCompanyName}
							frequency={frequency}
							setFrequency={setFrequency}
						/>
					)}

					{type === "correction" && (
						<CorrectionForm
							field={correctionField}
							setField={setCorrectionField}
							oldValue={oldValue}
							setOldValue={setOldValue}
							newValue={newValue}
							setNewValue={setNewValue}
							reason={reason}
							setReason={setReason}
						/>
					)}

					{/* Description */}
					{type && (
						<div className="space-y-2">
							<Label>Description *</Label>
							<Textarea
								placeholder="Briefly describe your contribution (10-500 characters)"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								maxLength={500}
							/>
							<p className="text-xs text-gray-500">
								{description.length}/500 characters
							</p>
						</div>
					)}

					{/* Submit Button */}
					{type && (
						<div className="flex justify-end gap-3">
							<Button variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={isLoading || description.length < 10}
								className="bg-blue-600 hover:bg-blue-700">
								{isLoading ? "Submitting..." : "Submit Contribution"}
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

// Form Components
function SolutionForm({
	title,
	setTitle,
	language,
	setLanguage,
	code,
	setCode,
	explanation,
	setExplanation,
	timeComplexity,
	setTimeComplexity,
	spaceComplexity,
	setSpaceComplexity,
}: any) {
	return (
		<div className="space-y-4">
			<div>
				<Label>Solution Title *</Label>
				<Input
					placeholder="e.g., Optimized Two Pointer Approach"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div>
				<Label>Language *</Label>
				<Select value={language} onValueChange={setLanguage}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="javascript">JavaScript</SelectItem>
						<SelectItem value="python">Python</SelectItem>
						<SelectItem value="java">Java</SelectItem>
						<SelectItem value="cpp">C++</SelectItem>
						<SelectItem value="typescript">TypeScript</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>Code *</Label>
				<Textarea
					placeholder="Enter your solution code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					rows={10}
					className="font-mono"
				/>
			</div>
			<div>
				<Label>Explanation *</Label>
				<RichTextEditor
					content={explanation}
					onChange={setExplanation}
					placeholder="Explain your solution approach"
					minHeight="150px"
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label>Time Complexity</Label>
					<Input
						placeholder="e.g., O(n)"
						value={timeComplexity}
						onChange={(e) => setTimeComplexity(e.target.value)}
					/>
				</div>
				<div>
					<Label>Space Complexity</Label>
					<Input
						placeholder="e.g., O(1)"
						value={spaceComplexity}
						onChange={(e) => setSpaceComplexity(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}

function HintForm({ order, setOrder, content, setContent }: any) {
	return (
		<div className="space-y-4">
			<div>
				<Label>Hint Order *</Label>
				<Input
					type="number"
					min={1}
					value={order}
					onChange={(e) => setOrder(parseInt(e.target.value))}
				/>
			</div>
			<div>
				<Label>Hint Content *</Label>
				<Textarea
					placeholder="Provide a helpful hint"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={4}
				/>
			</div>
		</div>
	);
}

function ExplanationForm({ richAnswer, setRichAnswer }: any) {
	return (
		<div>
			<Label>Improved Explanation *</Label>
			<RichTextEditor
				content={richAnswer}
				onChange={setRichAnswer}
				placeholder="Write an improved explanation"
				minHeight="200px"
			/>
		</div>
	);
}

function BestPracticeForm({ practice, setPractice }: any) {
	return (
		<div>
			<Label>Best Practice *</Label>
			<Textarea
				placeholder="Describe the best practice or tip"
				value={practice}
				onChange={(e) => setPractice(e.target.value)}
				rows={4}
			/>
		</div>
	);
}

function CompanyForm({ name, setName, frequency, setFrequency }: any) {
	return (
		<div className="space-y-4">
			<div>
				<Label>Company Name *</Label>
				<Input
					placeholder="e.g., Google, Amazon"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div>
				<Label>Frequency</Label>
				<Input
					type="number"
					min={1}
					value={frequency}
					onChange={(e) => setFrequency(parseInt(e.target.value))}
				/>
			</div>
		</div>
	);
}

function CorrectionForm({
	field,
	setField,
	oldValue,
	setOldValue,
	newValue,
	setNewValue,
	reason,
	setReason,
}: any) {
	return (
		<div className="space-y-4">
			<div>
				<Label>Field to Correct *</Label>
				<Select value={field} onValueChange={setField}>
					<SelectTrigger>
						<SelectValue placeholder="Select field" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="title">Title</SelectItem>
						<SelectItem value="content">Content</SelectItem>
						<SelectItem value="difficulty">Difficulty</SelectItem>
						<SelectItem value="timeLimit">Time Limit</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>Current Value</Label>
				<Input
					placeholder="Current incorrect value"
					value={oldValue}
					onChange={(e) => setOldValue(e.target.value)}
				/>
			</div>
			<div>
				<Label>Corrected Value *</Label>
				<Input
					placeholder="Correct value"
					value={newValue}
					onChange={(e) => setNewValue(e.target.value)}
				/>
			</div>
			<div>
				<Label>Reason for Correction *</Label>
				<Textarea
					placeholder="Explain why this correction is needed"
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					rows={3}
				/>
			</div>
		</div>
	);
}
