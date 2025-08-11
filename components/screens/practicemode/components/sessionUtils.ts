import { PracticeSession, SessionResults } from "../types";

export const calculateResults = (session: PracticeSession): SessionResults => {
	const answeredQuestions = Object.keys(session.answers).length;
	const totalQuestions = session.questions.length;
	const completionRate = (answeredQuestions / totalQuestions) * 100;
	const timeUsed = session.totalTime - session.timeRemaining;
	const avgTimePerQuestion = timeUsed / Math.max(answeredQuestions, 1);

	return {
		answeredQuestions,
		totalQuestions,
		completionRate,
		timeUsed,
		avgTimePerQuestion,
	};
};
