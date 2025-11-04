"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { practiceServices } from "@/services/practiceservices/practice-services";
import {
	ArrowLeft,
	Clock,
	ExternalLink,
	Play,
	RotateCcw,
	Share2,
	Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PracticeSession } from "../types";
import { AnswersTab } from "./AnswersTab";
import { ResultsCards, SummaryTab } from "./ResultsComponents";
import { SessionPersistence } from "./sessionPersistence";
import { calculateResults } from "./sessionUtils";

interface CompletedSessionProps {
	session: PracticeSession;
	onNewSession: () => void;
	previousQuestion: () => void;
	onResumeSession?: () => void;
}

export function CompletedSession({
	session,
	onNewSession,
	previousQuestion,
	onResumeSession,
}: CompletedSessionProps) {
	const results = calculateResults(session);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [aiEvaluations, setAiEvaluations] = useState<any[]>([]);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const hasSubmitted = useRef(false);

	// Check if session is incomplete (has unanswered questions)
	const isIncomplete = results.completionRate < 100;
	const unansweredCount = results.totalQuestions - results.answeredQuestions;

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

	// Submit all answers to backend for AI evaluation
	useEffect(() => {
		const submitAllAnswers = async () => {
			setIsSubmitting(true);
			setSubmitError(null);

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

					// Check if all evaluations are fallback (indicating AI failure)
					const allFallback =
						Array.isArray(evaluations) &&
						evaluations.every(
							(evaluation: any) =>
								evaluation.feedback?.includes(
									"AI evaluation temporarily unavailable"
								) || evaluation.notes === "Fallback evaluation"
						);

					if (allFallback) {
						setSubmitError(
							"AI evaluation is currently unavailable. Your answers have been saved, but detailed feedback couldn't be generated. Please try again later."
						);
					}
				}

				// Complete the session
				await practiceServices.completeSession(session._id);

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
			} finally {
				setIsSubmitting(false);
			}
		};

		// Only submit once - use ref to prevent multiple submissions
		if (session && !hasSubmitted.current && !isSubmitting) {
			hasSubmitted.current = true;
			submitAllAnswers();
		}
	}, [session._id]); // Only depend on session ID

	return (
		<div className="max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<div
					className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
						isIncomplete ? "bg-orange-100" : "bg-green-100"
					}`}>
					{isIncomplete ? (
						<Clock className="h-8 w-8 text-orange-600" />
					) : (
						<Trophy className="h-8 w-8 text-green-600" />
					)}
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					{isIncomplete ? "Session Ended" : "Practice Session Complete!"}
				</h1>
				<p className="text-gray-600">
					{isSubmitting
						? "Evaluating your answers with AI..."
						: isIncomplete
						? `You answered ${results.answeredQuestions} out of ${results.totalQuestions} questions`
						: "Here's how you performed in this session"}
				</p>

				{isIncomplete && (
					<div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
						<p className="text-orange-800 font-medium">
							⏰ Session ended with {unansweredCount} unanswered question
							{unansweredCount !== 1 ? "s" : ""}
						</p>
						<p className="text-orange-700 text-sm mt-1">
							You can resume this session to answer the remaining questions
						</p>
					</div>
				)}

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
						<p className="text-yellow-800">{submitError}</p>
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
					<TabsTrigger value="summary">
						{isIncomplete ? "Progress Summary" : "Session Summary"}
					</TabsTrigger>
					<TabsTrigger value="answers">
						Your Answers {aiEvaluations.length > 0 && "& AI Feedback"}
						{isIncomplete &&
							` (${results.answeredQuestions}/${results.totalQuestions})`}
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

			<div className="flex flex-wrap justify-center gap-4">
				{/* Resume Session Button - Only show for incomplete sessions */}
				{isIncomplete && onResumeSession && (
					<Button
						onClick={onResumeSession}
						className="gap-2 bg-orange-600 hover:bg-orange-700">
						<Play className="h-4 w-4" />
						Resume Session ({unansweredCount} left)
					</Button>
				)}

				{/* Back to Questions - Only show for incomplete sessions without resume function */}
				{isIncomplete && !onResumeSession && (
					<Button onClick={previousQuestion} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Questions
					</Button>
				)}

				<Button onClick={onNewSession} variant="outline" className="gap-2">
					<RotateCcw className="h-4 w-4" />
					Start New Session
				</Button>

				{/* Only show share for complete sessions */}
				{!isIncomplete && (
					<>
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
					</>
				)}
			</div>
		</div>
	);
}
