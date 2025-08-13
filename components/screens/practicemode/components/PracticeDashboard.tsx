import { LoadingSpinner } from "@/components/custom/loader/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { practiceServices } from "@/services/practiceservices/practice-services";
import { useState } from "react";
import { usePracticeHistory } from "./usePracticeHistory";

export function PracticeDashboard() {
	const {
		sessions,
		isLoading,
		error,
		pagination,
		loadNextPage,
		loadPrevPage,
		refreshSessions,
	} = usePracticeHistory({
		autoLoad: true,
		pageSize: 10,
	});

	const [resumingSession, setResumingSession] = useState<string | null>(null);

	const handleResumeSession = async (sessionId: string) => {
		setResumingSession(sessionId);
		try {
			const response = await practiceServices.getPracticeSessionById(sessionId);
			if (response.success && response.data) {
				// Navigate to practice mode with this session
				console.log("Resuming session:", response.data);
				// You would integrate this with your routing logic
			}
		} catch (error) {
			console.error("Failed to resume session:", error);
			alert("Failed to resume session. Please try again.");
		} finally {
			setResumingSession(null);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-100 text-green-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "paused":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (isLoading && sessions.length === 0) {
		return (
			<div className="flex items-center justify-center p-8">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center p-8">
				<p className="text-red-600 mb-4">{error}</p>
				<Button onClick={refreshSessions}>Try Again</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Practice Sessions</h2>
				<Button onClick={refreshSessions} variant="outline">
					Refresh
				</Button>
			</div>

			{sessions.length === 0 ? (
				<Card>
					<CardContent className="text-center py-8">
						<p className="text-gray-600 mb-4">No practice sessions found.</p>
						<p className="text-sm text-gray-500">
							Start a new practice session to see it here.
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid gap-4">
						{sessions.map((session) => (
							<Card key={session._id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="space-y-2">
											<CardTitle className="text-lg">
												Practice Session
											</CardTitle>
											<div className="flex items-center gap-2">
												<Badge
													className={getStatusColor(
														session.settings?.duration?.toString() || "unknown"
													)}>
													{session.settings?.duration} min
												</Badge>
												<Badge variant="outline">
													{session.questions.length} questions
												</Badge>
												<Badge variant="outline">
													{session.settings?.difficulty || "Mixed"}
												</Badge>
											</div>
										</div>
										<div className="text-right text-sm text-gray-500">
											<p>
												{new Date(session.startTime || "").toLocaleDateString()}
											</p>
											<p>
												{new Date(session.startTime || "").toLocaleTimeString()}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div>
												<p className="text-gray-600">Progress</p>
												<p className="font-medium">
													{Object.keys(session.answers).length} /{" "}
													{session.questions.length}
												</p>
											</div>
											<div>
												<p className="text-gray-600">Time Remaining</p>
												<p className="font-medium">
													{Math.floor(session.timeRemaining / 60)}:
													{(session.timeRemaining % 60)
														.toString()
														.padStart(2, "0")}
												</p>
											</div>
											<div>
												<p className="text-gray-600">Categories</p>
												<p className="font-medium">
													{session.settings?.categories?.length || 0}
												</p>
											</div>
											<div>
												<p className="text-gray-600">Status</p>
												<Badge className={getStatusColor("active")}>
													{session.isActive ? "Active" : "Completed"}
												</Badge>
											</div>
										</div>

										{session.isActive && (
											<div className="flex gap-2">
												<Button
													onClick={() => handleResumeSession(session._id)}
													disabled={resumingSession === session._id}
													size="sm">
													{resumingSession === session._id
														? "Loading..."
														: "Resume Session"}
												</Button>
												<Button variant="outline" size="sm">
													View Details
												</Button>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-600">
								Page {pagination.page} of {pagination.totalPages} (
								{pagination.total} total sessions)
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={loadPrevPage}
									disabled={pagination.page === 1}>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={loadNextPage}
									disabled={pagination.page === pagination.totalPages}>
									Next
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
