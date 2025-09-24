import { Provider } from "@/common/provider";
import logo from "@/public/logo2.png";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "InterviewFuel",
	icons: {
		icon: logo.src,
	},

	description:
		"Generate interview questions and practice mock interviews with AI.",

	metadataBase: new URL("https://interviewfuel.com"),
	applicationName: "InterviewFuel",
	creator: "InterviewFuel",
	publisher: "InterviewFuel",
	openGraph: {
		title: "InterviewFuel",
		description:
			"Generate interview questions and practice mock interviews with AI.",
		url: "https://interviewfuel.com",
		siteName: "InterviewFuel",
		images: [
			{
				url: logo.src,
				width: 800,
				height: 600,
			},
			{
				url: logo.src,
				width: 1800,
				height: 1600,
				alt: "InterviewFuel Logo",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href={logo.src} />
			<title>InterviewFuel</title>
			<meta
				name="description"
				content="Generate interview questions and practice mock interviews with AI."
			/>
			<meta
				name="keywords"
				content="AI, Interview, Questions, Mock Interview, Practice, Job Interview, Technical Interview, Behavioral Interview, Coding Interview, HR Interview, Interview Preparation, Career, Employment, Job Search, Resume, Cover Letter, Job Application, Recruitment, Hiring, Talent Acquisition, Interview Coaching, Interview Tips, Interview Strategies, Job Skills, Professional Development, Career Growth, Job Market, Interview Simulation, Interview Training, Interview Feedback, Interview Assessment, Job Readiness, Interview Techniques, Interview Success, Job Interview Questions, Interview Answers, Interview Scenarios, Interview Role Play, Interview Practice, Job Interview Preparation, Interview Guide, Interview Resources, Interview Tools, Interview Software, Interview Platform, Interview App, Interview Website, Interview Service, Interview Solution, Interview Innovation, Interview Technology, Interview AI, Interview Bot, Interview Assistant, Interview Helper, Interview Support, Interview Improvement, Interview Enhancement, Interview Optimization, Interview Effectiveness, Interview Efficiency, Interview Performance, Interview Results, Interview Outcomes, Interview Insights, Interview Analytics, Interview Metrics, Interview Data, Interview Trends, Interview Research, Interview Studies, Interview Reports, Interview Reviews, Interview Testimonials, Interview Success Stories, Interview Case Studies, Interview Examples, Interview Samples, Interview Templates, Interview Formats, Interview Styles, Interview Approaches, Interview Methods, Interview Techniques, Interview Best Practices, Interview Tips and Tricks, Interview Do's and Don'ts, Interview Common Mistakes, Interview Pitfalls, Interview Challenges, Interview Solutions, Interview Strategies for Success,from InterviewFuel, frontend, backend, fullstack, developer, engineer, designer, manager, recruiter ,top interview questions, interview questions for top companies, interview questions for tech companies, interview questions for FAANG, interview questions for startups"
			/>
			<meta name="author" content="InterviewFuel" />
			<meta name="robots" content="index, follow" />
			<meta name="language" content="English" />
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
