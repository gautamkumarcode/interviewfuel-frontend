"use client";

import {
	AnswersTab,
	calculateResults,
	ResultsCards,
	SummaryTab,
} from "@/components/screens/practicemode";
import { PracticeSession } from "@/components/screens/practicemode/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { practiceServices } from "@/services/practiceservices/practice-services";
import {
	ArrowLeft,
	Clock,
	Download,
	Share2,
	Target,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SharedSessionPage: React.FC = () => {
	const params = useParams();
	const sessionId = params?.sessionId as string;

	const [session, setSession] = useState<PracticeSession | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!sessionId) return;

		const loadSession = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await practiceServices.getPracticeSessionById(
					sessionId
				);

				if (response.success && response.data?.data?.session) {
					setSession(response.data.data.session);
				} else {
					setError("Session not found or not accessible");
				}
			} catch (err: any) {
				console.error("Failed to load shared session:", err);
				setError(
					err.response?.status === 404
						? "Session not found"
						: "Failed to load session. It may be private or have been deleted."
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadSession();
	}, [sessionId]);

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Practice Session Results",
					text: "Check out my practice session results!",
					url: window.location.href,
				});
			} catch (err) {
				// User cancelled or error occurred
				console.log("Share cancelled:", err);
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			alert("Link copied to clipboard!");
		}
	};

	const handleDownload = () => {
		if (!session) return;

		const results = calculateResults(session);
		const data = {
			sessionId: session._id,
			date: new Date().toLocaleDateString(),
			results: {
				completionRate: results.completionRate,
				answeredQuestions: results.answeredQuestions,
				totalQuestions: results.totalQuestions,
				timeUsed: results.timeUsed,
				sessionDuration: session.totalTime,
			},
			settings: session.settings,
			questions: session.questions.map((q) => ({
				title: q.title,
				difficulty: q.difficulty,
				answer: session.answers[q._id] || "Not answered",
			})),
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `practice-session-${sessionId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading shared session...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !session) {
		return (
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				<div className="text-center py-12">
					<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<Trophy className="h-8 w-8 text-red-600" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Session Not Found
					</h1>
					<p className="text-gray-600 mb-6">
						{error ||
							"This practice session doesn't exist or is not publicly shared."}
					</p>
					<Link href="/practice">
						<Button className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Go to Practice Mode
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const results = calculateResults(session);

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Link href="/practice">
						<Button variant="outline" size="sm" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to Practice
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<Trophy className="h-6 w-6 text-blue-600" />
							Shared Practice Results
						</h1>
						<p className="text-gray-600 text-sm">
							Session completed on{" "}
							{new Date(session.startTime || "").toLocaleDateString()}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleShare}
						className="gap-2">
						<Share2 className="h-4 w-4" />
						Share
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleDownload}
						className="gap-2">
						<Download className="h-4 w-4" />
						Download
					</Button>
				</div>
			</div>

			{/* Session Info */}
			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Target className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Questions</p>
								<p className="font-semibold">
									{results.answeredQuestions} / {results.totalQuestions}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Clock className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Time Spent</p>
								<p className="font-semibold">
									{Math.floor(results.timeUsed / 60)}m {results.timeUsed % 60}s
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Trophy className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Completion</p>
								<p className="font-semibold">{results.completionRate}%</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			<ResultsCards results={results} />

			{/* Detailed Results */}
			<Tabs defaultValue="summary" className="mb-8">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="summary">Session Summary</TabsTrigger>
					<TabsTrigger value="answers">Questions & Answers</TabsTrigger>
				</TabsList>

				<TabsContent value="summary">
					<SummaryTab
						session={session}
						results={results}
						aiEvaluations={[]} // Shared sessions don't show AI evaluations for privacy
						isEvaluating={false}
					/>
				</TabsContent>

				<TabsContent value="answers">
					<AnswersTab
						session={session}
						aiEvaluations={[]} // Shared sessions don't show AI evaluations for privacy
						isEvaluating={false}
					/>
				</TabsContent>
			</Tabs>

			{/* Footer note */}
			<div className="text-center py-6 border-t">
				<p className="text-sm text-gray-500">
					This is a shared practice session result. AI evaluations and feedback
					are not shown for privacy.
				</p>
			</div>
		</div>
	);
};

export default SharedSessionPage;
