export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiEndPoint = {
	login: "/auth/login",
	signup: "/auth/register",
	getAllQuestions: "/questions",
	getCategory: "/categories",
	logout: "/auth/logout",
	getUserProfile: "/auth/me",
	createPracticeSession: "/practice/sessions/create",
	getPracticeSession: "/practice/sessions", // GET /practice/sessions/:id
	submitAnswer: "/practice/sessions", // PUT /practice/sessions/:id/answer
	completeSession: "/practice/sessions", // PUT /practice/sessions/:id/complete
	getUserSessions: "/practice/sessions", // GET /practice/sessions
};
