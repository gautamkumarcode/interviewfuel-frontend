"use client";

import {
	ArrowLeft,
	Bookmark,
	Building,
	Calendar,
	Check,
	ChevronRight,
	Code2,
	Copy,
	Eye,
	MessageCircle,
	Share2,
	Star,
	Tag,
	ThumbsUp,
	Zap,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface QuestionDetailViewProps {
	questionId: number;
	onBack: () => void;
}

const questionData = {
	1: {
		id: 1,
		title: "What is the difference between let, const, and var in JavaScript?",
		category: "JavaScript",
		difficulty: "Easy",
		tags: ["Variables", "ES6", "Fundamentals", "Scope"],
		views: 1234,
		likes: 89,
		bookmarks: 45,
		timeAgo: "2 hours ago",
		companies: ["Google", "Microsoft", "Amazon", "Meta"],
		frequency: "Very High",
		description: `This is one of the most fundamental JavaScript questions asked in interviews. Understanding the differences between var, let, and const is crucial for writing modern JavaScript code and avoiding common pitfalls.`,

		content: `
## The Question

Explain the key differences between \`var\`, \`let\`, and \`const\` in JavaScript. When would you use each one?

## Key Differences

### 1. Scope
- **var**: Function-scoped or globally-scoped
- **let**: Block-scoped
- **const**: Block-scoped

### 2. Hoisting Behavior
- **var**: Hoisted and initialized with \`undefined\`
- **let**: Hoisted but not initialized (Temporal Dead Zone)
- **const**: Hoisted but not initialized (Temporal Dead Zone)

### 3. Re-declaration
- **var**: Can be re-declared in the same scope
- **let**: Cannot be re-declared in the same scope
- **const**: Cannot be re-declared in the same scope

### 4. Re-assignment
- **var**: Can be re-assigned
- **let**: Can be re-assigned
- **const**: Cannot be re-assigned (but objects/arrays can be mutated)
    `,

		solutions: [
			{
				title: "Scope Differences Example",
				language: "javascript",
				code: `// var - Function scoped
function varExample() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible outside the block
}

// let - Block scoped
function letExample() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ReferenceError: y is not defined
}

// const - Block scoped
function constExample() {
  if (true) {
    const z = 1;
  }
  console.log(z); // ReferenceError: z is not defined
}`,
				explanation:
					"This example demonstrates how var is function-scoped while let and const are block-scoped.",
			},
			{
				title: "Hoisting Behavior",
				language: "javascript",
				code: `// var hoisting
console.log(a); // undefined (not an error)
var a = 5;

// let hoisting (Temporal Dead Zone)
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

// const hoisting (Temporal Dead Zone)
console.log(c); // ReferenceError: Cannot access 'c' before initialization
const c = 15;`,
				explanation:
					"var is hoisted and initialized with undefined, while let and const are hoisted but remain uninitialized until their declaration is reached.",
			},
			{
				title: "Re-assignment and Mutation",
				language: "javascript",
				code: `// var - can be re-declared and re-assigned
var name = "John";
var name = "Jane"; // No error
name = "Bob"; // No error

// let - can be re-assigned but not re-declared
let age = 25;
// let age = 30; // SyntaxError: Identifier 'age' has already been declared
age = 30; // OK

// const - cannot be re-assigned or re-declared
const PI = 3.14159;
// const PI = 3.14; // SyntaxError: Identifier 'PI' has already been declared
// PI = 3.14; // TypeError: Assignment to constant variable

// const with objects (mutation allowed)
const person = { name: "Alice", age: 30 };
person.age = 31; // OK - mutating the object
person.city = "New York"; // OK - adding property
// person = {}; // TypeError: Assignment to constant variable`,
				explanation:
					"const prevents re-assignment but allows mutation of objects and arrays.",
			},
		],

		bestPractices: [
			"Use `const` by default for values that won't be re-assigned",
			"Use `let` when you need to re-assign the variable",
			"Avoid `var` in modern JavaScript due to its confusing scoping rules",
			"Always declare variables before using them to avoid hoisting issues",
			"Use meaningful variable names regardless of the declaration type",
		],

		relatedQuestions: [
			{
				id: 2,
				title: "Explain React Hooks and their use cases",
				difficulty: "Medium",
			},
			{
				id: 5,
				title: "Explain the concept of closures in JavaScript",
				difficulty: "Medium",
			},
			{
				id: 6,
				title: "What is the JavaScript Event Loop?",
				difficulty: "Hard",
			},
		],

		comments: [
			{
				id: 1,
				author: "Sarah Chen",
				avatar: "SC",
				timeAgo: "3 hours ago",
				content:
					"Great explanation! The hoisting examples really helped me understand the temporal dead zone concept.",
				likes: 12,
			},
			{
				id: 2,
				author: "Mike Johnson",
				avatar: "MJ",
				timeAgo: "5 hours ago",
				content:
					"I wish I had this explanation when I was learning JavaScript. The scope examples are perfect.",
				likes: 8,
			},
		],
	},
};

export const QuestionDetailView = ({
	questionId,
	onBack,
}: QuestionDetailViewProps) => {
	const [isBookmarked, setIsBookmarked] = React.useState(false);
	const [isLiked, setIsLiked] = React.useState(false);
	const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
	const [newComment, setNewComment] = React.useState("");

	const question = questionData[questionId as keyof typeof questionData];

	if (!question) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-500">Question not found</p>
			</div>
		);
	}

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "Hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const copyToClipboard = async (code: string, title: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedCode(title);
			setTimeout(() => setCopiedCode(null), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	const handleAddComment = () => {
		if (newComment.trim()) {
			// In a real app, this would make an API call
			console.log("Adding comment:", newComment);
			setNewComment("");
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back to Questions
				</Button>
			</div>

			{/* Question Header */}
			<div className="mb-8">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-gray-900 mb-3">
							{question.title}
						</h1>

						<div className="flex flex-wrap items-center gap-3 mb-4">
							<Badge className={getDifficultyColor(question.difficulty)}>
								{question.difficulty}
							</Badge>
							<Badge variant="outline" className="gap-1">
								<Building className="h-3 w-3" />
								{question.companies.length} companies
							</Badge>
							<Badge variant="outline" className="gap-1">
								<Zap className="h-3 w-3" />
								{question.frequency}
							</Badge>
						</div>

						<div className="flex flex-wrap gap-2 mb-4">
							{question.tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="text-xs">
									<Tag className="h-3 w-3 mr-1" />
									{tag}
								</Badge>
							))}
						</div>

						<div className="flex items-center gap-6 text-sm text-gray-500">
							<div className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								<span>{question.views} views</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4" />
								<span>{question.likes} likes</span>
							</div>
							<div className="flex items-center gap-1">
								<Bookmark className="h-4 w-4" />
								<span>{question.bookmarks} bookmarks</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>{question.timeAgo}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant={isLiked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsLiked(!isLiked)}
							className="gap-2">
							<ThumbsUp className="h-4 w-4" />
							Like
						</Button>
						<Button
							variant={isBookmarked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsBookmarked(!isBookmarked)}
							className="gap-2">
							<Bookmark className="h-4 w-4" />
							Save
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<Share2 className="h-4 w-4" />
							Share
						</Button>
					</div>
				</div>

				<p className="text-gray-600 leading-relaxed">{question.description}</p>
			</div>

			{/* Companies */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Building className="h-5 w-5" />
						Asked by Companies
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						{question.companies.map((company) => (
							<Badge key={company} variant="outline" className="px-3 py-1">
								{company}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Main Content */}
			<Tabs defaultValue="solution" className="mb-8">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="solution">Solution & Explanation</TabsTrigger>
					<TabsTrigger value="discussion">
						Discussion ({question.comments.length})
					</TabsTrigger>
					<TabsTrigger value="related">Related Questions</TabsTrigger>
				</TabsList>

				<TabsContent value="solution" className="space-y-6">
					{/* Question Content */}
					<Card>
						<CardContent className="p-6">
							<div className="prose prose-gray max-w-none">
								<div
									dangerouslySetInnerHTML={{
										__html: question.content
											.replace(/\n/g, "<br/>")
											.replace(/##/g, "<h2>")
											.replace(/###/g, "<h3>")
											.replace(/`([^`]+)`/g, "<code>$1</code>"),
									}}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Code Solutions */}
					<div className="space-y-6">
						{question.solutions.map((solution, index) => (
							<Card key={index}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg flex items-center gap-2">
											<Code2 className="h-5 w-5" />
											{solution.title}
										</CardTitle>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												copyToClipboard(solution.code, solution.title)
											}
											className="gap-2">
											{copiedCode === solution.title ? (
												<Check className="h-4 w-4" />
											) : (
												<Copy className="h-4 w-4" />
											)}
											{copiedCode === solution.title ? "Copied!" : "Copy"}
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
										<pre className="text-sm text-gray-100">
											<code>{solution.code}</code>
										</pre>
									</div>
									<p className="text-gray-600 leading-relaxed">
										{solution.explanation}
									</p>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Best Practices */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Star className="h-5 w-5" />
								Best Practices
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{question.bestPractices.map((practice, index) => (
									<li key={index} className="flex items-start gap-2">
										<div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
										<span className="text-gray-700">{practice}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="discussion" className="space-y-6">
					{/* Add Comment */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Add a Comment</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Textarea
									placeholder="Share your thoughts, ask questions, or provide additional insights..."
									value={newComment}
									onChange={(e: any) => setNewComment(e.target.value)}
									className="min-h-[100px]"
								/>
								<div className="flex justify-end">
									<Button
										onClick={handleAddComment}
										disabled={!newComment.trim()}>
										Post Comment
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Comments */}
					<div className="space-y-4">
						{question.comments.map((comment) => (
							<Card key={comment.id}>
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<Avatar className="h-10 w-10">
											<AvatarFallback>{comment.avatar}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-gray-900">
													{comment.author}
												</span>
												<span className="text-sm text-gray-500">
													{comment.timeAgo}
												</span>
											</div>
											<p className="text-gray-700 mb-3">{comment.content}</p>
											<div className="flex items-center gap-4">
												<Button
													variant="ghost"
													size="sm"
													className="gap-1 text-gray-500">
													<ThumbsUp className="h-4 w-4" />
													{comment.likes}
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="gap-1 text-gray-500">
													<MessageCircle className="h-4 w-4" />
													Reply
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="related" className="space-y-4">
					{question.relatedQuestions.map((relatedQ) => (
						<Card
							key={relatedQ.id}
							className="hover:shadow-md transition-shadow cursor-pointer">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<Badge
												className={getDifficultyColor(relatedQ.difficulty)}>
												{relatedQ.difficulty}
											</Badge>
										</div>
										<h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
											{relatedQ.title}
										</h3>
									</div>
									<ChevronRight className="h-5 w-5 text-gray-400" />
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
};
