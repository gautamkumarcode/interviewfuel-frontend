export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiEndPoint = {
	login: "/auth/login",
	signup: "/auth/register",
	oauth: "/auth/oauth",
	getAllQuestions: "/questions",
	getCategory: "/categories",
	logout: "/auth/logout",
	getUserProfile: "/auth/me",
	createPracticeSession: "/practice/sessions/create",
	getPracticeSession: "/practice/sessions", // GET /practice/sessions/:id
	submitAnswer: "/practice/sessions", // PUT /practice/sessions/:id/answer
	completeSession: "/practice/sessions", // PUT /practice/sessions/:id/complete
	getUserSessions: "/practice/sessions", // GET /practice/sessions
	adminPendingQuestions: "/questions/admin/pending", // GET pending questions for review
	adminReviewStats: "/questions/admin/review-stats", // GET review statistics
	adminReviewQuestion: "/questions/admin/review", // GET /questions/admin/review/:id
	adminUpdateReviewStatus: "/questions/admin/review", // PUT /questions/admin/review/:id/status
	adminAddReviewComment: "/questions/admin/review", // POST /questions/admin/review/:id/comment
};
