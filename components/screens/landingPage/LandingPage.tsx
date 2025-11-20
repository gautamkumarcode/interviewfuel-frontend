"use client";

import HashLoader from "@/components/custom/loader/Loader";
import { useClusterData } from "@/context/clusterData-context";
import {
	ArrowRight,
	BookOpen,
	CheckCircle,
	Code2,
	Sparkles,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import FrontedCard from "./components/fronted/FrontedCard";
import { GlobalSearch } from "./components/GlobalSearch";

interface StatItem {
	total: number;
	formatted: string;
	label: string;
}

interface LandingPageProps {
	initialStats?: {
		users: StatItem;
		questions: StatItem;
		successRate: StatItem;
		companies: StatItem;
		categories?: StatItem;
		practiceHours?: StatItem;
		sessions?: StatItem;
	};
}

const LandingPage = ({ initialStats }: LandingPageProps) => {
	const { categoryData, categoryLoading } = useClusterData();
	const categories = categoryData || [];

	// Log received stats for debugging

	// Use server-side stats or fallback to defaults
	const stats = initialStats || {
		users: { total: 100000, formatted: "100K", label: "Developers Trained" },
		questions: { total: 10000, formatted: "10K", label: "Practice Questions" },
		successRate: { total: 95, formatted: "95%", label: "Success Rate" },
		companies: { total: 500, formatted: "500+", label: "Companies Hiring" },
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
				{/* Animated background blobs */}
				<div className="absolute inset-0">
					<div className="absolute top-0 left-1/4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
					<div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
				</div>

				<div className="relative container mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
					<div className="flex flex-col items-center text-center max-w-4xl mx-auto">
						{/* Badge */}
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#19c862] to-[#0a8c3d] text-white text-sm font-medium mb-8 shadow-lg">
							<Star className="w-4 h-4 mr-2" />
							Trusted by 100,000+ developers worldwide
						</div>

						{/* Main heading */}
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
							Master Your Next
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#19c862] via-[#0a8c3d] to-emerald-600">
								Technical Interview
							</span>
						</h1>

						{/* Subheading */}
						<p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl leading-relaxed">
							Practice with AI-powered mock interviews, get instant feedback,
							and land your dream job. From coding challenges to system design.
						</p>

						{/* Search Box */}
						<div className="w-full max-w-2xl mb-10">
							<GlobalSearch />
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<Link
								href="/practice"
								className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#19c862] to-[#0a8c3d] text-white font-semibold rounded-xl hover:from-[#17b558] hover:to-[#097a35] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
								Start Practicing Free
								<ArrowRight className="ml-2 w-5 h-5" />
							</Link>

							<Link
								href="/questions"
								className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-[#19c862] transition-all duration-200 shadow-md hover:shadow-lg">
								<Sparkles className="mr-2 w-5 h-5" />
								Explore All Questions
							</Link>
						</div>

						{/* Social proof */}
						<div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
							<div className="flex items-center">
								<Users className="w-5 h-5 mr-2 text-[#19c862]" />
								<span className="font-medium">100,000+ Users</span>
							</div>
							<div className="flex items-center">
								<BookOpen className="w-5 h-5 mr-2 text-[#0a8c3d]" />
								<span className="font-medium">10,000+ Questions</span>
							</div>
							<div className="flex items-center">
								<Star className="w-5 h-5 mr-2 text-yellow-500 fill-current" />
								<span className="font-medium">4.9/5 Rating</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-white border-y border-gray-100">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{/* Primary Stats - Always show these 4 */}
						{[
							{
								number: stats.users.formatted,
								label: stats.users.label,
								color: "text-[#19c862]",
							},
							{
								number: stats.questions.formatted,
								label: stats.questions.label,
								color: "text-[#0a8c3d]",
							},
							{
								number: stats.successRate.formatted,
								label: stats.successRate.label,
								color: "text-emerald-600",
							},
							{
								number: stats.companies.formatted,
								label: stats.companies.label,
								color: "text-teal-600",
							},
						].map((stat, index) => (
							<div key={index} className="text-center">
								<div
									className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>
									{stat.number}
								</div>
								<div className="text-gray-600 font-medium">{stat.label}</div>
							</div>
						))}
					</div>

					{/* Additional Stats - Show if available */}
					{(stats.categories || stats.practiceHours || stats.sessions) && (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-200">
							{stats.categories && (
								<div className="text-center">
									<div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
										{stats.categories.formatted}
									</div>
									<div className="text-gray-600 font-medium">
										{stats.categories.label}
									</div>
								</div>
							)}
							{stats.practiceHours && (
								<div className="text-center">
									<div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">
										{stats.practiceHours.formatted}
									</div>
									<div className="text-gray-600 font-medium">
										{stats.practiceHours.label}
									</div>
								</div>
							)}
							{stats.sessions && (
								<div className="text-center">
									<div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">
										{stats.sessions.formatted}
									</div>
									<div className="text-gray-600 font-medium">
										{stats.sessions.label}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
							Everything You Need to
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#19c862] to-[#0a8c3d]">
								Ace Your Interview
							</span>
						</h2>
						<p className="max-w-3xl mx-auto text-xl text-gray-600">
							Our comprehensive platform provides all the tools and resources
							you need to prepare for technical interviews.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
						{[
							{
								icon: Zap,
								title: "AI-Powered Practice",
								description:
									"Get personalized interview questions and real-time feedback powered by advanced AI.",
								color: "text-[#19c862] bg-green-100",
							},
							{
								icon: Code2,
								title: "Coding Challenges",
								description:
									"Solve problems across multiple programming languages with instant evaluation.",
								color: "text-[#0a8c3d] bg-emerald-100",
							},
							{
								icon: TrendingUp,
								title: "Progress Tracking",
								description:
									"Monitor your improvement with detailed analytics and performance metrics.",
								color: "text-emerald-600 bg-teal-100",
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
								<div
									className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-6`}>
									<feature.icon className="w-6 h-6" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">
									{feature.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>

					{/* Trust badge */}
					<div className="bg-gradient-to-r from-[#19c862] to-[#0a8c3d] rounded-2xl p-8 text-center text-white">
						<h3 className="text-2xl font-bold mb-4">
							Trusted by Engineers at Top Companies
						</h3>
						<p className="text-green-100 max-w-2xl mx-auto mb-6">
							Our platform has helped thousands of developers land jobs at
							Google, Meta, Amazon, Microsoft, and more.
						</p>
						<div className="flex flex-wrap justify-center gap-6 opacity-80">
							{["Google", "Meta", "Amazon", "Microsoft", "Apple"].map(
								(company) => (
									<span key={company} className="text-white font-semibold">
										{company}
									</span>
								)
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-14">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
							Explore Interview Topics
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Browse through our comprehensive collection of technical topics to
							prepare for your next interview.
						</p>
					</div>

					{!categoryLoading ? (
						<FrontedCard frontedTopics={categories} />
					) : (
						<div className="flex items-center justify-center py-20">
							<HashLoader color="#19c862" />
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-br from-[#19c862] via-[#0a8c3d] to-emerald-700 relative overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
				</div>

				<div className="relative container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
							<Sparkles className="w-4 h-4 mr-2" />
							Start Your Journey Today
						</div>

						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
							Ready to Land Your Dream Job?
						</h2>

						<p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
							Join thousands of successful developers who used our platform to
							ace their technical interviews.
						</p>

						<div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
							{[
								"Unlimited practice sessions",
								"AI-powered feedback",
								"Progress tracking",
								"Community access",
							].map((benefit, index) => (
								<div key={index} className="flex items-center text-white">
									<CheckCircle className="w-5 h-5 text-white mr-3 flex-shrink-0" />
									<span>{benefit}</span>
								</div>
							))}
						</div>

						<Link
							href="/practice"
							className="inline-flex items-center px-10 py-5 bg-white text-[#19c862] font-bold text-lg rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
							Get Started Free
							<ArrowRight className="ml-2 w-6 h-6" />
						</Link>

						<p className="text-green-100 mt-6">
							No credit card required • Free forever
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;