"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { practiceServices } from "@/services/practiceservices/practice-services";
import {
    ArrowLeft,
    ExternalLink,
    RotateCcw,
    Share2,
    Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnswersTab } from "./components/AnswersTab";

import { ResultsCards, SummaryTab } from "./components/ResultsComponents";
import { SessionPersistence } from "./components/sessionPersistence";
import { calculateResults } from "./components/sessionUtils";
import { PracticeSession } from "./types";

interface CompletedSessionProps {
	session: PracticeSession;
	onNewSession: () => void;
}

export function CompletedSession({
	session,
	onNewSession,
}: CompletedSessionProps) {
	const results = calculateResults(session);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [aiEvaluations, setAiEvaluations] = useState<any[]>([]);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [hasSubmitted, setHasSubmitted] = useState(false); // Add flag to prevent multiple submissions

	// Generate shareable URL
	const generateShareUrl = () => {
		const baseUrl = window.location.origin;
		const shareLink = `${baseUrl}/practice/shared/${session._id}`;
		setShareUrl(shareLink);
		return shareLink;
	};

	// Handle sharing
	const handleShare = async () => {
		const url = shareUrl || generateShareUrl();

		if (navigator.share) {
			try {
				await navigator.share({
					title: "My Practice Session Results",
					text: `I just completed a practice session with ${results.completionRate}% completion rate!`,
					url: url,
				});
			} catch (err) {
				console.log("Share cancelled:", err);
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(url);
			alert("Share link copied to clipboard!");
		}
	};

	// Retry submission function
	const retrySubmission = () => {
		setHasSubmitted(false);
		setSubmitError(null);
		setAiEvaluations([]);
	};

	// Submit all answers to backend for AI evaluation
	useEffect(() => {
		const submitAllAnswers = async () => {
			// Prevent multiple submissions
			if (hasSubmitted || isSubmitting) {
				return;
			}

			setIsSubmitting(true);
			setSubmitError(null);
			setHasSubmitted(true); // Set flag immediately to prevent duplicate calls

			try {
				// Prepare only answered questions for submission
				const answersArray = session.questions
					.map((question, index) => {
						const answer = session.answers[question._id];
						// Only include questions that have non-empty answers
						if (answer && answer.trim()) {
							return {
								questionIndex: index,
								questionId: question._id, // Add question ID for backend reference
								answer: answer.trim(),
								timeSpent: Math.floor(
									(session.totalTime - session.timeRemaining) /
										session.questions.length
								),
							};
						}
						return null;
					})
					.filter((item): item is NonNullable<typeof item> => item !== null); // Type-safe filter

				// Only submit if there are answered questions
				if (answersArray.length === 0) {
					setSubmitError(
						"No answers to submit. Please answer at least one question."
					);
					return;
				}

				console.log("Session structure:", {
					sessionId: session._id,
					questionsCount: session.questions.length,
					questions: session.questions.map((q, idx) => ({
						index: idx,
						_id: q._id,
						title: q.title,
						hasAnswer: !!session.answers[q._id],
						answer: session.answers[q._id]?.substring(0, 50) + "...",
					})),
				});

				console.log("Submitting answers:", { answers: answersArray });

				// Submit all answers for AI evaluation
				const evaluationResponse = await practiceServices.submitAllAnswers(
					session._id,
					{
						answers: answersArray,
					}
				);

				if (evaluationResponse.success && evaluationResponse.data) {
					// Backend returns: { success: true, data: aiResults }
					// aiResults is an array of { score, feedback, notes }
					const evaluations = evaluationResponse.data;
					setAiEvaluations(Array.isArray(evaluations) ? evaluations : []);
					console.log("AI evaluations received:", evaluations);
				}

				// Complete the session
				await practiceServices.completeSession(session._id);
				console.log("Session completed successfully!");

				// Clear persisted session data since session is now completed
				SessionPersistence.clearSession();
			} catch (error: any) {
				console.error("Failed to submit answers or complete session:", error);
				console.error("Error details:", {
					message: error.message,
					response: error.response?.data,
					status: error.response?.status,
				});

				const errorMessage =
					error.response?.data?.message ||
					error.response?.data?.errors?.[0]?.msg ||
					"Failed to submit answers for evaluation. Your progress has been saved locally.";

				setSubmitError(errorMessage);
				setHasSubmitted(false); // Reset flag on error to allow retry
			} finally {
				setIsSubmitting(false);
			}
		};

		// Only submit if not already submitted or submitting
		if (session && !hasSubmitted && !isSubmitting) {
			submitAllAnswers();
		}
	}, [session._id, hasSubmitted, isSubmitting]); // Add hasSubmitted to dependencies

	return (
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
					<Trophy className="h-8 w-8 text-green-600" />
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Practice Session Complete!
				</h1>
				<p className="text-gray-600">
					{isSubmitting
						? "Evaluating your answers with AI..."
						: "Here's how you performed in this session"}
				</p>

				{/* Submission Status */}
				{isSubmitting && (
					<div className="mt-4 p-4 bg-blue-50 rounded-lg">
						<div className="flex items-center justify-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span className="text-blue-700">
								Submitting answers for AI evaluation...
							</span>
						</div>
					</div>
				)}

				{submitError && (
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-yellow-800 mb-3">{submitError}</p>
						<Button onClick={retrySubmission} size="sm" variant="outline">
							<RotateCcw className="h-4 w-4 mr-2" />
							Retry Submission
						</Button>
					</div>
				)}

				{aiEvaluations.length > 0 && (
					<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-green-800">
							✅ Your answers have been evaluated by AI!
						</p>
					</div>
				)}
			</div>

			<ResultsCards results={results} />

			<Tabs defaultValue="summary" className="mb-8">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="summary">Session Summary</TabsTrigger>
					<TabsTrigger value="answers">
						Your Answers {aiEvaluations.length > 0 && "& AI Feedback"}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="summary">
					<SummaryTab
						session={session}
						results={results}
						aiEvaluations={aiEvaluations}
						isEvaluating={isSubmitting}
					/>
				</TabsContent>

				<TabsContent value="answers">
					<AnswersTab
						session={session}
						aiEvaluations={aiEvaluations}
						isEvaluating={isSubmitting}
					/>
				</TabsContent>
			</Tabs>

			<div className="flex justify-center gap-4">
				<Button onClick={onNewSession} variant="outline" className="gap-2">
					<RotateCcw className="h-4 w-4" />
					Start New Session
				</Button>
				<Button onClick={handleShare} variant="outline" className="gap-2">
					<Share2 className="h-4 w-4" />
					Share Results
				</Button>
				{shareUrl && (
					<a href={shareUrl} target="_blank" rel="noopener noreferrer">
						<Button variant="outline" className="gap-2">
							<ExternalLink className="h-4 w-4" />
							View Shared
						</Button>
					</a>
				)}
				<Button className="gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back to Questions
				</Button>
			</div>
		</div>
	);
}
